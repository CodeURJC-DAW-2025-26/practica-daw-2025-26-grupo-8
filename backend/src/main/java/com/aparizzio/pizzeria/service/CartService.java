package com.aparizzio.pizzeria.service;

import com.aparizzio.pizzeria.model.Product;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.SessionScope;
import java.util.ArrayList;
import java.util.List;

@Service
@SessionScope // The cart lives for the duration of the user's session
public class CartService {
    private List<Product> products = new ArrayList<>();

    public void addProduct(Product product) {
        products.add(product);
    }

    public void removeProduct(Long productId) {
        for (int i = 0; i < products.size(); i++) {
            if (products.get(i).getId().equals(productId)) {
                products.remove(i);
                break; // Exit loop after removing only one item
            }
        }
    }

    public List<Product> getProducts() {
        return products;
    }

    public double getTotal() {
        return products.stream().mapToDouble(Product::getPrice).sum();
    }

    public void clear() {
        products.clear();
    }
}