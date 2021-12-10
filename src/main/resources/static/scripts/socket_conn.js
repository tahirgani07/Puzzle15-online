const url = 'http://localhost:8082';
let stompClient;

connectToSocket = (gameId, showOpponentPuzzleFunction, showWinnerOverlayFunction) => {
    console.log("Connecting to the game");
    let socket = new SockJS(url+"/gameplay");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame)=>{
       console.log("Connected to the frame: " + frame);
       // This listens to all the moves made.
       stompClient.subscribe("/topic/game-progress/"+gameId, (response)=>{
           let data = JSON.parse(response.body);
           if(data.curPlayerName !== name && data.curMove.toLowerCase() !== "dummy") {
                   opponentPuzzleView.makeAMove(data.curMove.toLowerCase());
           }
           if(data.status == "FINISHED") {
               // alert(`${data.winner.name} WON!`);
               winnerName = data.winner.name;
               if(showWinnerOverlayFunction != null)
                   showWinnerOverlayFunction();
           }

           if(data.curMove.toLowerCase() === "dummy" && showOpponentPuzzleFunction != null) {
               opponentName = data.player2.name;
               showOpponentPuzzleFunction();
           }
       });
    });
};

createGame = (hideOverlayFunction,
              showOpponentPuzzleFunction,
              showWinnerOverlayFunction,
              displayGameIdFunction) => {
    name = document.getElementById("name").value;
    if(name == null || name.trim() === '') {
        alert("Please enter name");
        return;
    }
    if(hideOverlayFunction != null) hideOverlayFunction();
    randomlyGeneratedGrid = getRandomGrid();
    $.ajax({
        url: url + "/online/start",
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        data: JSON.stringify({
            "name": name,
            "puzzleState": randomlyGeneratedGrid,
        }),
        success: (data) => {
            gameId = data.gameId;
            if(displayGameIdFunction != null) displayGameIdFunction();
            connectToSocket(gameId, showOpponentPuzzleFunction, showWinnerOverlayFunction);
            alert("Game created : " + gameId);
        },
        error: (error) => {
            console.log(error);
        }
    });
}

connectRandom = (hideOverlayFunction,
                 showOpponentPuzzleFunction,
                 showWinnerOverlayFunction,
                 displayGameIdFunction) => {
    name = document.getElementById("name").value;
    if(name == null || name.trim() === '') {
        alert("Please enter name");
        return;
    }
    if(hideOverlayFunction != null) hideOverlayFunction();
    $.ajax({
        url: url + "/online/connect/random",
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        data: JSON.stringify({
            "name": name
        }),
        success: (data) => {
            gameId = data.gameId;
            if(displayGameIdFunction != null) displayGameIdFunction();
            connectToSocket(gameId, showOpponentPuzzleFunction, showWinnerOverlayFunction);
            alert("Connected to game : " + gameId);
            alert("You are playing with: " + data.player1.name);
            dummyRequest(showOpponentPuzzleFunction);
        },
        error: (error) => {
            console.log(error);
        }
    });
};

connectWithGameId = (hideOverlayFunction,
                     showOpponentPuzzleFunction,
                     showWinnerOverlayFunction,
                     displayGameIdFunction) => {
    name = document.getElementById("name").value;
    let gId = document.getElementById("game_id").value;
    if(name == null || name.trim() === '') {
        alert("Please enter name");
        return;
    }
    if(gId == null || gId.trim() === '') {
        alert("Please enter the game ID");
        return;
    }
    if(hideOverlayFunction != null) hideOverlayFunction();
    $.ajax({
        url: url + "/online/connect",
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        data: JSON.stringify({
            "player": {
                "name": name
            },
            "gameId": gId
        }),
        success: (data) => {
            gameId = data.gameId;
            if(displayGameIdFunction != null) displayGameIdFunction();
            connectToSocket(gameId, showOpponentPuzzleFunction, showWinnerOverlayFunction);
            alert("Connected to game : " + gameId);
            alert("You are playing with: " + data.player1.name);
            dummyRequest(showOpponentPuzzleFunction);
        },
        error: (error) => {
            alert(error);
        }
    });
};

// Dummy request to the socket server
let dummyRequest = (showOpponentPuzzleFunction) => {
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
            // 4 is for dummy request
            "move": 4,
        }),
        success: (data) => {
            opponentName = data.player1.name;
            randomlyGeneratedGrid = {
                "grid": data.playGrid1.grid,
            }
            if(showOpponentPuzzleFunction != null) showOpponentPuzzleFunction();
        },
        error: (error) => {
            alert(error);
        }
    });
}