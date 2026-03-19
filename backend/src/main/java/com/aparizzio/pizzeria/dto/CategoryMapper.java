package com.aparizzio.pizzeria.dto;

import org.springframework.stereotype.Component;
import com.aparizzio.pizzeria.model.Category;

@Component
public class CategoryMapper {

    // Converts a Category entity into a CategoryDTO
    public CategoryDTO toDTO(Category category) {

        // Check if the category has an associated image
        boolean hasImage = category.getImage() != null;

        return new CategoryDTO(
                category.getId(),
                category.getTitle(),
                category.getDescription(),
                hasImage);
    }
}