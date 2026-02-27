package com.aparizzio.pizzeria.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.servlet.http.HttpServletResponse;

import com.aparizzio.pizzeria.service.MetricsService;
import java.util.List;

@Controller
public class AdminMetricsController {

    @Autowired
    private MetricsService metricsService;

    // --- Show the metrics dashboard ---
    @GetMapping("/admin/metrics")
    public String showAdminMetrics(Model model, HttpServletResponse response) {
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setDateHeader("Expires", 0);

        // Retrieve all metrics from the service
        Map<String, Object> metrics = metricsService.getDashboardMetrics();

        // Add them to the model
        model.addAllAttributes(metrics);

        return "admin-metrics";
    }

    @GetMapping("/admin/metrics/top-products")
    @ResponseBody
    public List<Map<String, Object>> getTopSoldProducts() {
        return metricsService.getTopSoldProducts();
    }
}