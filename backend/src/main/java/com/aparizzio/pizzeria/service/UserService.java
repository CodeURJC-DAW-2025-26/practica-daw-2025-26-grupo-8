package com.aparizzio.pizzeria.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.aparizzio.pizzeria.model.Order;
import com.aparizzio.pizzeria.model.User;
import com.aparizzio.pizzeria.repository.OrderRepository;
import com.aparizzio.pizzeria.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // --- Get all users ---
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // --- Public registration (validating passwords and emails) ---
    public String registerUser(String name, String email, String password, String confirmPassword) {
        if (!password.equals(confirmPassword)) {
            return "password_mismatch";
        }
        if (userRepository.findByEmail(email).isPresent()) {
            return "email_exists";
        }

        User newUser = new User(name, email, passwordEncoder.encode(password), "USER");
        userRepository.save(newUser);
        return "success";
    }

    // --- Create user from Admin panel ---
    public void createAdminUser(String name, String email, String role, String password) {
        User newUser = new User(name, email, passwordEncoder.encode(password), "USER");
        if ("ADMIN".equals(role)) {
            newUser.setRoles(List.of("USER", "ADMIN"));
        }
        userRepository.save(newUser);
    }

    // --- Delete user (and associated orders) ---
    public void deleteUserSafely(Long id) {
        Optional<User> userOpt = userRepository.findById(id);

        if (userOpt.isPresent() && !userOpt.get().getEmail().equals("admin@admin.com")) {

            List<Order> userOrders = orderRepository.findByUserId(id);

            orderRepository.deleteAll(userOrders);

            userRepository.deleteById(id);
        }
    }

    // --- Change password ---
    public void changePassword(Long id, String newPassword) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setEncodedPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        }
    }

    // --- Get user by email ---
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // --- Get user orders ---
    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    // --- Update profile (Email and/or Password) ---
    public boolean updateUserProfile(Long id, String newName, String newEmail, String newPassword, String oldPassword) {
        Optional<User> userOpt = userRepository.findById(id);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // Verify if the provided old password matches the current encoded password in
            // the DB
            if (!passwordEncoder.matches(oldPassword, user.getEncodedPassword())) {
                return false; // Return false to indicate the update failed due to wrong password
            }

            // Update name if provided
            if (newName != null && !newName.trim().isEmpty()) {
                user.setName(newName);
            }

            // Update email if provided
            if (newEmail != null && !newEmail.trim().isEmpty()) {
                user.setEmail(newEmail);
            }

            // Update password only if the user typed a new one
            if (newPassword != null && !newPassword.trim().isEmpty()) {
                user.setEncodedPassword(passwordEncoder.encode(newPassword));
            }

            userRepository.save(user);
            return true; // Successfully updated
        }
        return false;
    }
}