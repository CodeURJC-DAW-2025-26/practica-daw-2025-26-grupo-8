package com.aparizzio.pizzeria.dto;

public class CategoryDTO {

    private Long id;
    private String title;
    private String description;
    private boolean hasImage; // To let the frontend know if it should request the image

    // Empty constructor required by Jackson for JSON deserialization
    public CategoryDTO() {
    }

    public CategoryDTO(Long id, String title, String description, boolean hasImage) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.hasImage = hasImage;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isHasImage() {
        return hasImage;
    }

    public void setHasImage(boolean hasImage) {
        this.hasImage = hasImage;
    }
}