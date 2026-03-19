package com.aparizzio.pizzeria.dto;

import org.springframework.stereotype.Component;
import com.aparizzio.pizzeria.model.User;

@Component
public class UserMapper {

    // Converts a User entity into a safe UserDTO (without password)
    public UserDTO toDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRoles());
    }
}