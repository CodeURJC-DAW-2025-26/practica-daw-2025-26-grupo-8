package com.aparizzio.pizzeria.dto;

import java.util.List;

public class UserDTO {

    private Long id;
    private String email;
    private String name;
    private List<String> roles;
    // VERY IMPORTANT: encodedPassword is NOT here

    public UserDTO() {
    }

    public UserDTO(Long id, String email, String name, List<String> roles) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.roles = roles;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}