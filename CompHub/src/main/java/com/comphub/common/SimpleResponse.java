package com.comphub.common;

import java.time.LocalDateTime;

public class SimpleResponse {

    private String message;
    private LocalDateTime timestamp;

    public SimpleResponse(String message) {
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }
}
