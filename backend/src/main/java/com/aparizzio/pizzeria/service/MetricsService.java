package com.aparizzio.pizzeria.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.aparizzio.pizzeria.repository.OrderRepository;
import com.aparizzio.pizzeria.repository.ProductSalesProjection;

@Service
public class MetricsService {

    @Autowired
    private OrderRepository orderRepository;

    // --- Retrieve all metrics data in a single Map for the controller ---
    public Map<String, Object> getDashboardMetrics() {
        long totalOrders = orderRepository.countAllOrders();
        long totalProductsSold = orderRepository.countAllSoldProducts();
        long differentProductsSold = orderRepository.countDistinctSoldProducts();

        List<Map<String, Object>> topSoldProducts = getTopSoldProducts();

        // Package all the metrics into a map to send back
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalOrders", totalOrders);
        metrics.put("totalProductsSold", totalProductsSold);
        metrics.put("differentProductsSold", differentProductsSold);
        metrics.put("topSoldProducts", topSoldProducts);

        return metrics;
    }

    public List<Map<String, Object>> getTopSoldProducts() {
        return orderRepository.findTopSoldProducts(PageRequest.of(0, 5)).stream()
                .map(productSale -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("productId", productSale.getProductId());
                    data.put("name", productSale.getName());
                    data.put("count", productSale.getCount());
                    return data;
                })
                .toList();
    }

    public List<Long> getTopSoldProductIds() {
        return orderRepository.findTopSoldProducts(PageRequest.of(0, 5)).stream()
                .map(ProductSalesProjection::getProductId)
                .toList();
    }
}