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

            List<Order> ordersWithProduct = orderRepository.findByProductsId(id);

            for (Order order : ordersWithProduct) {
                order.getProducts().removeIf(p -> p.getId().equals(id));
                orderRepository.save(order);
            }

            productRepository.deleteById(id);
        }
    }

    // --- API REST: Add image to product ---
    public Product addImageToProduct(long id, Image image) {
        Product product = productRepository.findById(id).orElseThrow();
        product.setImage(image);
        productRepository.save(product);
        return product;
    }

    // --- API REST: Remove image from product ---
    public Product removeImageFromProduct(long productId) {
        Product product = productRepository.findById(productId).orElseThrow();
        product.setImage(null);
        productRepository.save(product);
        return product;
    }

    // --- REST API: Get paginated products ---
    public org.springframework.data.domain.Page<Product> getProducts(
            org.springframework.data.domain.Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    // --- API REST: Obtain products by category (Paginated) ---
    public org.springframework.data.domain.Page<Product> getProductsByCategory(Long categoryId,
            org.springframework.data.domain.Pageable pageable) {
        return productRepository.findByCategoryId(categoryId, pageable);
    }

    // --- API REST: Save product ---
    public Product save(Product product) {
        return productRepository.save(product);
    }

}