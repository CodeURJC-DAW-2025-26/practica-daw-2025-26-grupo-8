package com.aparizzio.pizzeria.dto;

import org.springframework.stereotype.Component;
import com.aparizzio.pizzeria.model.Product;
import com.aparizzio.pizzeria.dto.ProductDTO;

@Component
public class ProductMapper {

    // Converts a Product entity into a ProductDTO
    public ProductDTO toDTO(Product product) {

        boolean hasImage = product.getImage() != null;

        // Safely extract the category title (if category exists) to avoid infinite
        // recursion
        String categoryTitle = null;
        if (product.getCategory() != null) {
            categoryTitle = product.getCategory().getTitle();
        }

        return new ProductDTO(
                product.getId(),
                product.getTitle(),
                product.getDescription(),
                product.getShortDescription(),
                product.getPrice(),
                product.getAllergies(),
                categoryTitle,
                hasImage);
    }
}