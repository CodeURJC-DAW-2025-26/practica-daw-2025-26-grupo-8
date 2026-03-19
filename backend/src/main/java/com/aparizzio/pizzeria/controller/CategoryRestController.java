package com.aparizzio.pizzeria.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.aparizzio.pizzeria.model.Category;
import com.aparizzio.pizzeria.dto.CategoryDTO;
import com.aparizzio.pizzeria.dto.CategoryMapper;
import com.aparizzio.pizzeria.dto.ProductDTO;
import com.aparizzio.pizzeria.dto.ProductMapper;
import com.aparizzio.pizzeria.service.CategoryService;
import com.aparizzio.pizzeria.service.ProductService;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryRestController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private ProductService productService;

    // GET: Obtain all categories (Paginated)
    @GetMapping("/")
    public List<CategoryDTO> getCategories() {
        // Usamos tu método getAllCategories() real
        return categoryService.getAllCategories().stream()
                .map(categoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    // GET: Obtain a single category by ID
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategory(@PathVariable long id) {
        // Usamos tu método getCategoryById() real
        Optional<Category> category = categoryService.getCategoryById(id);
        if (category.isPresent()) {
            return ResponseEntity.ok(categoryMapper.toDTO(category.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // POST: Create a new category (Only JSON data, no image upload)
    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryDTO createCategory(@RequestBody CategoryDTO categoryDTO) {
        Category newCategory = new Category();
        newCategory.setTitle(categoryDTO.getTitle());
        newCategory.setDescription(categoryDTO.getDescription());

        // Save the new category to the database
        categoryService.saveCategory(newCategory);

        return categoryMapper.toDTO(newCategory);
    }

    // PUT: Update an existing category (Only JSON data)
    @PutMapping("/{id}")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable long id,
            @RequestBody CategoryDTO updatedCategoryDTO) {
        Optional<Category> categoryOpt = categoryService.getCategoryById(id);

        if (categoryOpt.isPresent()) {
            Category category = categoryOpt.get();
            category.setTitle(updatedCategoryDTO.getTitle());
            category.setDescription(updatedCategoryDTO.getDescription());

            categoryService.saveCategory(category);
            return ResponseEntity.ok(categoryMapper.toDTO(category));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE: Delete a category safely
    @DeleteMapping("/{id}")
    public ResponseEntity<CategoryDTO> deleteCategory(@PathVariable long id) {
        Optional<Category> categoryOpt = categoryService.getCategoryById(id);

        if (categoryOpt.isPresent()) {
            Category category = categoryOpt.get();
            // Use first the safe delete method that updates orders to remove the category
            // reference
            categoryService.deleteCategorySafely(id);
            return ResponseEntity.ok(categoryMapper.toDTO(category));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // GET: See products of a category (Paginated)
    @GetMapping("/{id}/products")
    public Page<ProductDTO> getCategoryProducts(@PathVariable long id, Pageable pageable) {
        return productService.getProductsByCategory(id, pageable).map(productMapper::toDTO);
    }
}