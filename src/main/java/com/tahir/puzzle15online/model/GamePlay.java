package com.tahir.puzzle15online.model;

import lombok.Data;

@Data
public class GamePlay {

    private Player player;
    private Move move;
    private String gameId;
}
