package com.aparizzio.pizzeria.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.aparizzio.pizzeria.service.MetricsService;

@Controller
public class AdminMetricsController {

    @Autowired
    private MetricsService metricsService;

    // --- Show the metrics dashboard ---
    @GetMapping("/admin/metrics")
    public String showAdminMetrics(Model model) {
        // Retrieve all metrics from the service
        Map<String, Object> metrics = metricsService.getDashboardMetrics();

        // Add them to the model
        model.addAllAttributes(metrics);

        return "admin-metrics";
    }
}