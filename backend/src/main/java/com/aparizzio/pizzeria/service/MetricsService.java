package com.aparizzio.pizzeria.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aparizzio.pizzeria.model.Order;
import com.aparizzio.pizzeria.model.Product;
import com.aparizzio.pizzeria.repository.OrderRepository;

@Service
public class MetricsService {

    @Autowired
    private OrderRepository orderRepository;

    // --- Retrieve all metrics data in a single Map for the controller ---
    public Map<String, Object> getDashboardMetrics() {
        List<Order> orders = orderRepository.findAll();
        Map<String, Integer> soldProductsCount = new HashMap<>();
        int totalProductsSold = 0;

        // Loop through orders and count products
        for (Order order : orders) {
            if (order.getProducts() == null)
                continue;

            for (Product product : order.getProducts()) {
                if (product == null || product.getTitle() == null)
                    continue;

                soldProductsCount.merge(product.getTitle(), 1, Integer::sum);
                totalProductsSold++;
            }
        }

        // Sort products by sales and get the top 10
        List<Map<String, Object>> topSoldProducts = soldProductsCount.entrySet().stream()
                .sorted((first, second) -> second.getValue().compareTo(first.getValue()))
                .limit(10)
                .map(entry -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("name", entry.getKey());
                    data.put("count", entry.getValue());
                    return data;
                })
                .toList();

        // Package all the metrics into a map to send back
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalOrders", orders.size());
        metrics.put("totalProductsSold", totalProductsSold);
        metrics.put("differentProductsSold", soldProductsCount.size());
        metrics.put("topSoldProducts", topSoldProducts);

        return metrics;
    }
}