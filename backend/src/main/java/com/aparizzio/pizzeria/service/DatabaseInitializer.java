package com.aparizzio.pizzeria.service;

import java.io.IOException;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.aparizzio.pizzeria.model.Category;
import com.aparizzio.pizzeria.model.Image;
import com.aparizzio.pizzeria.model.Product;
import com.aparizzio.pizzeria.model.User;
import com.aparizzio.pizzeria.repository.CategoryRepository;
import com.aparizzio.pizzeria.repository.ProductRepository;
import com.aparizzio.pizzeria.repository.UserRepository;
import java.util.List;

@Service
public class DatabaseInitializer {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ImageService imageService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() throws IOException {

        // Comprobamos si la base de datos ya tiene datos para no duplicar al reiniciar
        if (productRepository.count() == 0) {

            // 1. Carga de Categorías
            Category catPizzas = new Category();
            catPizzas.setTitle("Pizzas");
            catPizzas.setDescription("Nuestras mejores pizzas caseras");
            categoryRepository.save(catPizzas);

            Category catPastas = new Category();
            catPastas.setTitle("Pastas");
            catPastas.setDescription("Pastas frescas y deliciosas");
            categoryRepository.save(catPastas);

            // 2. Carga de Productos
            Product pepperoni = new Product("Pizza Pepperoni",
                    "Salsa de tomate, mozzarella y pepperoni picante.",
                    List.of("Gluten", "Lácteos"), 12, "La favorita", catPizzas);
            setProductImage(pepperoni, "static/assets/images/pizza-peperonni.png");
            productRepository.save(pepperoni);

            Product barbacoa = new Product("Pizza Barbacoa",
                    "Carne picada, pollo, bacon y nuestra salsa secreta.",
                    List.of("Gluten", "Lácteos", "Carne"), 14, "Sabor intenso", catPizzas);
            setProductImage(barbacoa, "static/assets/images/pizza-barbacoa.jpg");
            productRepository.save(barbacoa);

            // 3. Carga de Usuarios (1 Admin, 2 Usuarios registrados)
            userRepository.save(new User(
                    "Administrador",
                    "admin@aparizzio.com",
                    passwordEncoder.encode("adminpass"),
                    "USER", "ADMIN"));

            userRepository.save(new User(
                    "Juan Pérez",
                    "juan@ejemplo.com",
                    passwordEncoder.encode("pass1234"),
                    "USER"));

            userRepository.save(new User(
                    "Laura García",
                    "laura@ejemplo.com",
                    passwordEncoder.encode("pass1234"),
                    "USER"));
        }
    }

    // Método auxiliar adaptado para los productos de la pizzería
    private void setProductImage(Product product, String classpathResource) throws IOException {
        Resource imageResource = new ClassPathResource(classpathResource);
        if (imageResource.exists()) {
            Image createdImage = imageService.createImage(imageResource.getInputStream());
            product.setImage(createdImage);
        } else {
            System.err.println("Atención: No se encontró la imagen en " + classpathResource);
        }
    }
}