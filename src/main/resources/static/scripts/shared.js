const SIZE = 4;
const START_GRID = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 0]
];

const TARGET_GRID = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 0]
];

// Making map to calculate Manhattan distance
let posInTarget = new Map();
for(let i = 0; i < SIZE; i++) {
    for(let j = 0; j < SIZE; j++) {
        posInTarget.set(TARGET_GRID[i][j], [i, j]);
    }
}

const puzzleSize = 100*4;
const cellSize = puzzleSize/4;
const cellSpacing = 5;
const moveSpeed = 200;
const cellBgColorDark = "#EA7463";
const cellTextColor1 = "#fff";
const cellBgColorLight = "#7185EB";
const cellTextColor2 = "#fff";
let play = true;
let gameId = "";
let name;
let gameStatus = "";
let opponentName = "";
let winnerName = "";
let randomlyGeneratedGrid;

let puzzleSolvedInOffline = false;

const moveDir = {
    LEFT: "left",
    RIGHT: "right",
    TOP: "top",
    BOTTOM: "bottom",
    get: function(no) {
        if(no === 0) return this.LEFT;
        if(no === 1) return this.RIGHT;
        if(no === 2) return this.TOP;
        if(no === 3) return this.BOTTOM;
    }
};

function hideControlsContainer(overlayMsg) {
    $("#controls-container").css("transform", "scale(1, 0)");
    if(overlayMsg != null) showOverlay(overlayMsg);
}

function showControlsContainer() {
    $("#controls-container").css("transform", "scale(1, 1)");
    hideOverlay();
}

function showOverlay(overlayMsg) {
    let overlay = $("#overlay");
    overlay.html("<div class='overlay-text-container'>"+overlayMsg+"</div>");
    overlay.css("display", "flex");
}

function hideOverlay() {
    $("#overlay").css("display", "none");
}
