package com.aparizzio.pizzeria.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;

import java.sql.SQLException;
import java.util.Optional;

import com.aparizzio.pizzeria.model.Image;
import com.aparizzio.pizzeria.model.Product;
import com.aparizzio.pizzeria.dto.ProductDTO;
import com.aparizzio.pizzeria.dto.ProductMapper;
import com.aparizzio.pizzeria.service.ImageService;
import com.aparizzio.pizzeria.service.ProductService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/v1/products")
@Tag(name = "Products", description = "Catalogo de productos y gestion de imagenes de producto")
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
    @Operation(summary = "Listar productos", description = "Devuelve productos paginados del catalogo.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Productos obtenidos")
    })
    public Page<ProductDTO> getProducts(Pageable pageable) {
        return productService.getProducts(pageable).map(productMapper::toDTO);
    }

    // GET: Obtain a single product by ID
    @GetMapping("/{id}")
    @Operation(summary = "Obtener producto por ID", description = "Recupera el detalle de un producto.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Producto encontrado"),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    })
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
    @Operation(summary = "Crear producto", description = "Crea un producto nuevo. Requiere rol ADMIN.")
    @SecurityRequirement(name = "accessTokenCookie")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Producto creado"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
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
    @Operation(summary = "Actualizar producto", description = "Actualiza un producto existente. Requiere rol ADMIN.")
    @SecurityRequirement(name = "accessTokenCookie")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Producto actualizado"),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
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
    @Operation(summary = "Eliminar producto", description = "Elimina un producto de forma segura. Requiere rol ADMIN.")
    @SecurityRequirement(name = "accessTokenCookie")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Producto eliminado"),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<Void> deleteProduct(@PathVariable long id) {
        Optional<Product> productOpt = productService.getProductById(id);
        if (productOpt.isPresent()) {
            productService.deleteProductSafely(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // POST: Upload an image for a product
    @PostMapping("/{id}/images")
    @Operation(summary = "Subir imagen de producto", description = "Asocia una imagen binaria al producto. Requiere rol ADMIN.")
    @SecurityRequirement(name = "accessTokenCookie")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Imagen creada y asociada"),
            @ApiResponse(responseCode = "400", description = "Fichero invalido"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
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
    @Operation(summary = "Eliminar imagen de producto", description = "Desvincula y elimina la imagen asociada a un producto. Requiere rol ADMIN.")
    @SecurityRequirement(name = "accessTokenCookie")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Imagen eliminada"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<Void> deleteProductImage(
            @PathVariable long productId,
            @PathVariable long imageId) throws java.io.IOException {

        // 1. Desvinculate the image from the product
        productService.removeImageFromProduct(productId);

        // 2. Delete the image from the database and storage
        imageService.deleteImage(imageId);

        // 3. Return no content response
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/image")
    @Operation(summary = "Descargar imagen del producto", description = "Devuelve el contenido binario de la imagen asociada al producto.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Binario de imagen devuelto"),
            @ApiResponse(responseCode = "404", description = "Producto o imagen no encontrada")
    })
    public ResponseEntity<Object> downloadProductImage(@PathVariable long id)
            throws SQLException, java.io.IOException {

        Product product = productService.getProductById(id).orElseThrow();

        if (product.getImage() != null) {
            Resource imageFile = imageService.getImageFile(product.getImage().getId());

            MediaType mediaType = MediaTypeFactory
                    .getMediaType(imageFile)
                    .orElse(MediaType.IMAGE_JPEG);

            return ResponseEntity.ok().contentType(mediaType).body(imageFile);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}