package com.aparizzio.pizzeria.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.aparizzio.pizzeria.model.Product;
import com.aparizzio.pizzeria.repository.CategoryRepository;
import com.aparizzio.pizzeria.repository.ProductRepository;
import com.aparizzio.pizzeria.model.Category;
import com.aparizzio.pizzeria.repository.UserRepository;
import com.aparizzio.pizzeria.repository.OrderRepository;
import com.aparizzio.pizzeria.model.Image;
import com.aparizzio.pizzeria.model.Order;
import com.aparizzio.pizzeria.service.CartService;
import com.aparizzio.pizzeria.service.ImageService;

import java.util.Optional;

@Controller
public class WebController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ImageService imageService;

    @Autowired
    private CartService cartService;

    @GetMapping("/")
    public String showIndex(Model model) {
        model.addAttribute("categories", categoryRepository.findAll());
        model.addAttribute("topProducts", productRepository.findAll(PageRequest.of(0, 5)).getContent());

        // Variable para marcar el botón "Inicio" como activo en el navbar
        model.addAttribute("isHome", true);
        return "index";
    }

    @GetMapping("/menu")
    public String showMenu(Model model) {
        model.addAttribute("products", productRepository.findAll());
        model.addAttribute("categories", categoryRepository.findAll());

        // Variable para marcar el botón "Ver Carta" como activo
        model.addAttribute("isMenu", true);
        return "menu";
    }

    @GetMapping("/product/{id}")
    public String showProductDetails(Model model, @PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            model.addAttribute("product", product.get());
            // No activamos ningún botón específico del navbar principal
            return "product";
        } else {
            return "redirect:/";
        }
    }

    @GetMapping("/category/{id}")
    public String showCategory(Model model, @PathVariable Long id) {
        Optional<Category> category = categoryRepository.findById(id);

        if (category.isPresent()) {
            // Mandamos la categoría entera a la vista (incluye su lista de productos)
            model.addAttribute("category", category.get());

            // Reutilizamos la lista de productos de esta categoría específica para
            // pintarlos
            model.addAttribute("products", category.get().getProducts());

            // Mantenemos activo el botón del Navbar de la carta
            model.addAttribute("isMenu", true);

            return "category"; // Carga el archivo category.html
        } else {
            return "redirect:/menu"; // Si no existe la categoría, lo mandamos a la carta
        }
    }

    @GetMapping("/admin/categories")
    public String showAdminCategories(Model model) {
        model.addAttribute("categories", categoryRepository.findAll());
        model.addAttribute("products", productRepository.findAll());
        return "admin-categories";
    }

    @GetMapping("/admin/users")
    public String showAdminUsers(Model model) {
        model.addAttribute("users", userRepository.findAll());
        return "admin-users";
    }

    @GetMapping("/admin/orders")
    public String showAdminOrders(Model model) {
        model.addAttribute("orders", orderRepository.findAll());
        return "admin-orders";
    }

    @PostMapping("/admin/products/new")
    public String createProduct(
            @RequestParam String title,
            @RequestParam Long categoryId,
            @RequestParam double price,
            @RequestParam(required = false) List<String> allergies,
            @RequestParam("imageFile") MultipartFile imageFile,
            @RequestParam String shortDescription,
            @RequestParam String description) throws IOException {

        // 1. Creamos el nuevo producto y le asignamos los datos de texto
        Product newProduct = new Product();
        newProduct.setTitle(title);
        newProduct.setPrice((int) price);
        newProduct.setShortDescription(shortDescription);
        newProduct.setDescription(description);

        if (allergies != null) {
            newProduct.setAllergies(allergies);
        }

        // 2. Buscamos la categoría por ID y se la asignamos
        Optional<Category> category = categoryRepository.findById(categoryId);
        category.ifPresent(newProduct::setCategory);

        // 3. MAGIA: Si nos han subido una imagen, la guardamos en la BD y la asignamos
        if (!imageFile.isEmpty()) {
            Image image = imageService.createImage(imageFile.getInputStream());
            newProduct.setImage(image);
        }

        // 4. Guardamos el producto en la base de datos
        productRepository.save(newProduct);

        // 5. Redirigimos de vuelta a la página de inventario
        return "redirect:/admin/categories";
    }

    @PostMapping("/admin/categories/new")
    public String createCategory(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam("imageFile") MultipartFile imageFile) throws IOException {

        // 1. Generate the new category and set its text data
        Category newCategory = new Category();
        newCategory.setTitle(title);
        newCategory.setDescription(description);

        // 2. If an image was uploaded, save it to the DB and assign it to the category
        if (!imageFile.isEmpty()) {
            Image image = imageService.createImage(imageFile.getInputStream());
            newCategory.setImage(image);
        }

        // 3. Save the category to the database
        categoryRepository.save(newCategory);

        // 4. Recharge the page
        return "redirect:/admin/categories";
    }

    @GetMapping("/cart")
    public String showCart(Model model) {
        model.addAttribute("cartProducts", cartService.getProducts());
        model.addAttribute("total", cartService.getTotal());
        model.addAttribute("isCart", true);
        return "cart";
    }

    @PostMapping("/cart/add/{id}")
    @ResponseBody // Esto permite devolver solo un mensaje o estado, no una vista
    public String addToCart(@PathVariable Long id) {
        productRepository.findById(id).ifPresent(cartService::addProduct);
        return "Producto añadido correctamente"; // Este mensaje no se verá si no quieres
    }

    @PostMapping("/cart/remove/{id}")
    public String removeFromCart(@PathVariable Long id) {
        cartService.removeProduct(id);
        return "redirect:/cart";
    }

    @PostMapping("/order/checkout")
    public String processOrder(@RequestParam String address, @RequestParam String city,
            @RequestParam String postalCode, @RequestParam String phoneNumber) {

        if (cartService.getProducts().isEmpty())
            return "redirect:/menu";

        Order order = new Order();
        order.setProducts(new ArrayList<>(cartService.getProducts()));
        order.setAddress(address);
        order.setCity(city);
        order.setPostalCode(postalCode);
        order.setPhoneNumber(phoneNumber);
        // Aquí deberías obtener el usuario autenticado y setearlo:
        // order.setUser(currentUser);

        orderRepository.save(order);
        cartService.clear(); // Vaciar carrito tras la compra

        return "redirect:/"; // O una página de éxito
    }
}