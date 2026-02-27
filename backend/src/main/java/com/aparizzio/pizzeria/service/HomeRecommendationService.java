package com.aparizzio.pizzeria.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.aparizzio.pizzeria.model.Order;
import com.aparizzio.pizzeria.model.Product;
import com.aparizzio.pizzeria.model.User;
import com.aparizzio.pizzeria.repository.OrderRepository;
import com.aparizzio.pizzeria.repository.ProductRepository;

@Service
public class HomeRecommendationService {

    private static final int TOP_PRODUCTS_LIMIT = 5;
    private static final int PERSONALIZED_LIMIT = 5;
    private static final String CATEGORY_PIZZA = "PIZZA";
    private static final String CATEGORY_STARTER = "STARTER";
    private static final String CATEGORY_DRINK = "DRINK";
    private static final String CATEGORY_OTHER = "OTHER";

    @Autowired
    private MetricsService metricsService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    public List<Product> getTopSoldProductsForHome() {
        List<Long> topSoldProductIds = metricsService.getTopSoldProductIds();

        if (topSoldProductIds.isEmpty()) {
            return productRepository.findAll(PageRequest.of(0, TOP_PRODUCTS_LIMIT)).getContent();
        }

        Map<Long, Product> productsById = productRepository.findAllById(topSoldProductIds).stream()
                .collect(Collectors.toMap(Product::getId, product -> product));

        return topSoldProductIds.stream()
                .map(productsById::get)
                .filter(product -> product != null)
                .limit(TOP_PRODUCTS_LIMIT)
                .toList();
    }

    public List<Product> getPersonalizedRecommendations(User user, boolean isAdmin) {
        if (user == null || isAdmin || !hasUserRole(user)) {
            return List.of();
        }

        List<Order> userOrders = orderRepository.findByUserId(user.getId());
        if (userOrders == null || userOrders.isEmpty()) {
            return List.of();
        }

        Order latestOrder = orderRepository.findTopByUserIdOrderByIdDesc(user.getId());
        if (latestOrder == null || latestOrder.getProducts() == null || latestOrder.getProducts().isEmpty()) {
            return List.of();
        }

        Map<Long, Integer> userProductPoints = countUserProductFrequency(userOrders);
        Map<Long, Integer> latestOrderProductPoints = countOrderProductFrequency(latestOrder);

        List<Product> latestDistinctProducts = distinctByProductId(latestOrder.getProducts());
        if (latestDistinctProducts.isEmpty()) {
            return List.of();
        }

        Comparator<Product> pointsComparator = Comparator
                .comparingInt((Product product) -> latestOrderProductPoints.getOrDefault(product.getId(), 0))
                .thenComparingInt(product -> userProductPoints.getOrDefault(product.getId(), 0))
                .thenComparing(Product::getId)
                .reversed();

        List<Product> latestRanked = latestDistinctProducts.stream()
                .sorted(pointsComparator)
                .toList();

        if (latestRanked.size() >= PERSONALIZED_LIMIT) {
            return latestRanked.stream()
                    .limit(PERSONALIZED_LIMIT)
                    .toList();
        }

        LinkedHashSet<Product> recommendations = new LinkedHashSet<>(latestRanked);

        List<Product> historicalRanked = productRepository.findAll().stream()
                .filter(product -> product != null && product.getId() != null)
                .filter(product -> !recommendations.contains(product))
                .sorted(Comparator
                        .comparingInt((Product product) -> userProductPoints.getOrDefault(product.getId(), 0))
                        .thenComparing(Product::getId)
                        .reversed())
                .toList();

        List<String> fillPriority = resolveFillPriority(latestDistinctProducts);

        for (String categoryKey : fillPriority) {
            for (Product product : historicalRanked) {
                if (recommendations.size() >= PERSONALIZED_LIMIT) {
                    break;
                }
                if (recommendations.contains(product)) {
                    continue;
                }
                if (!categoryKey.equals(resolveCategoryKey(product))) {
                    continue;
                }
                recommendations.add(product);
            }
            if (recommendations.size() >= PERSONALIZED_LIMIT) {
                break;
            }
        }

        for (Product product : historicalRanked) {
            if (recommendations.size() >= PERSONALIZED_LIMIT) {
                break;
            }
            if (recommendations.contains(product)) {
                continue;
            }
            recommendations.add(product);
        }

        return recommendations.stream().limit(PERSONALIZED_LIMIT).toList();
    }

