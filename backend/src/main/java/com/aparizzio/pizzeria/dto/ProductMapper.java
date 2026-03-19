package com.aparizzio.pizzeria.dto;

import org.springframework.stereotype.Component;
import com.aparizzio.pizzeria.model.Product;

@Component
public class ProductMapper {

    // Converts a Product entity into a ProductDTO
    public ProductDTO toDTO(Product product) {

        boolean hasImage = product.getImage() != null;

        // Safely extract the category title AND ID (if category exists)
        String categoryTitle = null;
        Long categoryId = null;

        if (product.getCategory() != null) {
            categoryTitle = product.getCategory().getTitle();
            categoryId = product.getCategory().getId();
        }

        return new ProductDTO(
                product.getId(),
                product.getTitle(),
                product.getDescription(),
                product.getShortDescription(),
                product.getPrice(),
                product.getAllergies(),
                categoryId,
                categoryTitle,
                hasImage);
    }
}