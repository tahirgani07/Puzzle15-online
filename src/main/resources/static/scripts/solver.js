MAX_HEAP_SIZE = 100000;

class MinHeap {
    data;
    constructor() {
        this.data = [];
    }

    push(val) {
        this.data.push(val);
        this.bubbleUp(this.data.length - 1);
        if(this.data.length === MAX_HEAP_SIZE)
            this.data.pop();
    }

    pop() {
        let front = this.data[0];
        let back = this.data.pop();
        if(this.data.length > 0) {
            this.data[0] = back;
            this.bubbleDown(0);
        }
        return front;
    }

    bubbleUp(curPos) {
        if (curPos === 0) {
            return;
        }
        let parentPos = ~~((curPos - 1) / 2);
        let cur = this.data[curPos];
        let parent = this.data[parentPos];
        if (cur.cost < parent.cost) {
            this.data[curPos] = parent;
            this.data[parentPos] = cur;
            return this.bubbleUp(parentPos);
        }
    }

    bubbleDown(curPos) {
        let leftPos = curPos * 2 + 1;
        let rightPos = curPos * 2 + 2;
        let cur = this.data[curPos];
        let left = this.data[leftPos];
        let right = this.data[rightPos];
        let swapPos = null;
        if ((left != null) && left.cost < cur.cost) {
            swapPos = leftPos;
        }
        if ((right != null) && right.cost < left.cost && right.cost < cur.cost) {
            swapPos = rightPos;
        }
        if (swapPos != null) {
            this.data[curPos] = this.data[swapPos];
            this.data[swapPos] = cur;
            return this.bubbleDown(swapPos);
        }
    }

    empty() {
        return this.data.length === 0;
    }
}

class Grid {
    grid;
    blankPos;

    constructor(grid, blankPos) {
        this.grid = grid;
        this.blankPos = blankPos;
    }

    getCost() {
        let cost = 0;
        for(let i = 0; i < SIZE; i++) {
            for(let j = 0; j < SIZE; j++) {
                if(this.grid[i][j] === 0) continue;
                let targetPos = posInTarget.get(this.grid[i][j]);
                // X distance
                cost += Math.abs(i - targetPos[0]);
                // Y distance
                cost += Math.abs(j - targetPos[1]);
            }
        }
        return cost;
    }

    getValidMoves() {
        let req = [];

        if(this.blankPos[1] !== 0)
            req.push(moveDir.LEFT);

        if(this.blankPos[1] !== SIZE - 1)
            req.push(moveDir.RIGHT);

        if(this.blankPos[0] !== 0)
            req.push(moveDir.TOP);

        if(this.blankPos[0] !== SIZE - 1)
            req.push(moveDir.BOTTOM);

        return req;
    }

    getGrid() {
        let gg = [];
        for(let i = 0; i < SIZE; i++) {
            gg.push([]);
            for(let j = 0; j < SIZE; j++)
                gg[i].push(this.grid[i][j]);
        }
        return gg;
    }

    makeMove(move) {
        let x = this.blankPos[0];
        let y = this.blankPos[1];

        let newBlankPos = moveBlank(x, y, move);
        let newX = newBlankPos[0];
        let newY = newBlankPos[1];

        let newGrid = this.getGrid();
        newGrid[x][y] = newGrid[newX][newY];
        newGrid[newX][newY] = 0;

        return new Grid(newGrid, newBlankPos);
    }
}

class PuzzleState {
    myGrid;
    steps;
    solved;
    cost;

    constructor(myGrid, steps) {
        this.myGrid = myGrid;
        this.steps = steps;
        this.cost = this.myGrid.getCost();
        this.solved = this.cost === 0;
        if(steps.length > 0) this.cost += steps.length;
    }
}

function shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function solve(sourceState, heap) {
    let its = 0;

    let pq;
    if(heap == null) {
        pq = new MinHeap();
        pq.push(sourceState);
    } else pq = heap;

    while(!pq.empty()) {
        its++;

        if(its === 1000) {
            setTimeout(() => {
                return solve(null, pq)
            }, 10);
            return;
        }

        //console.log(its);

        let cur = pq.pop();

        if(cur.solved) {
            // Giving a delay show it always shows the 'solving' overlay
            setTimeout(() => {
                // Hiding the overlay
                hideOverlay();
                // Applying steps on the PuzzleView that is displayed
                mainPuzzleView.applyMoves(cur.steps, showControlsContainer);
            }, 500);
            return cur;
        }
        let validMoves = cur.myGrid.getValidMoves();
        validMoves = shuffle(validMoves);

        let oppositeMove = "";
        if(cur.steps.length > 0)
            oppositeMove = getOppositeMove(cur.steps[cur.steps.length - 1]);

        for(let i = 0; i < validMoves.length; i++) {
            let move = validMoves[i];
            if(move === oppositeMove) continue;
            let nextSteps = [];
            if(cur.steps.length > 0)
                nextSteps = [].concat(cur.steps);
            nextSteps.push(move);
            let nextGrid = cur.myGrid.makeMove(move);
            //console.log(move);
            //console.log(nextGrid);
            let nextState = new PuzzleState(nextGrid, nextSteps);

            pq.push(nextState);
            //console.log(pq.data.length);
        }
    }
    console.log("Solution not found");
    return null;
}

$("#solve-btn").click(() => {
    if(play === false) return;
    let gg = [];
    let blankPos;
    for(let i = 0; i < SIZE; i++) {
        gg.push([]);
        for(let j = 0; j < SIZE; j++) {
            let num;
            if(mainPuzzleView.puzzle[i][j] == null) {
                num = 0;
                blankPos = [i, j];
            } else {
                num = mainPuzzleView.puzzle[i][j].number;
            }
            gg[i].push(num);
        }
    }
    let grid = new Grid(gg, blankPos);
    let sourceState = new PuzzleState(grid, []);
    if(!sourceState.solved) {
        hideControlsContainer("solving");
        let solvedPuzzleState = solve(sourceState, null);
        //console.log(solvedPuzzleState);
    }
});



