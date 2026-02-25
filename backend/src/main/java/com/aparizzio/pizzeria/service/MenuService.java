package com.aparizzio.pizzeria.service;

import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.aparizzio.pizzeria.model.Category;
import com.aparizzio.pizzeria.model.Product;
import com.aparizzio.pizzeria.repository.CategoryRepository;
import com.aparizzio.pizzeria.repository.ProductRepository;

@Service
public class MenuService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public ProductPageData getMenuProducts(int page, int size, List<String> excludedAllergens) {
        boolean hasAllergenFilter = excludedAllergens != null && !excludedAllergens.isEmpty();

        if (!hasAllergenFilter) {
            Page<Product> productPage = productRepository.findAll(PageRequest.of(page, size));
            return new ProductPageData(productPage.getContent(), productPage.getTotalElements());
        }

        Set<String> normalizedExcludedAllergens = excludedAllergens.stream()
                .map(this::normalizeAllergen)
                .filter(value -> !value.isBlank())
                .collect(Collectors.toSet());

        if (normalizedExcludedAllergens.isEmpty()) {
            Page<Product> productPage = productRepository.findAll(PageRequest.of(page, size));
            return new ProductPageData(productPage.getContent(), productPage.getTotalElements());
        }

        Page<Product> filteredPage = productRepository.findByExcludedAllergens(
                normalizedExcludedAllergens,
                PageRequest.of(page, size));

        return new ProductPageData(filteredPage.getContent(), filteredPage.getTotalElements());
    }

    public ProductPageData getCategoryProducts(Long categoryId, int page, int size) {
        Page<Product> productPage = productRepository.findByCategoryId(categoryId, PageRequest.of(page, size));
        return new ProductPageData(productPage.getContent(), productPage.getTotalElements());
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    private String normalizeAllergen(String allergen) {
        if (allergen == null) {
            return "";
        }

        return allergen.toLowerCase(Locale.ROOT)
                .replace("á", "a")
                .replace("é", "e")
                .replace("í", "i")
                .replace("ó", "o")
                .replace("ú", "u")
                .trim();
    }

    public static class ProductPageData {

        private final List<Product> products;
        private final long totalProducts;

        public ProductPageData(List<Product> products, long totalProducts) {
            this.products = products;
            this.totalProducts = totalProducts;
        }

        public List<Product> getProducts() {
            return products;
        }

        public long getTotalProducts() {
            return totalProducts;
        }

        public boolean hasMoreAfterPage(int page, int size) {
            return ((long) (page + 1) * size) < totalProducts;
        }
    }
}
