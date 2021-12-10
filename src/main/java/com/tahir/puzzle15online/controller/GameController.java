package com.tahir.puzzle15online.controller;

import com.tahir.puzzle15online.exception.GameNotFoundException;
import com.tahir.puzzle15online.exception.InvalidGameException;
import com.tahir.puzzle15online.exception.InvalidParamException;
import com.tahir.puzzle15online.model.Game;
import com.tahir.puzzle15online.model.GamePlay;
import com.tahir.puzzle15online.model.Player;
import com.tahir.puzzle15online.service.GameService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@AllArgsConstructor
@RequestMapping("/online")
public class GameController {

    private final GameService gameService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @PostMapping("/start")
    public ResponseEntity<Game> start(@RequestBody Player player) {
        log.info("start game request: {}", player);
        return ResponseEntity.ok(gameService.createGame(player));
    }

    @PostMapping("/connect")
    public ResponseEntity<Game> connect(@RequestBody ConnectionRequest request) throws InvalidParamException, InvalidGameException {
        log.info("Connect request: {}", request);
        return ResponseEntity.ok(gameService.connectToGame(request.getPlayer(), request.getGameId()));
    }

    @PostMapping("/connect/random")
    public ResponseEntity<Game> connectRandom(@RequestBody Player player) throws GameNotFoundException {
        log.info("Connect random: {}", player);
        return ResponseEntity.ok(gameService.connectToRandomGame(player));
    }

    @PostMapping("/gameplay")
    public ResponseEntity<Game> gamePlay(@RequestBody GamePlay request) throws InvalidGameException, GameNotFoundException {
        log.info("Gameplay: {}", request);
        Game game = gameService.gamePlay(request);
        simpMessagingTemplate.convertAndSend("/topic/game-progress/"+game.getGameId(), game);
        return ResponseEntity.ok(game);
    }
}
