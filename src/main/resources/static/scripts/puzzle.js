// make the child class call the function of the parent class
const __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

class PuzzleCell {
    row;
    col;
    number;
    node;
    controller;
    isCellOfMainPuzzleView;

    constructor(row, col, number, controller, isCellOfMainPuzzleView = true) {
        this.row = row;
        this.col = col;
        this.number = number;
        this.controller = controller;
        // Main Puzzle means your puzzle and the other is the opponents puzzle.
        this.isCellOfMainPuzzleView = isCellOfMainPuzzleView;
        if(number !== 0) {
            this.node = $('<div/>', {
                "class": 'cell',
                text: this.number,
            });
            this.node.mousedown(__bind(function() {
                if(play === false || !this.isCellOfMainPuzzleView) return;
                return this.controller.moveCell(this.row, this.col);
            }, this));
        }

    }

    setPosition(row, col, duration) {
        this.row = row;
        this.col = col;
        if (duration == null)
            duration = 0;
        return this.node.animate({
            top: "" + (2*cellSpacing + this.row*(cellSize + cellSpacing)) + "px",
            left: "" + (2*cellSpacing + this.col*(cellSize + cellSpacing)) + "px"
        }, duration);
    }
}

class PuzzleView {
    id;
    puzzle; // Grid of puzzle Cells
    blankPos;
    isMainPuzzle;

    constructor(id, isMainPuzzle) {
        this.id = id;
        this.puzzle = [];
        this.blankPos = [];
        this.isMainPuzzle = isMainPuzzle;
    }

    create(grid) {
        let curCell;
        let rowId;
        if(this.isMainPuzzle)
            rowId = "row";
        else rowId = "row-opponent"
        for(let i = 0; i < SIZE; i++) {
            $("#"+this.id).append(`<div class='row' id='${rowId}-${i}'></div>`);
            this.puzzle.push([]);
            for(let j = 0; j < SIZE; j++) {
                if(grid[i][j] === 0) {
                    this.blankPos = [i, j];
                    curCell = null;
                } else {
                    curCell = new PuzzleCell(i, j, grid[i][j], this, this.isMainPuzzle);
                    curCell.setPosition(i, j, 500);
                    $(`#${rowId}-${i}`).append(curCell.node);

                    // Set node's height and width
                    curCell.node.css("height", cellSize);
                    curCell.node.css("width", cellSize);
                    // Setting node's color
                    if((i+j%SIZE)%2 === 0) {
                        curCell.node.css("background", cellBgColorDark);
                        curCell.node.css("color", cellTextColor1);
                    } else {
                        curCell.node.css("background", cellBgColorLight);
                        curCell.node.css("color", cellTextColor2);
                    }
                }
                this.puzzle[i].push(curCell);
            }
        }
    }
    // left - 0, right - 1, top - 2, bottom - 3.
    getMoveNo(prevRow, prevCol, curRow, curCol) {
        if(prevCol - curCol > 0) return 0;
        if(prevCol - curCol < 0) return 1;
        if(prevRow - curRow > 0) return 2;
        return 3;
    }

    moveCell(curRow, curCol) {
        let x = this.blankPos[0];
        let y = this.blankPos[1];
        if(curRow === x && curCol === y) return;
        if((Math.abs(x - curRow) + Math.abs(y - curCol)) > 1)
            return;

        // Move no to pass to the server
        let moveNo = this.getMoveNo(x, y, curRow, curCol);

        this.puzzle[curRow][curCol].setPosition(x, y, moveSpeed); // This changes the row/col of the puzzle cell inside itself(PuzzleCell)
        this.puzzle[x][y] = this.puzzle[curRow][curCol]; // This changes the row/col of the puzzle cell inside puzzle array.
        this.puzzle[curRow][curCol] = null; // Making the previous position null
        this.blankPos = [curRow, curCol]; // Changing the position of the blank

        // Sending data to the server if it os the main puzzle and the game type selected is online.
        if(this.isMainPuzzle && online) {
            name = document.getElementById("name").value;
            // Passing the gameplay to server
            $.ajax({
                url: url + "/online/gameplay",
                type: "POST",
                dataType: "JSON",
                contentType: "application/json",
                data: JSON.stringify({
                    "player": {
                        "name": name
                    },
                    "gameId": gameId,
                    "move": moveNo,
                }),
                success: (data) => {
                    // gameId = data.gameId;
                },
                error: (error) => {
                    console.log(error);
                }
            });
        }

        // To check if the offline user has won and stop the timer if they have.
        if(!online) {
            let foundMatch = true;
            // Checking if the user has won or not
            for(let i = 0; i < SIZE; i++) {
                for(let j = 0; j < SIZE; j++) {
                    if(this.puzzle[i][j] == null) {
                        if(TARGET_GRID[i][j] !== 0)
                            foundMatch = false;
                        continue;
                    }
                    if(this.puzzle[i][j].number !== TARGET_GRID[i][j])
                        foundMatch = false;
                }
            }
            if(foundMatch) {
                timerRun = false;
            }
        }
    }

