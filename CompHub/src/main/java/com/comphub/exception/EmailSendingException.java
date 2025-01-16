package com.comphub.exception;

import jakarta.mail.MessagingException;

public class EmailSendingException extends MessagingException {
    public EmailSendingException(String message) {
        super(message);
    }
}