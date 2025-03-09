package com.comphub.component.dto;

import com.comphub.component.category.dto.CategoryDto;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;
import java.util.Set;

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
