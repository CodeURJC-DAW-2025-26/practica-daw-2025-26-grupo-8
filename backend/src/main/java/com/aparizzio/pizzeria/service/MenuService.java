package com.aparizzio.pizzeria.service;

import java.util.Comparator;
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

        List<Product> filteredProducts = productRepository.findAll().stream()
                .filter(product -> {
                    if (product.getAllergies() == null || product.getAllergies().isEmpty()) {
                        return true;
                    }

                    Set<String> productAllergies = product.getAllergies().stream()
                            .map(this::normalizeAllergen)
                            .collect(Collectors.toSet());

                    return productAllergies.stream().noneMatch(normalizedExcludedAllergens::contains);
                })
                .sorted(Comparator.comparing(Product::getId))
                .toList();

        return buildPageData(filteredProducts, page, size);
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

    private ProductPageData buildPageData(List<Product> products, int page, int size) {
        int start = page * size;
        int total = products.size();

        if (start >= total) {
            return new ProductPageData(List.of(), total);
        }

        int end = Math.min(start + size, total);
        return new ProductPageData(products.subList(start, end), total);
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
