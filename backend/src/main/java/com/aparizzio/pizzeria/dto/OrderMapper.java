package com.aparizzio.pizzeria.dto;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;
import com.aparizzio.pizzeria.model.Order;
import com.aparizzio.pizzeria.model.Product;

@Component
public class OrderMapper {

    // Converts an Order entity into a safe OrderDTO
    public OrderDTO toDTO(Order order) {

        // Extract the user email safely
        String email = null;
        if (order.getUser() != null) {
            email = order.getUser().getEmail();
        }

        // Extract only the titles from the product list to avoid infinite recursion
        List<String> productNames = null;
        if (order.getProducts() != null) {
            productNames = order.getProducts().stream()
                    .map(Product::getTitle)
                    .collect(Collectors.toList());
        }

        return new OrderDTO(
                order.getId(),
                order.getAddress(),
                order.getCity(),
                order.getPostalCode(),
                order.getPhoneNumber(),
                email,
                productNames);
    }
}