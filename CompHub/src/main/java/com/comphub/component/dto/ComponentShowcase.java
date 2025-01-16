package com.comphub.component.dto;

import java.util.Set;
import java.time.LocalDate;

import com.comphub.component.category.dto.CategoryDto;
import com.fasterxml.jackson.annotation.JsonFormat;

public record ComponentShowcase(
        Long id,
        String name,
        Set<CategoryDto> categories,
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate updatedAt,
        String description
) {

}
