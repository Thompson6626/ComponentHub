package com.comphub.component.category.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class CategoryDto{
        Long id;
        String name;
        String description;
}
