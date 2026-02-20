
package com.aparizzio.pizzeria.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.aparizzio.pizzeria.repository.CategoryRepository;
import com.aparizzio.pizzeria.repository.ProductRepository;

@Controller
public class WebController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/")
    public String showIndex(Model model) {
        // Obtenemos todas las categorías
        model.addAttribute("categories", categoryRepository.findAll());

        // Simulamos los "5 más vendidos" pidiendo la página 0 con tamaño 5
        model.addAttribute("topProducts", productRepository.findAll(PageRequest.of(0, 5)).getContent());

        return "index";
    }

    @GetMapping("/menu")
    public String showMenu(Model model) {
        model.addAttribute("products", productRepository.findAll());
        model.addAttribute("categories", categoryRepository.findAll());
        return "menu";
    }
}