    private boolean hasUserRole(User user) {
        return user.getRoles() != null && user.getRoles().contains("USER");
    }

    private Map<Long, Integer> countUserProductFrequency(List<Order> userOrders) {
        Map<Long, Integer> frequency = new HashMap<>();
        for (Order order : userOrders) {
            if (order.getProducts() == null) {
                continue;
            }
            for (Product product : order.getProducts()) {
                if (product != null && product.getId() != null) {
                    frequency.merge(product.getId(), 1, Integer::sum);
                }
            }
        }
        return frequency;
    }

    private Map<Long, Integer> countOrderProductFrequency(Order order) {
        Map<Long, Integer> frequency = new HashMap<>();
        if (order == null || order.getProducts() == null) {
            return frequency;
        }

        for (Product product : order.getProducts()) {
            if (product != null && product.getId() != null) {
                frequency.merge(product.getId(), 1, Integer::sum);
            }
        }

        return frequency;
    }

    private List<Product> distinctByProductId(List<Product> products) {
        if (products == null || products.isEmpty()) {
            return List.of();
        }

        return new ArrayList<>(products.stream()
                .filter(product -> product != null && product.getId() != null)
                .collect(Collectors.toMap(
                        Product::getId,
                        product -> product,
                        (existing, replacement) -> existing,
                        LinkedHashMap::new))
                .values());
    }

    private List<String> resolveFillPriority(List<Product> latestDistinctProducts) {
        boolean hasPizza = latestDistinctProducts.stream()
                .anyMatch(product -> CATEGORY_PIZZA.equals(resolveCategoryKey(product)));
        boolean hasStarter = latestDistinctProducts.stream()
                .anyMatch(product -> CATEGORY_STARTER.equals(resolveCategoryKey(product)));
        boolean hasDrink = latestDistinctProducts.stream()
                .anyMatch(product -> CATEGORY_DRINK.equals(resolveCategoryKey(product)));

        List<String> priority = new ArrayList<>();
        if (hasPizza) {
            priority.add(CATEGORY_PIZZA);
            priority.add(CATEGORY_STARTER);
            priority.add(CATEGORY_DRINK);
        } else if (hasStarter) {
            priority.add(CATEGORY_STARTER);
            priority.add(CATEGORY_PIZZA);
            priority.add(CATEGORY_DRINK);
        } else if (hasDrink) {
            priority.add(CATEGORY_DRINK);
            priority.add(CATEGORY_PIZZA);
            priority.add(CATEGORY_STARTER);
        }
        priority.add(CATEGORY_OTHER);
        return priority;
    }

    private String resolveCategoryKey(Product product) {
        if (product == null || product.getCategory() == null || product.getCategory().getTitle() == null) {
            return CATEGORY_OTHER;
        }

        String normalized = product.getCategory().getTitle().trim().toLowerCase();
        if (normalized.contains("pizza")) {
            return CATEGORY_PIZZA;
        }
        if (normalized.contains("aperitivo") || normalized.contains("entrante")) {
            return CATEGORY_STARTER;
        }
        if (normalized.contains("bebida")) {
            return CATEGORY_DRINK;
        }
        return CATEGORY_OTHER;
    }
}

/*
 * Algoritmo:
 * 
 * Coge elúltimo pedidodel usuario.
 * Quita duplicadosde esepedido.
 * Ordena esosproductos por:
 * -Puntos del último pedido (cantidad en ese pedido),
 * -Puntos históricos del usuario,
 * 
 * -Id (desempate estable).
 * 
 * Si ya hay 5 o más, devuelve 5 de ellos.
 * 
 * Si hay menos de 5:
 * Rellena con histórico + catálogo según prioridad de categoría detectada en el
 * último pedido:
 * -Si hay pizzas: pizzas -> entrantes -> bebidas
 * -Si no hay pizzas pero hay entrantes: entrantes -> pizzas -> bebidas
 * -Si solo hay bebidas: bebidas -> pizzas -> entrantes
 * -Si aún falta, completa con el resto de productos por orden histórico.
 * El relleno admite productos con 0 puntos, así que puede llegar a 5 aunque sea
 * el primer pedido (si hay suficientes productos en catálogo).
 * 
 */