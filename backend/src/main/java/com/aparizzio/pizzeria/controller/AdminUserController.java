package com.aparizzio.pizzeria.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.aparizzio.pizzeria.service.UserService;

@Controller
public class AdminUserController {

    @Autowired
    private UserService userService;

    // --- Show admin user management page ---
    @GetMapping("/admin/users")
    public String showAdminUsers(Model model) {
        model.addAttribute("users", userService.getAllUsers());
        return "admin-users";
    }

    // --- Create new user from admin panel ---
    @PostMapping("/admin/users/new")
    public String createUser(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String role,
            @RequestParam String password) {

        userService.createAdminUser(name, email, role, password);
        return "redirect:/admin/users";
    }

    // --- Delete user (with safety checks) ---
    @PostMapping("/admin/users/{id}/delete")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUserSafely(id);
        return "redirect:/admin/users";
    }

    // --- Change user password ---
    @PostMapping("/admin/users/{id}/password")
    public String changeUserPassword(@PathVariable Long id, @RequestParam String newPassword) {
        userService.changePassword(id, newPassword);
        return "redirect:/admin/users";
    }
}