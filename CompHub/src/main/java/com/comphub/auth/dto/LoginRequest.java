package com.comphub.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Must provide a valid username.")
        String username,
        @NotBlank(message = "Password cannot be empty or null.")
        String password
) {
}
