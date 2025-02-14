package com.comphub.common;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SimpleResponse {

    private String message;
    private LocalDateTime timestamp;

    public SimpleResponse(String message) {
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }
}
