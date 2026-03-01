package com.aparizzio.pizzeria.controller;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.HttpServletRequest;

import com.aparizzio.pizzeria.model.Order;
import com.aparizzio.pizzeria.model.User;
import com.aparizzio.pizzeria.service.UserService;

@Controller
public class ProfileController {

    @Autowired
    private UserService userService;

    // --- SHOW PROFILE PAGE ---
    @GetMapping("/profile")
    public String showProfile(Model model, Principal principal, HttpServletRequest request,
            @RequestParam(required = false) String success,
            @RequestParam(required = false) String error) { // Added error param

        // Check if user is authenticated, otherwise redirect to home
        if (principal == null) {
            return "redirect:/";
        }

        Optional<User> userOpt = userService.getUserByEmail(principal.getName());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            model.addAttribute("user", user);

            // Fetch and pass the user's previous orders to the view
            List<Order> orders = userService.getUserOrders(user.getId());
            model.addAttribute("orders", orders);

            // Pass the success flag if present in the URL parameters (?success)
            if (success != null) {
                model.addAttribute("success", true);
            }

            // Pass the error flag if present in the URL parameters (?error)
            if (error != null) {
                model.addAttribute("error", true);
            }

            // Explicitly extract and pass the CSRF token for Mustache templates
            CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
            if (csrfToken != null) {
                model.addAttribute("token", csrfToken.getToken());
            } else {
                model.addAttribute("token", ""); // Fallback so Mustache doesn't crash
            }

            return "profile";
        }

        return "redirect:/";
    }

    // --- HANDLE PROFILE UPDATE ---
    @PostMapping("/profile/update")
    public String updateProfile(Principal principal,
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String oldPassword,
            @RequestParam(required = false) String password) {

        if (principal != null) {
            Optional<User> userOpt = userService.getUserByEmail(principal.getName());

            if (userOpt.isPresent()) {
                // Try to update the user profile
                boolean isUpdated = userService.updateUserProfile(
                        userOpt.get().getId(), name, email, password, oldPassword);

                // If the old password was incorrect, it returns false
                if (!isUpdated) {
                    return "redirect:/profile?error";
                }

                // If the user changes their email, we must log them out
                // because the Spring Security principal (username) has changed.
                if (!principal.getName().equals(email)) {
                    return "redirect:/logout";
                }
            }
        }

        // Redirect back to profile page with a success parameter
        return "redirect:/profile?success";
    }
}