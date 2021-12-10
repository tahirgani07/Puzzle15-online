<!DOCTYPE html>
<html>
<head>
    <meta charset="ISO-8859-1">
    <title>15 Puzzle - online</title>
    <link href="styles/style.css" rel="stylesheet">
    <link href="styles/puzzle-online.css" rel="stylesheet">
    <!--    libs for stomp and sockjs-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.4.0/sockjs.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js"></script>
    <!--    end libs for stomp and sockjs-->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>
</head>
<body>

<div id="game-options-overlay">
    <div id="game-options-container">
        <h1>Create/Enter Game</h1>
        <input id="name" placeholder="Enter your name">
        <div class="new-game-container">
            <h5>Create a new Game</h5>
            <button onclick="createGame(hideGameOptionsOverlay,
            showOpponentPuzzleAndSetOpponentName,
            showWinnerOverlay,
            displayGameId)">Create a new game</button>
        </div>
        <div class="random-game-container">
            <h5>Connect to a Random game</h5>
            <button onclick="connectRandom(hideGameOptionsOverlay,
            showOpponentPuzzleAndSetOpponentName,
            showWinnerOverlay,
            displayGameId)">Connect to random game</button>
        </div>
        <div class="game-with-game-id-container">
            <h5>Connect to a game with Game ID</h5>
            <input id="game_id" placeholder="Enter a game id">
            <button onclick="connectWithGameId(hideGameOptionsOverlay,
            showOpponentPuzzleAndSetOpponentName,
            showWinnerOverlay,
            displayGameId)">Enter game</button>
        </div>
    </div>
</div>

<div id="winner-overlay" style="display: none">
    <div id="winner-container">
        <h1><span id="winner-name"></span> Won!</h1>
        <a href="/">Main Menu</a>
        <a href="/online">Play again!</a>
    </div>
</div>

<div class="header">
    <h1>Fifteen Puzzle online</h1>
    <div>Game ID: <span id="game-id-display"></span></div>
    <span id="player-vs-player">Waiting for opponent...</span>
</div>

<div class="puzzle-container">
    <div id="puzzle-main" class="puzzle">
    </div>

    <div id="puzzle-opponent" class="puzzle" style="display: none"></div>
</div>

<!-- SCRIPT IMPORTS -->
<script>
    let online = true;
</script>
<script src="scripts/shared.js"></script>
<script src="scripts/puzzle.js"></script>
<script src="scripts/solver.js"></script>
<script src="scripts/socket_conn.js"></script>
<script src="scripts/puzzle-online.js"></script>
</body>
</html>