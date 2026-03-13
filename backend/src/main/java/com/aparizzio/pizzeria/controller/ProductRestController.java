package com.aparizzio.pizzeria.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.aparizzio.pizzeria.model.Product;
import com.aparizzio.pizzeria.dto.ProductDTO;
import com.aparizzio.pizzeria.dto.ProductMapper;
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

    // GET: Obtener todos los productos
    @GetMapping("/")
    public List<ProductDTO> getProducts() {
        // Usamos tu método getAllProducts() real
        return productService.getAllProducts().stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
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
}