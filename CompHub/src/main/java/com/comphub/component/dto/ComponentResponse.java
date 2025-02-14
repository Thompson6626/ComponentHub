package com.comphub.component.dto;

import com.comphub.component.category.dto.CategoryDto;
import com.comphub.component.componentFile.dto.ComponentFileSummary;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@Builder
public class ComponentResponse {
        private long id;
        private String name;
        private String description;
        private Set<CategoryDto> categories;

        private Creator creator;

        private ComponentFileSummary file;

        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime createdAt;

        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime updatedAt;

        private long upVotes;
        private long downVotes;
}
