package com.aparizzio.pizzeria.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aparizzio.pizzeria.dto.UserDTO;
import com.aparizzio.pizzeria.dto.UserUpdateDTO;
import com.aparizzio.pizzeria.dto.UserMapper;
import com.aparizzio.pizzeria.model.User;
import com.aparizzio.pizzeria.repository.UserRepository;
import com.aparizzio.pizzeria.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/v1/users")
public class UserRestController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    // GET: Obtain my own profile information
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getMe(HttpServletRequest request) {
        String email = request.getUserPrincipal().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(userMapper.toDTO(user));
    }

    // PUT: Update my own profile
    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateMe(@RequestBody UserUpdateDTO updateDTO, HttpServletRequest request) {
        String email = request.getUserPrincipal().getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        // Use the updateUserProfile method in UserService
        boolean success = userService.updateUserProfile(
                user.getId(),
                updateDTO.getName(),
                updateDTO.getEmail(),
                updateDTO.getNewPassword(),
                updateDTO.getOldPassword());

        if (success) {
            User updatedUser = userRepository.findById(user.getId()).orElseThrow();
            return ResponseEntity.ok(userMapper.toDTO(updatedUser));
        } else {
            // If the update failed (e.g., old password didn't match), return a bad request
            return ResponseEntity.badRequest().build();
        }
    }
}