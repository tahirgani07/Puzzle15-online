<!DOCTYPE html>
<html>
<head>
  <meta charset="ISO-8859-1">
  <title>15 Puzzle</title>
  <link href="styles/style.css" rel="stylesheet">
  <link href="styles/puzzle-1p.css" rel="stylesheet">
  <!--    libs for stomp and sockjs-->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.4.0/sockjs.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js"></script>
  <!--    end libs for stomp and sockjs-->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>
</head>
<body>

<div id="option-overlay">
  <div id="option-container">
    <h1>Select Mode</h1>
    <button onclick="onTimedHandle()">Timed</button>
    <button onclick="onFreeplayHandle()">Freeplay</button>
  </div>
</div>

<div id="won-overlay" style="display: none">
  <div id="won-container">
    <h1>Solved!</h1>
    <span class="timer"></span>
    <h5>Time taken</h5>
    <a href="/">Main Menu</a>
    <a href="/offline">Play again!</a>
  </div>
</div>

<div class="puzzle-container">
  <div id="puzzle-main" class="puzzle">
    <div id="timer-container" style="display: none">
      Time: <span class="timer"></span>
    </div>

    <div id="overlay"></div>
    <div id="controls-container">
      <button class="control-btn" id="shuffle-btn">Shuffle</button>
      <div class="logo">Fifteen Puzzle</div>
      <button class="control-btn" id="solve-btn">Solve</button>
    </div>
  </div>
</div>

<!-- SCRIPT IMPORTS -->
<script>
  let online = false;
</script>
<script src="scripts/shared.js"></script>
<script src="scripts/puzzle.js"></script>
<script src="scripts/solver.js"></script>
<script src="scripts/puzzle-offline.js"></script>
</body>
</html>