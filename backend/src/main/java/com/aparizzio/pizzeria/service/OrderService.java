package com.aparizzio.pizzeria.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aparizzio.pizzeria.model.Order;
import com.aparizzio.pizzeria.model.Product;
import com.aparizzio.pizzeria.model.User;
import com.aparizzio.pizzeria.repository.OrderRepository;
import com.aparizzio.pizzeria.repository.ProductRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    // --- Retrieve all orders for the admin panel ---
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // --- Retrieve a specific order by its ID ---
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    // --- Calculate the total price of all products in a given order ---
    public double calculateTotalOrderPrice(Order order) {
        double total = 0;
        if (order.getProducts() != null) {
            for (Product p : order.getProducts()) {
                total += p.getPrice();
            }
        }
        return total;
    }

    // --- Delete an order from the database ---
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    // --- Create and save a new order from the checkout process ---
    public Order createOrder(List<Product> products, String address, String city, String postalCode, String phoneNumber,
            User user) {
        List<Product> managedProducts = new ArrayList<>();
        if (products != null) {
            for (Product product : products) {
                if (product == null || product.getId() == null) {
                    continue;
                }
                productRepository.findById(product.getId()).ifPresent(managedProducts::add);
            }
        }

        Order order = new Order();
        order.setProducts(managedProducts);
        order.setAddress(address);
        order.setCity(city);
        order.setPostalCode(postalCode);
        order.setPhoneNumber(phoneNumber);

        // Link the order to the user if they are logged in
        if (user != null) {
            order.setUser(user);
        }

        return orderRepository.saveAndFlush(order);
    }
}