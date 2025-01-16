package com.comphub.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
        @NotBlank(message = "Username cannot be empty or null.")
        String username,
        @Email(message = "Please provide a valid email address.")
        @NotBlank(message = "Email cannot be empty or null.")
        String email,
        @NotBlank(message = "Password cannot be empty or null.")
        String password
) {
}
