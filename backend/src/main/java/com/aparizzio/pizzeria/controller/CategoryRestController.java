package com.aparizzio.pizzeria.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.aparizzio.pizzeria.model.Category;
import com.aparizzio.pizzeria.dto.CategoryDTO;
import com.aparizzio.pizzeria.dto.CategoryMapper;
import com.aparizzio.pizzeria.service.CategoryService;
import com.aparizzio.pizzeria.repository.CategoryRepository; // Importamos el repo para el POST/PUT sin imágenes

@RestController
@RequestMapping("/api/categories")
public class CategoryRestController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryMapper categoryMapper;

    // GET: Obtener todas las categorías
    @GetMapping("/")
    public List<CategoryDTO> getCategories() {
        // Usamos tu método getAllCategories() real
        return categoryService.getAllCategories().stream()
                .map(categoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    // GET: Obtener una sola categoría por ID
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

    // POST: Crear una nueva categoría (Solo datos JSON, sin imagen)
    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryDTO createCategory(@RequestBody CategoryDTO categoryDTO) {
        Category newCategory = new Category();
        newCategory.setTitle(categoryDTO.getTitle());
        newCategory.setDescription(categoryDTO.getDescription());

        // Guardamos directamente en el repo para evitar el error del MultipartFile
        categoryRepository.save(newCategory);

        return categoryMapper.toDTO(newCategory);
    }

    // PUT: Actualizar una categoría existente (Solo datos JSON)
    @PutMapping("/{id}")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable long id,
            @RequestBody CategoryDTO updatedCategoryDTO) {
        Optional<Category> categoryOpt = categoryService.getCategoryById(id);

        if (categoryOpt.isPresent()) {
            Category category = categoryOpt.get();
            category.setTitle(updatedCategoryDTO.getTitle());
            category.setDescription(updatedCategoryDTO.getDescription());

            categoryRepository.save(category);
            return ResponseEntity.ok(categoryMapper.toDTO(category));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE: Borrar una categoría de forma segura
    @DeleteMapping("/{id}")
    public ResponseEntity<CategoryDTO> deleteCategory(@PathVariable long id) {
        Optional<Category> categoryOpt = categoryService.getCategoryById(id);

        if (categoryOpt.isPresent()) {
            Category category = categoryOpt.get();
            // Usamos tu método seguro que desvincula los productos primero
            categoryService.deleteCategorySafely(id);
            return ResponseEntity.ok(categoryMapper.toDTO(category));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}