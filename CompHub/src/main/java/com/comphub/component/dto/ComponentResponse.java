package com.comphub.component.dto;

import com.comphub.component.category.dto.CategoryDto;
import com.comphub.component.componentFile.dto.ComponentFileDto;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record ComponentResponse(
        String name,
        String description,
        Set<CategoryDto> categories,
        List<ComponentFileDto> files,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime createdAt,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime updatedAt,
        long upVotes,
        long downVotes
){

}
