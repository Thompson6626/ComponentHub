package com.comphub.user.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateUsernameRequest(
        @NotBlank(message = "New username is required.")
        String newUsername
) {
}
