package com.comphub.component.category;

import com.comphub.component.category.dto.CategoryDto;
import com.comphub.component.category.dto.CategoryRequest;
import org.springframework.stereotype.Service;

@Service
public class CategoryMapper {


    public CategoryDto toResponse(Category category) {
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }

    public CategoryDto toShowCase(Category category) {
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .build();
    }

    public Category toEntity(CategoryRequest request) {
        return Category.builder()
                .name(request.name())
                .description(request.description())
                .build();
    }
}
