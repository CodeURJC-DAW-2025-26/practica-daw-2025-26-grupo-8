package com.aparizzio.pizzeria.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.aparizzio.pizzeria.model.Category;
import com.aparizzio.pizzeria.model.Image;
import com.aparizzio.pizzeria.model.Product;
import com.aparizzio.pizzeria.repository.CategoryRepository;
import com.aparizzio.pizzeria.repository.ProductRepository;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ImageService imageService;

    // --- Get all categories ---
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // --- Get category by ID ---
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    // --- Create a new category ---
    public void createCategory(String title, String description, MultipartFile imageFile) throws IOException {
        Category newCategory = new Category();
        newCategory.setTitle(title);
        newCategory.setDescription(description);

        if (!imageFile.isEmpty()) {
            Image image = imageService.createImage(imageFile.getInputStream());
            newCategory.setImage(image);
        }

        categoryRepository.save(newCategory);
    }

    // --- Update an existing category ---
    public void updateCategory(Long id, String title, String description, MultipartFile imageFile) throws IOException {
        Category category = categoryRepository.findById(id).orElseThrow();

        category.setTitle(title);
        category.setDescription(description);

        if (!imageFile.isEmpty()) {
            Image image = imageService.createImage(imageFile.getInputStream());
            category.setImage(image);
        }

        categoryRepository.save(category);
    }

    // --- Delete category safely (unlinks products first) ---
    public void deleteCategorySafely(Long id) {
        Optional<Category> categoryOpt = categoryRepository.findById(id);

        if (categoryOpt.isPresent()) {
            Category categoryToDelete = categoryOpt.get();

            for (Product product : categoryToDelete.getProducts()) {
                product.setCategory(null);
                productRepository.save(product);
            }

            if (categoryToDelete.getProducts() != null) {
                categoryToDelete.getProducts().clear();
            }

            categoryRepository.deleteById(id);
        }
    }
}