package com.tahir.puzzle15online.model;

import lombok.Data;

@Data
public class Game {

    private String gameId;
    private Player player1;
    private Player player2;
    private GameStatus status;
    private String curPlayerName;
    private String curMove;
    private Grid playGrid1;
    private Grid playGrid2;
    private Grid targetGrid;
    private Player winner;
}
