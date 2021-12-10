let hideGameOptionsOverlay = () => {
    $("#game-options-overlay").hide();
};

let showOpponentPuzzleAndSetOpponentName = () => {
  $("#puzzle-opponent").show();
  $("#player-vs-player").html(`${name} VS ${opponentName}`);
  mainPuzzleView.create(randomlyGeneratedGrid.grid);
  opponentPuzzleView.create(randomlyGeneratedGrid.grid);
};

let showWinnerOverlay = () => {
    $("#winner-overlay").show();
    $("#winner-name").html(winnerName);
};

let displayGameId = () => {
    $("#game-id-display").html(gameId);
};
