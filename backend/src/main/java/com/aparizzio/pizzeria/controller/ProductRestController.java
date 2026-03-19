package com.aparizzio.pizzeria.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

import com.aparizzio.pizzeria.model.Image;
import com.aparizzio.pizzeria.model.Product;
import com.aparizzio.pizzeria.dto.ProductDTO;
import com.aparizzio.pizzeria.dto.ProductMapper;
import com.aparizzio.pizzeria.service.ImageService;
import com.aparizzio.pizzeria.service.ProductService;

@RestController
@RequestMapping("/api/v1/products")
public class ProductRestController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private ImageService imageService;

    @Autowired
    private com.aparizzio.pizzeria.dto.ImageMapper imageMapper;

    @Autowired
    private com.aparizzio.pizzeria.service.CategoryService categoryService;

    // GET: Obtain all products (Paginated)
    @GetMapping("/")
    public Page<ProductDTO> getProducts(Pageable pageable) {
        return productService.getProducts(pageable).map(productMapper::toDTO);
    }

    // GET: Obtain a single product by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable long id) {
        Optional<Product> productOpt = productService.getProductById(id);
        if (productOpt.isPresent()) {
            return ResponseEntity.ok(productMapper.toDTO(productOpt.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // POST: Create a new product (Only JSON data, no image upload)
    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductDTO createProduct(@RequestBody ProductDTO productDTO) {
        Product newProduct = new Product();
        newProduct.setTitle(productDTO.getTitle());
        newProduct.setDescription(productDTO.getDescription());
        newProduct.setShortDescription(productDTO.getShortDescription());
        newProduct.setPrice(productDTO.getPrice());
        newProduct.setAllergies(productDTO.getAllergies());

        // Search for the category by ID and set it to the product (if categoryId is
        // provided)
        if (productDTO.getCategoryId() != null) {
            Optional<com.aparizzio.pizzeria.model.Category> categoryOpt = categoryService
                    .getCategoryById(productDTO.getCategoryId());
            categoryOpt.ifPresent(newProduct::setCategory);
        }

        productService.save(newProduct);

        return productMapper.toDTO(newProduct);
    }

    // PUT: Update an existing product (Only JSON data, no image upload)
    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable long id, @RequestBody ProductDTO updatedProductDTO) {
        Optional<Product> productOpt = productService.getProductById(id);

        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setTitle(updatedProductDTO.getTitle());
            product.setDescription(updatedProductDTO.getDescription());
            product.setShortDescription(updatedProductDTO.getShortDescription());
            product.setPrice(updatedProductDTO.getPrice());
            product.setAllergies(updatedProductDTO.getAllergies());

            // 1. Search for the category by ID and set it to the product (if categoryId is
            // provided)
            if (updatedProductDTO.getCategoryId() != null) {
                Optional<com.aparizzio.pizzeria.model.Category> categoryOpt = categoryService
                        .getCategoryById(updatedProductDTO.getCategoryId());
                categoryOpt.ifPresent(product::setCategory);
            }

            productService.save(product);

            return ResponseEntity.ok(productMapper.toDTO(product));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE: Delete a product safely (Unlinks from orders first)
    @DeleteMapping("/{id}")
    public ResponseEntity<ProductDTO> deleteProduct(@PathVariable long id) {
        Optional<Product> productOpt = productService.getProductById(id);
        if (productOpt.isPresent()) {
            ProductDTO dto = productMapper.toDTO(productOpt.get());
            productService.deleteProductSafely(id);
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // POST: Upload an image for a product
    @PostMapping("/{id}/images")
    public ResponseEntity<com.aparizzio.pizzeria.dto.ImageDTO> createProductImage(
            @PathVariable long id,
            @RequestParam MultipartFile imageFile) throws java.io.IOException {

        if (imageFile.isEmpty()) {
            throw new IllegalArgumentException("Image file cannot be empty");
        }
        Image image = imageService.createImage(imageFile.getInputStream());
        productService.addImageToProduct(id, image);

        java.net.URI location = org.springframework.web.servlet.support.ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/api/v1/images/{imageId}/media")
                .buildAndExpand(image.getId()).toUri();

        return ResponseEntity.created(location).body(imageMapper.toDTO(image));
    }

    // DELETE: Delete an image from a product
    @DeleteMapping("/{productId}/images/{imageId}")
    public com.aparizzio.pizzeria.dto.ImageDTO deleteProductImage(
            @PathVariable long productId,
            @PathVariable long imageId) throws java.io.IOException {

        Image image = imageService.getImage(imageId);
        productService.removeImageFromProduct(productId);
        imageService.deleteImage(imageId);
        return imageMapper.toDTO(image);
    }
}