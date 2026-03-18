package com.aparizzio.pizzeria.dto;

import java.util.List;

public class ProductDTO {

    private Long id;
    private String title;
    private String description;
    private String shortDescription;
    private int price;
    private List<String> allergies;

    // We flatten the category to avoid infinite recursion
    private String categoryTitle;
    private Boolean hasImage;

    // Empty constructor
    public ProductDTO() {
    }

    public ProductDTO(Long id, String title, String description, String shortDescription, int price,
            List<String> allergies, String categoryTitle, Boolean hasImage) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.shortDescription = shortDescription;
        this.price = price;
        this.allergies = allergies;
        this.categoryTitle = categoryTitle;
        this.hasImage = hasImage;
    }

    // Getters and Setters (Obligatorios para Jackson)
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

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public List<String> getAllergies() {
        return allergies;
    }

    public void setAllergies(List<String> allergies) {
        this.allergies = allergies;
    }

    public String getCategoryTitle() {
        return categoryTitle;
    }

    public void setCategoryTitle(String categoryTitle) {
        this.categoryTitle = categoryTitle;
    }

    public Boolean getHasImage() {
        return hasImage;
    }

    public void setHasImage(Boolean hasImage) {
        this.hasImage = hasImage;
    }
}