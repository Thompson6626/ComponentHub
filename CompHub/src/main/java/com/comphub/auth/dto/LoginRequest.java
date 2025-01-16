package com.comphub.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @Email(message = "Please provide a valid email address.")
        String email,
        @NotBlank(message = "Password cannot be empty or null.")
        String password
) {
}
