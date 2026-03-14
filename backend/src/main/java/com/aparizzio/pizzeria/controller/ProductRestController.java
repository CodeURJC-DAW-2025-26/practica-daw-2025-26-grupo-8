package com.aparizzio.pizzeria.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.aparizzio.pizzeria.model.Image;
import com.aparizzio.pizzeria.model.Product;
import com.aparizzio.pizzeria.dto.ProductDTO;
import com.aparizzio.pizzeria.dto.ProductMapper;
import com.aparizzio.pizzeria.service.ImageService;
import com.aparizzio.pizzeria.service.ProductService;
import com.aparizzio.pizzeria.repository.ProductRepository;

@RestController
@RequestMapping("/api/products")
public class ProductRestController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private ImageService imageService;

    @Autowired
    private com.aparizzio.pizzeria.dto.ImageMapper imageMapper;

    // GET: Get all products (Paginated)
    @GetMapping("/")
    public Page<ProductDTO> getProducts(Pageable pageable) {

        // We fetch the Page of entities from the service
        // Then we use the .map() method from the Page interface to convert each entity
        // to a DTO
        return productService.getProducts(pageable).map(productMapper::toDTO);
    }

    // GET: Obtener un solo producto por ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable long id) {
        // Usamos tu método getProductById() real
        Optional<Product> productOpt = productService.getProductById(id);

        if (productOpt.isPresent()) {
            return ResponseEntity.ok(productMapper.toDTO(productOpt.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // POST: Crear un nuevo producto (Solo datos JSON)
    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductDTO createProduct(@RequestBody ProductDTO productDTO) {
        Product newProduct = new Product();
        newProduct.setTitle(productDTO.getTitle());
        newProduct.setDescription(productDTO.getDescription());
        newProduct.setShortDescription(productDTO.getShortDescription());
        newProduct.setPrice(productDTO.getPrice());
        newProduct.setAllergies(productDTO.getAllergies());

        productRepository.save(newProduct);
        return productMapper.toDTO(newProduct);
    }

    // PUT: Actualizar producto existente
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

            productRepository.save(product);
            return ResponseEntity.ok(productMapper.toDTO(product));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE: Borrar un producto de forma segura
    @DeleteMapping("/{id}")
    public ResponseEntity<ProductDTO> deleteProduct(@PathVariable long id) {
        Optional<Product> productOpt = productService.getProductById(id);

        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            // Usamos tu método seguro que actualiza los pedidos primero
            productService.deleteProductSafely(id);
            return ResponseEntity.ok(productMapper.toDTO(product));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // POST: Upload an image to an existing product
    @PostMapping("/{id}/images/")
    public ResponseEntity<com.aparizzio.pizzeria.dto.ImageDTO> createProductImage(
            @PathVariable long id,
            @RequestParam MultipartFile imageFile) throws java.io.IOException {

        if (imageFile.isEmpty()) {
            throw new IllegalArgumentException("Image file cannot be empty");
        }

        // Create the image using the generic image service
        Image image = imageService.createImage(imageFile.getInputStream());

        // Link the newly created image to the specific product
        productService.addImageToProduct(id, image);

        // Generate the URL to download the new image (Location header)
        java.net.URI location = org.springframework.web.servlet.support.ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/images/{imageId}/media")
                .buildAndExpand(image.getId())
                .toUri();

        return ResponseEntity.created(location).body(imageMapper.toDTO(image));
    }

    // DELETE: Remove the image from a product and delete it from the DB
    @DeleteMapping("/{productId}/images/{imageId}")
    public com.aparizzio.pizzeria.dto.ImageDTO deleteProductImage(
            @PathVariable long productId,
            @PathVariable long imageId) throws java.io.IOException {

        Image image = imageService.getImage(imageId);

        // Unlink the image from the product first
        productService.removeImageFromProduct(productId);

        // Delete the image entity safely
        imageService.deleteImage(imageId);

        return imageMapper.toDTO(image);
    }
}