package com.aparizzio.pizzeria.dto;

import java.util.List;

public class OrderRequestDTO {
    private List<Long> productIds; // Client sends a list of product IDs they want to order
    private String address;
    private String city;
    private String postalCode;
    private String phoneNumber;

    public OrderRequestDTO() {
    }

    // Getters and Setters
    public List<Long> getProductIds() {
        return productIds;
    }

    public void setProductIds(List<Long> productIds) {
        this.productIds = productIds;
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
}