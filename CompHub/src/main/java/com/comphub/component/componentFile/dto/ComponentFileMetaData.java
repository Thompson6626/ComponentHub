package com.comphub.component.componentFile.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ComponentFileMetaData(
        @NotNull(message = "Give a valid id")
        @Positive(message = "Component ID must be a positive number")
        Long componentId
) {
}
