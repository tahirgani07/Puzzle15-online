package com.tahir.puzzle15online.exception;

public class GameNotFoundException extends Exception {
    private String message;

    public GameNotFoundException(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
