package com.aparizzio.pizzeria.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/metrics")
public class MetricsRestController {

    @Autowired
    private com.aparizzio.pizzeria.service.MetricsService metricsService;

    /// GET: Return data for the graph (ADMIN)
    @GetMapping("/")
    public Object getDashboardMetrics() {

        return metricsService.getDashboardMetrics();
    }
}