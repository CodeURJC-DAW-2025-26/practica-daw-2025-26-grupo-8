package com.aparizzio.pizzeria.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.aparizzio.pizzeria.model.Product;
import com.aparizzio.pizzeria.repository.CategoryRepository;
import com.aparizzio.pizzeria.repository.ProductRepository;
import com.aparizzio.pizzeria.model.Category;
import com.aparizzio.pizzeria.model.Product;

import java.util.Optional;

@Controller
public class WebController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

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

    @GetMapping("/cart")
    public String showCart(Model model) {
        // Variable para marcar el botón "Pedido" como activo
        model.addAttribute("isCart", true);
        return "cart";
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
}