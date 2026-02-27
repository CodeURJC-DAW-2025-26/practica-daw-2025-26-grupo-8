package com.aparizzio.pizzeria.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aparizzio.pizzeria.model.Order;
import com.aparizzio.pizzeria.model.User;
import com.aparizzio.pizzeria.service.CartService;
import com.aparizzio.pizzeria.service.OrderEmailService;
import com.aparizzio.pizzeria.service.OrderService;
import com.aparizzio.pizzeria.service.UserService;

@Controller
public class ShopOrderController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ShopOrderController.class);

    @Autowired
    private OrderService orderService;

    @Autowired
    private CartService cartService;

    @Autowired
    private UserService userService;

    @Autowired
    private OrderEmailService orderEmailService;

    // --- Process the checkout form and create the order ---
    @PostMapping("/order/checkout")
    public String processOrder(
            @RequestParam String address,
            @RequestParam String city,
            @RequestParam String postalCode,
            @RequestParam String phoneNumber) {

        // Prevent empty orders
        if (cartService.getProducts().isEmpty()) {
            return "redirect:/menu";
        }

        User orderUser = null;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Identify if the user is logged in
        if (authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken)) {
            orderUser = userService.getUserByEmail(authentication.getName()).orElse(null);
        }

        // Delegate the creation to the service
        Order savedOrder = orderService.createOrder(
                new ArrayList<>(cartService.getProducts()),
                address,
                city,
                postalCode,
                phoneNumber,
                orderUser);

        if (orderUser != null) {
            try {
                orderEmailService.sendOrderSummaryEmail(orderUser, savedOrder);
            } catch (MailException mailException) {
                LOGGER.warn("No se pudo enviar el correo de confirmación del pedido {} al usuario {}. Motivo: {}",
                        savedOrder.getId(), orderUser.getEmail(), mailException.getMessage(), mailException);
            } catch (RuntimeException runtimeException) {
                LOGGER.warn("Error inesperado al enviar el correo del pedido {} al usuario {}. Motivo: {}",
                        savedOrder.getId(), orderUser.getEmail(), runtimeException.getMessage(), runtimeException);
            }
        }

        // Clear the cart after a successful purchase
        cartService.clear();

        return "redirect:/";
    }
}