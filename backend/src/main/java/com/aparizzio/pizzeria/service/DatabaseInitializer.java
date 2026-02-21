package com.aparizzio.pizzeria.service;

import java.io.IOException;
import java.util.List;

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

            System.out.println("--- INICIANDO CARGA DE DATOS DE PRUEBA ---");

            // 1. CARGA DE USUARIOS
            // Usuario normal
            userRepository.save(new User(
                    "user",
                    "user@user.com",
                    passwordEncoder.encode("user"),
                    "USER"));

            // Usuario administrador
            userRepository.save(new User(
                    "admin",
                    "admin@admin.com",
                    passwordEncoder.encode("admin"),
                    "USER", "ADMIN"));

            // 2. CARGA DE CATEGORÍAS
            Category catPizzas = new Category();
            catPizzas.setTitle("Pizzas");
            catPizzas.setDescription("Nuestras mejores pizzas caseras al horno de leña.");
            setCategoryImage(catPizzas, "static/assets/images/pizzas-banner-categoria-pizza.jpg");
            categoryRepository.save(catPizzas);

            Category catBebidas = new Category();
            catBebidas.setTitle("Bebidas");
            catBebidas.setDescription("Refrescos fríos para acompañar tu comida.");
            setCategoryImage(catBebidas, "static/assets/images/bebidas-banner.jpg");
            categoryRepository.save(catBebidas);

            // 3. CARGA DE PRODUCTOS

            // --- PIZZAS (CON imagen) ---
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

            // --- BEBIDAS (SIN imagen, como solicitaste) ---
            Product cocacola = new Product("Coca-Cola",
                    "Refresco de cola muy frío en formato 33cl.",
                    List.of(), 2, "Refrescante", catBebidas);
            productRepository.save(cocacola);

            Product fanta = new Product("Fanta Naranja",
                    "Refresco de naranja con gas en formato 33cl.",
                    List.of(), 2, "Sabor cítrico", catBebidas);
            productRepository.save(fanta);

            System.out.println("--- DATOS DE PRUEBA CARGADOS CON ÉXITO ---");
        }
    }

    // Método auxiliar para cargar imágenes a los PRODUCTOS
    private void setProductImage(Product product, String classpathResource) throws IOException {
        Resource imageResource = new ClassPathResource(classpathResource);
        if (imageResource.exists()) {
            Image createdImage = imageService.createImage(imageResource.getInputStream());
            product.setImage(createdImage);
        } else {
            System.err.println("Atención: No se encontró la imagen en " + classpathResource);
        }
    }

    // Método auxiliar para cargar imágenes a las CATEGORÍAS
    private void setCategoryImage(Category category, String classpathResource) throws IOException {
        Resource imageResource = new ClassPathResource(classpathResource);
        if (imageResource.exists()) {
            Image createdImage = imageService.createImage(imageResource.getInputStream());
            category.setImage(createdImage);
        } else {
            System.err.println("Atención: No se encontró la imagen de categoría en " + classpathResource);
        }
    }
}