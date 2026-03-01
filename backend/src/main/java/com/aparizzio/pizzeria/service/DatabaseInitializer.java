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
import com.aparizzio.pizzeria.model.Order;
import com.aparizzio.pizzeria.model.Product;
import com.aparizzio.pizzeria.model.User;
import com.aparizzio.pizzeria.repository.CategoryRepository;
import com.aparizzio.pizzeria.repository.OrderRepository;
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
        private OrderRepository orderRepository; // Add the orders repository

        @Autowired
        private PasswordEncoder passwordEncoder;

        @PostConstruct
        public void init() throws IOException {

                // Check whether the database already has data to avoid duplicates on restart
                if (productRepository.count() == 0) {

                        System.out.println("--- INICIANDO CARGA DE DATOS DE PRUEBA ---");

                        // 1. LOAD USERS

                        // Main regular user
                        userRepository.save(new User(
                                        "user",
                                        "user@user.com",
                                        passwordEncoder.encode("user"),
                                        "USER"));

                        // Admin user
                        userRepository.save(new User(
                                        "admin",
                                        "admin@admin.com",
                                        passwordEncoder.encode("admin"),
                                        "USER", "ADMIN"));

                        // Additional users for test orders
                        User juan = new User(
                                        "Juan Pérez",
                                        "juan@ejemplo.com",
                                        passwordEncoder.encode("pass1234"),
                                        "USER");
                        userRepository.save(juan);

                        User laura = new User(
                                        "Laura García",
                                        "laura@ejemplo.com",
                                        passwordEncoder.encode("pass1234"),
                                        "USER");
                        userRepository.save(laura);

                        // 2. LOAD CATEGORIES
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

                        Category catAperitivos = new Category();
                        catAperitivos.setTitle("Aperitivos");
                        catAperitivos.setDescription("Entrantes ligeros para abrir el apetito.");
                        setCategoryImage(catAperitivos, "static/assets/images/aperitivos-banner.jpg");
                        categoryRepository.save(catAperitivos);

                        // 3. LOAD PRODUCTS

                        // --- PIZZAS (WITH image) ---
                        Product pepperoni = new Product("Pizza Pepperoni",
                                        "Salsa de tomate, mozzarella y pepperoni picante.",
                                        List.of("Gluten", "Lácteos", "Huevo"), 12, "La favorita", catPizzas);
                        setProductImage(pepperoni, "static/assets/images/pizza-peperonni.png");
                        productRepository.save(pepperoni);

                        Product barbacoa = new Product("Pizza Barbacoa",
                                        "Carne picada, pollo, bacon y nuestra salsa secreta.",
                                        List.of("Gluten", "Pescado", "Frutos Secos", "Picante"), 14, "Sabor intenso",
                                        catPizzas);
                        setProductImage(barbacoa, "static/assets/images/pizza-barbacoa.jpg");
                        productRepository.save(barbacoa);

                        // --- DRINKS (same format as pizzas, with image slot) ---
                        Product cocacola = new Product("Coca-Cola",
                                        "Refresco de cola muy frío en formato 33cl.",
                                        List.of(), 2, "Refrescante", catBebidas);
                        setProductImage(cocacola, "static/assets/images/cocacola.jpg");
                        productRepository.save(cocacola);

                        Product fanta = new Product("Fanta Naranja",
                                        "Refresco de naranja con gas en formato 33cl.",
                                        List.of(), 2, "Sabor cítrico", catBebidas);
                        setProductImage(fanta, "static/assets/images/fanta.jpg");
                        productRepository.save(fanta);

                        Product cerveza = new Product("Cerveza",
                                        "Refresco de cebada histórico 50cl.",
                                        List.of("Gluten"), 3, "La clásica", catBebidas);
                        setProductImage(cerveza, "static/assets/images/cerveza.webp");
                        productRepository.save(cerveza);

                        Product aquarius = new Product("Aquarius Naranja",
                                        "Bebida isotónica sabor naranja en formato 33cl.",
                                        List.of(), 2, "Hidratación diaria", catBebidas);
                        setProductImage(aquarius, "static/assets/images/acuarius-naranja.jpg");
                        productRepository.save(aquarius);

                        Product agua = new Product("Agua Lanjarón",
                                        "Agua mineral natural en formato 50cl.",
                                        List.of(), 2, "Ligera y fresca", catBebidas);
                        setProductImage(agua, "static/assets/images/agua.jpeg");
                        productRepository.save(agua);

                        // --- STARTERS (same format as pizzas, with image slot) ---
                        Product bruschettas = new Product("Bruschettas",
                                        "Pan tostado con queso crema, rúcula y jamón curado.",
                                        List.of("Gluten", "Lácteos"), 7, "Crujientes", catAperitivos);
                        setProductImage(bruschettas, "static/assets/images/bruschettas.jpg");
                        productRepository.save(bruschettas);

                        Product caprese = new Product("Ensalada Caprese",
                                        "Tomate fresco, mozzarella y albahaca con aceite de oliva.",
                                        List.of("Lácteos"), 8, "Muy fresca", catAperitivos);
                        setProductImage(caprese, "static/assets/images/ensalada-aparizzio.jpg");
                        productRepository.save(caprese);

                        Product focaccia = new Product("Focaccia",
                                        "Pan artesanal con tomate cherry y hierbas aromáticas.",
                                        List.of("Gluten"), 6, "Recién horneada", catAperitivos);
                        setProductImage(focaccia, "static/assets/images/focacha.jpg");
                        productRepository.save(focaccia);

                        Product provolone = new Product("Provolone al Horno",
                                        "Queso provolone fundido al horno con orégano.",
                                        List.of("Lácteos"), 9, "Muy meloso", catAperitivos);
                        setProductImage(provolone, "static/assets/images/provolone.jpg");
                        productRepository.save(provolone);

                        Product pan = new Product("Pan de Ajo",
                                        "Pan horneado con mantequilla de ajo y perejil.",
                                        List.of("Gluten", "Lácteos"), 5, "Aromático y crujiente", catAperitivos);
                        setProductImage(pan, "static/assets/images/pan-de-ajo.jpg");
                        productRepository.save(pan);

                        // 4. LOAD TEST ORDERS
                        Order pedidoJuan = new Order();
                        pedidoJuan.setUser(juan); // This order belongs to Juan
                        pedidoJuan.setAddress("Calle Mayor 10, 4B");
                        pedidoJuan.setCity("Madrid");
                        pedidoJuan.setPostalCode("28001");
                        pedidoJuan.setPhoneNumber("655112233");
                        pedidoJuan.setProducts(List.of(pepperoni)); // Juan orders one Pepperoni
                        orderRepository.save(pedidoJuan);

                        Order pedidoLaura = new Order();
                        pedidoLaura.setUser(laura); // This order belongs to Laura
                        pedidoLaura.setAddress("Av. de la Ilustración 45");
                        pedidoLaura.setCity("Barcelona");
                        pedidoLaura.setPostalCode("08015");
                        pedidoLaura.setPhoneNumber("600998877");
                        pedidoLaura.setProducts(List.of(barbacoa, pepperoni)); // Laura orders two pizzas
                        orderRepository.save(pedidoLaura);

                        System.out.println("--- DATOS DE PRUEBA CARGADOS CON ÉXITO ---");
                }
        }

        // Helper method to attach images to PRODUCTS
        private void setProductImage(Product product, String classpathResource) throws IOException {
                Resource imageResource = new ClassPathResource(classpathResource);
                if (imageResource.exists()) {
                        Image createdImage = imageService.createImage(imageResource.getInputStream());
                        product.setImage(createdImage);
                } else {
                        System.err.println("Atención: No se encontró la imagen en " + classpathResource);
                }
        }

        // Helper method to attach images to CATEGORIES
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