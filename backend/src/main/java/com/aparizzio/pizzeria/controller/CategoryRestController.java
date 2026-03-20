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

    @Autowired
    private com.aparizzio.pizzeria.service.ImageService imageService;

    @Autowired
    private com.aparizzio.pizzeria.dto.ImageMapper imageMapper;

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

    // POST: Upload an image for a category (Multipart form data)
    @PostMapping("/{id}/images")
    public ResponseEntity<com.aparizzio.pizzeria.dto.ImageDTO> createCategoryImage(
            @PathVariable long id,
            @RequestParam org.springframework.web.multipart.MultipartFile imageFile) throws java.io.IOException {

        if (imageFile.isEmpty()) {
            throw new IllegalArgumentException("Image file cannot be empty");
        }
        com.aparizzio.pizzeria.model.Image image = imageService.createImage(imageFile.getInputStream());

        Category category = categoryService.getCategoryById(id).orElseThrow();
        category.setImage(image);
        categoryService.saveCategory(category);

        java.net.URI location = org.springframework.web.servlet.support.ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/api/v1/images/{imageId}/media")
                .buildAndExpand(image.getId()).toUri();

        return ResponseEntity.created(location).body(imageMapper.toDTO(image));
    }

    // DELETE: Delete an image from a category
    @DeleteMapping("/{categoryId}/images/{imageId}")
    public ResponseEntity<Void> deleteCategoryImage(
            @PathVariable long categoryId,
            @PathVariable long imageId) throws java.io.IOException {

        // 1. Remove the image from the category
        Category category = categoryService.getCategoryById(categoryId).orElseThrow();
        category.setImage(null);
        categoryService.saveCategory(category);

        // 2. Delete the image from the database and storage
        imageService.deleteImage(imageId);

        // 3. Return no content response
        return ResponseEntity.noContent().build();
    }
}