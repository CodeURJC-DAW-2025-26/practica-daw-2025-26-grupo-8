package com.aparizzio.pizzeria.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import jakarta.servlet.http.HttpServletResponse;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import com.aparizzio.pizzeria.model.Product;
import com.aparizzio.pizzeria.repository.CategoryRepository;
import com.aparizzio.pizzeria.repository.ProductRepository;
import com.aparizzio.pizzeria.model.Category;
import com.aparizzio.pizzeria.service.MenuService;
import com.aparizzio.pizzeria.service.MetricsService;

@Controller
public class PublicWebController {

    private static final int PAGE_SIZE = 4;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private MenuService menuService;

    @Autowired
    private MetricsService metricsService;

    // --- HOME PAGE ---
    @GetMapping("/")
    public String showIndex(Model model) {
        List<Long> topSoldProductIds = metricsService.getTopSoldProductIds();
        List<Product> topProducts;

        if (topSoldProductIds.isEmpty()) {
            topProducts = productRepository.findAll(PageRequest.of(0, 5)).getContent();
        } else {
            Map<Long, Product> productsById = productRepository.findAllById(topSoldProductIds).stream()
                    .collect(Collectors.toMap(Product::getId, product -> product));

            topProducts = topSoldProductIds.stream()
                    .map(productsById::get)
                    .filter(product -> product != null)
                    .toList();
        }

        model.addAttribute("categories", categoryRepository.findAll());
        model.addAttribute("topProducts", topProducts);
        model.addAttribute("isHome", true);
        return "index";
    }

    // --- MAIN MENU PAGE ---
    @GetMapping("/menu")
    public String showMenu(
            Model model,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(name = "allergen", required = false) List<String> excludedAllergens,
            @RequestParam(defaultValue = "false") boolean fragment,
            @RequestHeader(value = "X-Requested-With", required = false) String requestedWith,
            HttpServletResponse response) {

        MenuService.ProductPageData menuPageData = menuService.getMenuProducts(
                validatePage(page), PAGE_SIZE, excludedAllergens);

        model.addAttribute("products", menuPageData.getProducts());

        if (isAjaxRequest(fragment, requestedWith)) {
            return prepareFragmentResponse(response, menuPageData, page);
        }

        model.addAttribute("categories", categoryRepository.findAll());
        model.addAttribute("hasMoreProducts", menuPageData.getTotalProducts() > PAGE_SIZE);
        model.addAttribute("isMenu", true);
        return "menu";
    }

    // --- SINGLE PRODUCT DETAILS ---
    @GetMapping("/product/{id}")
    public String showProductDetails(Model model, @PathVariable Long id) {
        Optional<Product> product = menuService.getProductById(id);
        if (product.isPresent()) {
            model.addAttribute("product", product.get());
            return "product";
        } else {
            return "redirect:/";
        }
    }

    // --- CATEGORY FILTER PAGE ---
    @GetMapping("/category/{id}")
    public String showCategory(
            Model model,
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "false") boolean fragment,
            @RequestHeader(value = "X-Requested-With", required = false) String requestedWith,
            HttpServletResponse response) {

        Optional<Category> category = menuService.getCategoryById(id);

        if (category.isEmpty()) {
            model.addAttribute("products", List.of());
            return isAjaxRequest(fragment, requestedWith) ? "fragments/product-cards" : "redirect:/menu";
        }

        MenuService.ProductPageData categoryPageData = menuService.getCategoryProducts(
                id, validatePage(page), PAGE_SIZE);

        model.addAttribute("products", categoryPageData.getProducts());

        if (isAjaxRequest(fragment, requestedWith)) {
            return prepareFragmentResponse(response, categoryPageData, page);
        }

        model.addAttribute("category", category.get());
        model.addAttribute("hasProducts", categoryPageData.getTotalProducts() > 0);
        model.addAttribute("hasMoreProducts", categoryPageData.getTotalProducts() > PAGE_SIZE);
        model.addAttribute("categoryId", id);
        model.addAttribute("isMenu", true);

        return "category";
    }

    // -----------------------
    // --- HELPER METHODS ---
    // -----------------------

    private boolean isAjaxRequest(boolean fragment, String requestedWith) {
        return fragment || "XMLHttpRequest".equalsIgnoreCase(requestedWith);
    }

    private String prepareFragmentResponse(
            HttpServletResponse response,
            MenuService.ProductPageData pageData,
            int page) {

        boolean hasMore = pageData.hasMoreAfterPage(validatePage(page), PAGE_SIZE);
        response.setHeader("X-Has-More", String.valueOf(hasMore));
        return "fragments/product-cards";
    }

    private int validatePage(int page) {
        return Math.max(page, 0);
    }
}