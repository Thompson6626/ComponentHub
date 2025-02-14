package com.comphub.auth.dto;

import jakarta.validation.constraints.Email;

public record ResendVerificationRequest(
        @Email(message = "Must be valid email")
        String email
) {
}
