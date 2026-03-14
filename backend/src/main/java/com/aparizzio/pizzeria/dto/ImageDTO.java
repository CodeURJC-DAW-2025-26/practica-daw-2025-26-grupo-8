package com.aparizzio.pizzeria.dto;

public class ImageDTO {

    private Long id;

    // Empty constructor for Jackson
    public ImageDTO() {
    }

    public ImageDTO(Long id) {
        this.id = id;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}