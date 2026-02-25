package com.aparizzio.pizzeria.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.aparizzio.pizzeria.model.Category;
import com.aparizzio.pizzeria.model.Image;
import com.aparizzio.pizzeria.model.Order;
import com.aparizzio.pizzeria.model.Product;
import com.aparizzio.pizzeria.repository.CategoryRepository;
import com.aparizzio.pizzeria.repository.OrderRepository;
import com.aparizzio.pizzeria.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ImageService imageService;

    // --- Get all products ---
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // --- Get product by ID ---
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // --- Create a new product ---
    public void createProduct(String title, Long categoryId, double price, List<String> allergies,
            MultipartFile imageFile, String shortDescription, String description) throws IOException {
        Product newProduct = new Product();
        newProduct.setTitle(title);
        newProduct.setPrice((int) price);
        newProduct.setShortDescription(shortDescription);
        newProduct.setDescription(description);

        if (allergies != null) {
            newProduct.setAllergies(allergies);
        }

        Optional<Category> category = categoryRepository.findById(categoryId);
        category.ifPresent(newProduct::setCategory);

        if (!imageFile.isEmpty()) {
            Image image = imageService.createImage(imageFile.getInputStream());
            newProduct.setImage(image);
        }

        productRepository.save(newProduct);
    }

    // --- Update an existing product ---
    public void updateProduct(Long id, String title, Long categoryId, double price, List<String> allergies,
            MultipartFile imageFile, String shortDescription, String description) throws IOException {
        Product product = productRepository.findById(id).orElseThrow();

        product.setTitle(title);
        product.setPrice((int) price);
        product.setShortDescription(shortDescription);
        product.setDescription(description);

        if (allergies != null) {
            product.setAllergies(allergies);
        } else {
            product.setAllergies(List.of());
        }

        Optional<Category> category = categoryRepository.findById(categoryId);
        category.ifPresent(product::setCategory);

        if (!imageFile.isEmpty()) {
            Image image = imageService.createImage(imageFile.getInputStream());
            product.setImage(image);
        }

        productRepository.save(product);
    }

    // --- Delete product safely ---
    public void deleteProductSafely(Long id) {
        Optional<Product> productOpt = productRepository.findById(id);

        if (productOpt.isPresent()) {

            List<Order> allOrders = orderRepository.findAll();

            // Loop through orders and remove the product matching the exact ID
            for (Order order : allOrders) {
                boolean removed = order.getProducts().removeIf(p -> p.getId().equals(id));

                if (removed) {
                    orderRepository.save(order);
                }
            }

            productRepository.deleteById(id);
        }
    }
}