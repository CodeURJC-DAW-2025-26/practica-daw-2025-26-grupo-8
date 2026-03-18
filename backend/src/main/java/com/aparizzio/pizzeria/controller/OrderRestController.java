package com.aparizzio.pizzeria.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aparizzio.pizzeria.dto.OrderDTO;
import com.aparizzio.pizzeria.dto.OrderRequestDTO;
import com.aparizzio.pizzeria.dto.OrderMapper;
import com.aparizzio.pizzeria.model.Order;
import com.aparizzio.pizzeria.model.Product;
import com.aparizzio.pizzeria.model.User;
import com.aparizzio.pizzeria.repository.UserRepository;
import com.aparizzio.pizzeria.service.OrderService;
import com.aparizzio.pizzeria.service.ProductService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderRestController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderMapper orderMapper;

    // POST: Create a new order
    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderDTO createOrder(@RequestBody OrderRequestDTO requestDTO, HttpServletRequest request) {

        // Identifies the user making the order from the JWT token
        String email = request.getUserPrincipal().getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        // Remake the list of products from the list of product IDs sent by the client
        List<Product> orderProducts = new ArrayList<>();
        for (Long productId : requestDTO.getProductIds()) {
            Optional<Product> p = productService.getProductById(productId);
            p.ifPresent(orderProducts::add);
        }

        // Create the order using the real service method, which will calculate the
        // total price and save everything to the database
        Order newOrder = orderService.createOrder(
                orderProducts,
                requestDTO.getAddress(),
                requestDTO.getCity(),
                requestDTO.getPostalCode(),
                requestDTO.getPhoneNumber(),
                user);

        return orderMapper.toDTO(newOrder);
    }
}