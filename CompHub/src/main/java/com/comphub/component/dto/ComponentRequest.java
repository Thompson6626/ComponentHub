package com.comphub.component.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Set;


public record ComponentRequest(
        @NotBlank(message = "Name cannot be empty")
        String name,
        String description,
        Set<Long> categoryIds
) {
}
