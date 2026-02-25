package com.aparizzio.pizzeria.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

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
            @RequestParam String password,
            RedirectAttributes redirectAttributes) {

        userService.createAdminUser(name, email, role, password);

        redirectAttributes.addFlashAttribute("successMessage",
                "El usuario '" + name + "' ha sido creado correctamente con el rol " + role + ".");

        return "redirect:/admin/users";
    }

    // --- Delete user (with safety checks) ---
    @PostMapping("/admin/users/{id}/delete")
    public String deleteUser(@PathVariable Long id, RedirectAttributes redirectAttributes) {

        try {
            userService.deleteUserSafely(id);
            redirectAttributes.addFlashAttribute("warningMessage",
                    "El usuario ha sido eliminado de la base de datos junto con su historial de pedidos.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage",
                    "Error al intentar borrar el usuario. Asegúrate de que no es el administrador principal.");
        }

        return "redirect:/admin/users";
    }

    // --- Change user password ---
    @PostMapping("/admin/users/{id}/password")
    public String changeUserPassword(@PathVariable Long id, @RequestParam String newPassword,
            RedirectAttributes redirectAttributes) {

        userService.changePassword(id, newPassword);
        redirectAttributes.addFlashAttribute("successMessage",
                "La contraseña del usuario ha sido actualizada con éxito.");

        return "redirect:/admin/users";
    }
}