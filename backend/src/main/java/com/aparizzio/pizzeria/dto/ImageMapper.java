package com.aparizzio.pizzeria.dto;

import org.springframework.stereotype.Component;
import com.aparizzio.pizzeria.model.Image;
import com.aparizzio.pizzeria.dto.ImageDTO;

@Component
public class ImageMapper {

    // Converts an Image entity into an ImageDTO
    public ImageDTO toDTO(Image image) {
        return new ImageDTO(image.getId());
    }
}