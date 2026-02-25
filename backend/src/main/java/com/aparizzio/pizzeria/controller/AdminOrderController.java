package com.aparizzio.pizzeria.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.aparizzio.pizzeria.model.Order;
import com.aparizzio.pizzeria.service.OrderService;

@Controller
public class AdminOrderController {

    @Autowired
    private OrderService orderService;

    // --- Show the list of all orders ---
    @GetMapping("/admin/orders")
    public String showAdminOrders(Model model) {
        model.addAttribute("orders", orderService.getAllOrders());
        return "admin-orders";
    }

    // --- Show the details of a specific order ---
    @GetMapping("/admin/orders/{id}")
    public String showOrderDetails(@PathVariable Long id, Model model) {
        Optional<Order> orderOpt = orderService.getOrderById(id);

        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            model.addAttribute("order", order);
            model.addAttribute("totalPrice", orderService.calculateTotalOrderPrice(order));
            return "admin-order-details";
        }

        return "redirect:/admin/orders";
    }

    // --- Delete an order ---
    @PostMapping("/admin/orders/{id}/delete")
    public String deleteOrder(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        Optional<Order> orderOpt = orderService.getOrderById(id);

        if (orderOpt.isPresent()) {
            orderService.deleteOrder(id);
            redirectAttributes.addFlashAttribute("warningMessage",
                    "El pedido #ORD-" + id + " ha sido eliminado del sistema de forma permanente.");
        } else {
            redirectAttributes.addFlashAttribute("errorMessage", "No se ha podido encontrar el pedido solicitado.");
        }

        return "redirect:/admin/orders";
    }
}