package com.aparizzio.pizzeria.dto;

import java.util.List;

public class OrderDTO {

    private Long id;
    private String address;
    private String city;
    private String postalCode;
    private String phoneNumber;

    // Instead of the whole User object, we just send the email
    private String userEmail;

    // Instead of the full Product objects, we send a list of their titles
    private List<String> productTitles;

    public OrderDTO() {
    }

    public OrderDTO(Long id, String address, String city, String postalCode, String phoneNumber, String userEmail,
            List<String> productTitles) {
        this.id = id;
        this.address = address;
        this.city = city;
        this.postalCode = postalCode;
        this.phoneNumber = phoneNumber;
        this.userEmail = userEmail;
        this.productTitles = productTitles;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public List<String> getProductTitles() {
        return productTitles;
    }

    public void setProductTitles(List<String> productTitles) {
        this.productTitles = productTitles;
    }
}