    applyMoves(moveList, functionToRunAfter) {
        let totalMoves = moveList.length;
        play = false;
        for(let i = 0; i < moveList.length; i++) {
            setTimeout(()=>{
                this.makeAMove(moveList[i]);
                totalMoves--;
                if(totalMoves === 0) {
                    play = true;
                    if(functionToRunAfter != null) functionToRunAfter();
                }
            }, i*moveSpeed);
        }
    }

    makeAMove(move) {
        let x = this.blankPos[0];
        let y = this.blankPos[1];

        let rowToMove = x, colToMove = y;

        if(move == moveDir.LEFT)
            colToMove--;
        else if(move == moveDir.RIGHT)
            colToMove++;
        else if(move == moveDir.TOP)
            rowToMove--;
        else if(move == moveDir.BOTTOM)
            rowToMove++;

        this.moveCell(rowToMove, colToMove);
    }
}

function getOppositeMove(move) {
    if(move === moveDir.LEFT) return moveDir.RIGHT;
    if(move === moveDir.RIGHT) return moveDir.LEFT;
    if(move === moveDir.TOP) return moveDir.BOTTOM;
    if(move === moveDir.BOTTOM) return moveDir.TOP;
}

function getValidMoves(x, y, prev) {
    let validMoves = [];
    if(x !== 0 && prev !== moveDir.BOTTOM) validMoves.push(moveDir.TOP);
    if(x !== SIZE - 1 && prev !== moveDir.TOP) validMoves.push(moveDir.BOTTOM);
    if(y !== 0 && prev !== moveDir.RIGHT) validMoves.push(moveDir.LEFT);
    if(y !== SIZE - 1 && prev !== moveDir.LEFT) validMoves.push(moveDir.RIGHT);

    return validMoves;
}

function moveBlank(x, y, move) {
    if(move === moveDir.LEFT) y--;
    if(move === moveDir.RIGHT) y++;
    if(move === moveDir.TOP) x--;
    if(move === moveDir.BOTTOM) x++;
    return [x, y];
}


////////////// MAIN //////////////
const mainPuzzleDivId = "puzzle-main";
const opponentPuzzleDivId = "puzzle-opponent";

$("#"+mainPuzzleDivId).css("height", puzzleSize + 7*cellSpacing);
$("#"+mainPuzzleDivId).css("width", puzzleSize + 7*cellSpacing);

$("#"+opponentPuzzleDivId).css("height", puzzleSize + 7*cellSpacing);
$("#"+opponentPuzzleDivId).css("width", puzzleSize + 7*cellSpacing);

let mainPuzzleView = new PuzzleView(mainPuzzleDivId, true);
let opponentPuzzleView = new PuzzleView(opponentPuzzleDivId, false);

if(!online) {
    mainPuzzleView.create(START_GRID);
    opponentPuzzleView.create(START_GRID);
}

// let mainPuzzleView = new PuzzleView(mainPuzzleDivId, true);
// mainPuzzleView.create(START_GRID);
//
// let opponentPuzzleView = new PuzzleView(opponentPuzzleDivId, false);
// opponentPuzzleView.create(START_GRID);

//p.puzzle[3][2].setPosition(3, 3, 100);
//p.puzzle[3][3].setPosition(3, 3, 100);

let onShuffleClick = () => {
    if(play === false) return;
    let moveList = getRandomMoves();
    //console.log(moveList);
    hideControlsContainer("shuffling");
    mainPuzzleView.applyMoves(moveList, showControlsContainer);
};

let getRandomMoves = () => {
    let pos = [3, 3];
    let noOfMoves = 20;
    let moveList = [];
    while(noOfMoves-- > 0) {
        let n = moveList.length;
        let validMoves = [];
        if(n > 0)
            validMoves = getValidMoves(pos[0], pos[1], moveList[n - 1]);
        else validMoves = getValidMoves(pos[0], pos[1], "");

        let randomNo = Math.floor(Math.random()*validMoves.length);

        let curMove = validMoves[randomNo];
        moveList.push(curMove);
        pos = moveBlank(pos[0], pos[1], curMove);
    }
    console.log(moveList);
    return moveList;
};

let getRandomGrid = () => {
    let randMoves = getRandomMoves();
    let randGrid = START_GRID;
    let blankPos = [3, 3];
    randMoves.forEach(move=>{
        let x = blankPos[0], y = blankPos[1];
        if(move === "top") {
            randGrid[x][y] = randGrid[x - 1][y];
            randGrid[x - 1][y] = 0;
            x--;
        }
        if(move === "bottom") {
            randGrid[x][y] = randGrid[x + 1][y];
            randGrid[x + 1][y] = 0;
            x++;
        }
        if(move === "left") {
            randGrid[x][y] = randGrid[x][y - 1];
            randGrid[x][y - 1] = 0;
            y--;
        }
        if(move === "right") {
            randGrid[x][y] = randGrid[x][y + 1];
            randGrid[x][y + 1] = 0;
            y++
        }
        blankPos = [x, y];
    });
    return {
      "grid": randGrid,
      "emptyPos": blankPos,
    };
}

// On shuffle button click
$("#shuffle-btn").click(onShuffleClick);

