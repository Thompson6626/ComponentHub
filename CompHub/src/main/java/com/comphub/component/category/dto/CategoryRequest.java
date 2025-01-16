package com.comphub.component.category.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequest(
        @NotBlank(message = "Name must not be empty")
        String name,
        @NotBlank
        String description
) {
}
