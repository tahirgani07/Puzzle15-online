package com.tahir.puzzle15online.service;

import com.tahir.puzzle15online.exception.GameNotFoundException;
import com.tahir.puzzle15online.exception.InvalidGameException;
import com.tahir.puzzle15online.exception.InvalidParamException;
import com.tahir.puzzle15online.model.*;
import com.tahir.puzzle15online.storage.GameStorage;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

import static com.tahir.puzzle15online.model.GameStatus.*;
import static com.tahir.puzzle15online.model.Move.DUMMY;
import static com.tahir.puzzle15online.model.Move.LEFT;

@Service
@AllArgsConstructor
@Slf4j
public class GameService {

    public Game createGame(Player player) {
        Game game = new Game();
        // Set something here
        game.setGameId(UUID.randomUUID().toString());
        game.setPlayer1(player);
        game.setStatus(NEW);
        game.setTargetGrid(Shared.START_GRID);
        game.setPlayGrid1(player.getPuzzleState());
        game.setPlayGrid2(player.getPuzzleState());

        GameStorage.getInstance().setGame(game);
        return game;
    }

    public Game connectToGame(Player player2, String gameId) throws InvalidParamException, InvalidGameException {
        if(!GameStorage.getInstance().getGames().containsKey(gameId)) {
            throw new InvalidParamException("Game with provided id doesn't exist");
        }
        Game game = GameStorage.getInstance().getGames().get(gameId);
        // If it already contains player 2 then no more players can join
        if(game.getPlayer2() != null) {
            throw new InvalidGameException("Game already has 2 players");
        }
        // Set player 2
        game.setPlayer2(player2);
        game.setStatus(IN_PROGRESS);
        // Replace the Game in the GameStorage with the current Game value;
        GameStorage.getInstance().setGame(game);
        return game;
    }

    public Game connectToRandomGame(Player player2) throws GameNotFoundException {
        Game game = GameStorage.getInstance().getGames().values().stream()
                .filter(it->it.getStatus().equals(NEW))
                .findFirst().orElseThrow(() -> new GameNotFoundException("No games found. Create a new game."));
        // Set player 2
        game.setPlayer2(player2);
        game.setStatus(IN_PROGRESS);
        // Replace the Game in the GameStorage with the current Game value;
        GameStorage.getInstance().setGame(game);
        return game;

    }

    private Grid makeMove(Grid g, Move move) {
        int[][] arr = g.getGrid();
        int x = g.getEmptyPos()[0];
        int y = g.getEmptyPos()[1];
        int newX = x, newY = y;
        if(move == Move.LEFT) newY--;
        if(move == Move.RIGHT) newY++;
        if(move == Move.TOP) newX--;
        if(move == Move.BOTTOM) newX++;

        arr[x][y] = arr[newX][newY];
        arr[newX][newY] = 0;
        int[] newEmptyPos = {newX, newY};
        Grid res = new Grid(arr, newEmptyPos);
        return res;
    }

    // called when a move is detected on /gameplay
    public Game gamePlay(GamePlay gamePlay) throws GameNotFoundException, InvalidGameException {
        if(!GameStorage.getInstance().getGames().containsKey(gamePlay.getGameId()))
            throw new GameNotFoundException("Game not found.");

        Game game = GameStorage.getInstance().getGames().get(gamePlay.getGameId());
        if(game.getStatus().equals(FINISHED))
            throw new InvalidGameException("Game is already Finished");

        // Add which move is made
        game.setCurMove(gamePlay.getMove().toString());

        Grid newGrid;
//        log.info(gamePlay.getPlayer().getName());
//        log.info(game.getPlayer1().getName());
        if(gamePlay.getMove() == DUMMY) return game;
        // Player1 has made a move
        if(gamePlay.getPlayer().getName().equals(game.getPlayer1().getName())) {
            game.setCurPlayerName(game.getPlayer1().getName());
            Grid grid = game.getPlayGrid1();
            newGrid = makeMove(grid, gamePlay.getMove());
            game.setPlayGrid1(newGrid);
//            log.info("Player 1 moved");
        }
        // Player2 has made a move
        else {
            game.setCurPlayerName(game.getPlayer2().getName());
            Grid grid = game.getPlayGrid2();
            newGrid = makeMove(grid, gamePlay.getMove());
            game.setPlayGrid2(newGrid);
//            log.info("Player 2 moved");
        }
        if (checkWinner(newGrid, game.getTargetGrid())) {
            game.setWinner(gamePlay.getPlayer());
            game.setStatus(FINISHED);
        }
        GameStorage.getInstance().setGame(game);
        return game;
    }

    private Boolean checkWinner(Grid startGrid, Grid targetGrid) {
        for(int i = 0; i < startGrid.getGrid().length; i++)
            for(int j = 0; j < startGrid.getGrid().length; j++)
                if(startGrid.getGrid()[i][j] != targetGrid.getGrid()[i][j])
                    return false;

        return true;
    }
}
