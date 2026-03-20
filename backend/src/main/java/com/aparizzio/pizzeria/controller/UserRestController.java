package com.aparizzio.pizzeria.controller;

import java.util.stream.Collectors;
import java.util.List;
import java.util.Optional;

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
    public ResponseEntity<String> registerUser(@RequestBody com.aparizzio.pizzeria.dto.UserRegisterDTO requestDTO) {

        if (requestDTO.getPassword() == null || requestDTO.getConfirmPassword() == null) {
            return ResponseEntity.badRequest().body("{\"error\": \"Faltan las contraseñas\"}");
        }

        String result = userService.registerUser(
                requestDTO.getName(),
                requestDTO.getEmail(),
                requestDTO.getPassword(),
                requestDTO.getConfirmPassword());

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

    // GET: See all users (ADMIN)
    @GetMapping("/")
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers().stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    // GET: See a user by ID (ADMIN)
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable long id) {
        Optional<User> userOpt = userService.getUserById(id);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userMapper.toDTO(userOpt.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE: Delete a user (ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable long id) {
        Optional<User> userOpt = userService.getUserById(id);
        if (userOpt.isPresent()) {
            userService.deleteUserSafely(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}