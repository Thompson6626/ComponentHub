package com.comphub.component.dto;

import java.util.Set;
import java.time.LocalDate;

import com.comphub.component.category.dto.CategoryDto;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ComponentShowcase {

        private Long id;
        private String name;
        private Set<CategoryDto> categories;
        private String imageUrl;
        private Creator creator;
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate createdAt;
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate updatedAt;
        private String description;
}
