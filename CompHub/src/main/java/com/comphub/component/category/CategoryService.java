package com.comphub.component.category;


import com.comphub.component.category.dto.CategoryDto;
import com.comphub.component.category.dto.CategoryRequest;
import com.comphub.component.category.dto.CategoryUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    public CategoryDto createCategory(
            CategoryRequest request
    ) {
        Category category = categoryMapper.toEntity(request);

        category = categoryRepository.save(category);
        return categoryMapper.toResponse(category);
    }

    public CategoryDto updateCategory(Long id, CategoryUpdateRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category with id " + id + " not found"));

        if (request.name() != null) category.setName(request.name());
        if (request.description() != null) category.setDescription(request.description());
        category = categoryRepository.save(category);

        return categoryMapper.toResponse(category);
    }

    public void deleteCategory(Long categoryId) {
        categoryRepository.deleteById(categoryId);
    }
}
