package com.aparizzio.pizzeria.controller;

import java.util.stream.Collectors;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aparizzio.pizzeria.dto.OrderDTO;
import com.aparizzio.pizzeria.dto.OrderMapper;
import com.aparizzio.pizzeria.dto.UserDTO;
import com.aparizzio.pizzeria.dto.UserUpdateDTO;
import com.aparizzio.pizzeria.dto.UserMapper;
import com.aparizzio.pizzeria.model.User;
import com.aparizzio.pizzeria.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/v1/users")
public class UserRestController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private OrderMapper orderMapper;

    // GET: Obtain my own profile information
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getMe(HttpServletRequest request) {
        String email = request.getUserPrincipal().getName();
        User user = userService.getUserByEmail(email).orElseThrow();
        return ResponseEntity.ok(userMapper.toDTO(user));
    }

    // PUT: Update my own profile
    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateMe(@RequestBody UserUpdateDTO updateDTO, HttpServletRequest request) {
        String email = request.getUserPrincipal().getName();
        User user = userService.getUserByEmail(email).orElseThrow();

        // Use the updateUserProfile method in UserService
        boolean success = userService.updateUserProfile(
                user.getId(),
                updateDTO.getName(),
                updateDTO.getEmail(),
                updateDTO.getNewPassword(),
                updateDTO.getOldPassword());

        if (success) {
            User updatedUser = userService.getUserById(user.getId()).orElseThrow();
            return ResponseEntity.ok(userMapper.toDTO(updatedUser));
        } else {
            // If the update failed (e.g., old password didn't match), return a bad request
            return ResponseEntity.badRequest().build();
        }
    }

    // POST: Register a new user (public endpoint)
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserUpdateDTO requestDTO) {
        String result = userService.registerUser(requestDTO.getName(), requestDTO.getEmail(),
                requestDTO.getNewPassword(), requestDTO.getNewPassword());
        if ("success".equals(result)) {
            return ResponseEntity.status(HttpStatus.CREATED).body("{\"message\": \"Usuario registrado\"}");
        }
        return ResponseEntity.badRequest().body("{\"error\": \"" + result + "\"}");
    }

    // GET: See my orders (requires authentication)
    @GetMapping("/me/orders")
    public List<OrderDTO> getMyOrders(HttpServletRequest request) {
        String email = request.getUserPrincipal().getName();
        User user = userService.getUserByEmail(email).orElseThrow();

        return userService.getUserOrders(user.getId()).stream()
                .map(orderMapper::toDTO)
                .collect(Collectors.toList());
    }
}