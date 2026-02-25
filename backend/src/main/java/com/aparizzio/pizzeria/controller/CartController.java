package com.aparizzio.pizzeria.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.aparizzio.pizzeria.service.CartService;
import com.aparizzio.pizzeria.service.ProductService;

@Controller
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductService productService;

    @GetMapping("/cart")
    public String showCart(Model model) {
        model.addAttribute("cartProducts", cartService.getProducts());
        model.addAttribute("total", cartService.getTotal());
        model.addAttribute("hasCartProducts", !cartService.getProducts().isEmpty());
        model.addAttribute("isCart", true);
        return "cart";
    }

    @PostMapping("/cart/add/{id}")
    @ResponseBody
    public ResponseEntity<String> addToCart(@PathVariable Long id) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            return ResponseEntity.status(401).body("No autorizado");
        }

        productService.getProductById(id).ifPresent(cartService::addProduct);

        return ResponseEntity.ok("Producto añadido correctamente");
    }

    @PostMapping("/cart/remove/{id}")
    public String removeFromCart(@PathVariable Long id) {
        cartService.removeProduct(id);
        return "redirect:/cart";
    }
}