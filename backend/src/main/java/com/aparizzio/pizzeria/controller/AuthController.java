package com.aparizzio.pizzeria.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.aparizzio.pizzeria.service.UserService;

@Controller
public class AuthController {

    @Autowired
    private UserService userService;

    // --- Handle user registration ---
    @PostMapping("/register")
    public String registerNewUser(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String confirmPassword) {

        // The controller only delegates the task to the service
        String result = userService.registerUser(name, email, password, confirmPassword);

        if ("password_mismatch".equals(result)) {
            return "redirect:/?error=password_mismatch";
        } else if ("email_exists".equals(result)) {
            return "redirect:/?error=email_exists";
        }

        return "redirect:/";
    }
}