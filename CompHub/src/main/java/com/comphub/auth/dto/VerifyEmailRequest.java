package com.comphub.auth.dto;

public record VerifyEmailRequest(
        String verificationToken
) {
}
