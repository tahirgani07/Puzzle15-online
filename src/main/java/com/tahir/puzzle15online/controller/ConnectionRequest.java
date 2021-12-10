package com.tahir.puzzle15online.controller;

import com.tahir.puzzle15online.model.Player;
import lombok.Data;

@Data
public class ConnectionRequest {
    private Player player;
    private String gameId;
}
