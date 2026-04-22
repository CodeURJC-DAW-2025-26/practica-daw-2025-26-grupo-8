package com.aparizzio.pizzeria.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;

import java.sql.SQLException;
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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/categories")
@Tag(name = "Categories", description = "Gestion de categorias y productos por categoria")
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
    @Operation(summary = "Listar categorias", description = "Devuelve todas las categorias del catalogo.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Categorias obtenidas")
    })
    public List<CategoryDTO> getCategories() {
        // Use your real getAllCategories() method
        return categoryService.getAllCategories().stream()
                .map(categoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    // GET: Obtain a single category by ID
    @GetMapping("/{id}")
    @Operation(summary = "Obtener categoria por ID", description = "Recupera una categoria concreta.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Categoria encontrada"),
            @ApiResponse(responseCode = "404", description = "Categoria no encontrada")
    })
    public ResponseEntity<CategoryDTO> getCategory(@PathVariable long id) {
        // Use your real getCategoryById() method
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
    @Operation(summary = "Crear categoria", description = "Crea una categoria nueva. Requiere rol ADMIN.")
    @SecurityRequirement(name = "accessTokenCookie")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Categoria creada"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
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
    @Operation(summary = "Actualizar categoria", description = "Actualiza una categoria existente. Requiere rol ADMIN.")
    @SecurityRequirement(name = "accessTokenCookie")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Categoria actualizada"),
            @ApiResponse(responseCode = "404", description = "Categoria no encontrada"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
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
    @Operation(summary = "Eliminar categoria", description = "Elimina una categoria de forma segura. Requiere rol ADMIN.")
    @SecurityRequirement(name = "accessTokenCookie")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Categoria eliminada"),
            @ApiResponse(responseCode = "404", description = "Categoria no encontrada"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
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
    @Operation(summary = "Listar productos de una categoria", description = "Devuelve los productos paginados de una categoria.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Productos obtenidos")
    })
    public Page<ProductDTO> getCategoryProducts(@PathVariable long id, Pageable pageable) {
        return productService.getProductsByCategory(id, pageable).map(productMapper::toDTO);
    }

    // POST: Upload an image for a category (Multipart form data)
    @PostMapping("/{id}/images")
    @Operation(summary = "Subir imagen de categoria", description = "Asocia una imagen a una categoria. Requiere rol ADMIN.")
    @SecurityRequirement(name = "accessTokenCookie")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Imagen creada y asociada"),
            @ApiResponse(responseCode = "400", description = "Fichero invalido"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
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
    @Operation(summary = "Eliminar imagen de categoria", description = "Desvincula y elimina la imagen de una categoria. Requiere rol ADMIN.")
    @SecurityRequirement(name = "accessTokenCookie")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Imagen eliminada"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
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

    @GetMapping("/{id}/image")
    @Operation(summary = "Descargar imagen de la categoria", description = "Devuelve el contenido binario de la imagen asociada a la categoria.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Binario de imagen devuelto"),
            @ApiResponse(responseCode = "404", description = "Categoria o imagen no encontrada")
    })
    public ResponseEntity<Object> downloadCategoryImage(@PathVariable long id)
            throws SQLException, java.io.IOException {

        Category category = categoryService.getCategoryById(id).orElseThrow();

        if (category.getImage() != null) {
            Resource imageFile = imageService.getImageFile(category.getImage().getId());

            MediaType mediaType = MediaTypeFactory
                    .getMediaType(imageFile)
                    .orElse(MediaType.IMAGE_JPEG);

            return ResponseEntity.ok().contentType(mediaType).body(imageFile);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}