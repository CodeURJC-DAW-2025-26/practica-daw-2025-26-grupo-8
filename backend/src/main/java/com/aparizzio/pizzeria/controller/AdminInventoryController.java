package com.aparizzio.pizzeria.controller;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.aparizzio.pizzeria.model.Category;
import com.aparizzio.pizzeria.model.Product;
import com.aparizzio.pizzeria.service.CategoryService;
import com.aparizzio.pizzeria.service.ProductService;

@Controller
public class AdminInventoryController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ProductService productService;

    // --- MAIN INVENTORY PAGE ---
    @GetMapping("/admin/categories")
    public String showAdminCategories(Model model) {
        model.addAttribute("categories", categoryService.getAllCategories());
        model.addAttribute("products", productService.getAllProducts());
        return "admin-categories";
    }

    // ==========================================
    // =============== PRODUCTS =================
    // ==========================================

    @PostMapping("/admin/products/new")
    public String createProduct(
            @RequestParam String title,
            @RequestParam Long categoryId,
            @RequestParam double price,
            @RequestParam(required = false) List<String> allergies,
            @RequestParam("imageFile") MultipartFile imageFile,
            @RequestParam String shortDescription,
            @RequestParam String description) throws IOException {

        productService.createProduct(title, categoryId, price, allergies, imageFile, shortDescription, description);
        return "redirect:/admin/categories";
    }

    @PostMapping("/admin/products/{id}/delete")
    public String deleteProduct(@PathVariable Long id) {
        productService.deleteProductSafely(id);
        return "redirect:/admin/categories";
    }

    @GetMapping("/admin/products/{id}/edit")
    public String showEditProductForm(@PathVariable Long id, Model model) {
        Optional<Product> product = productService.getProductById(id);
        if (product.isPresent()) {
            model.addAttribute("product", product.get());
            model.addAttribute("categories", categoryService.getAllCategories());
            model.addAttribute("isProductEdit", true);
            return "admin-edit";
        }
        return "redirect:/admin/categories";
    }

    @PostMapping("/admin/products/{id}/edit")
    public String updateProduct(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam Long categoryId,
            @RequestParam double price,
            @RequestParam(required = false) List<String> allergies,
            @RequestParam("imageFile") MultipartFile imageFile,
            @RequestParam String shortDescription,
            @RequestParam String description) throws IOException {

        productService.updateProduct(id, title, categoryId, price, allergies, imageFile, shortDescription, description);
        return "redirect:/admin/categories";
    }

    // ==========================================
    // ============== CATEGORIES ================
    // ==========================================

    @PostMapping("/admin/categories/new")
    public String createCategory(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam("imageFile") MultipartFile imageFile) throws IOException {

        categoryService.createCategory(title, description, imageFile);
        return "redirect:/admin/categories";
    }

    @PostMapping("/admin/categories/{id}/delete")
    public String deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategorySafely(id);
        return "redirect:/admin/categories";
    }

    @GetMapping("/admin/categories/{id}/edit")
    public String showEditCategoryForm(@PathVariable Long id, Model model) {
        Optional<Category> category = categoryService.getCategoryById(id);
        if (category.isPresent()) {
            model.addAttribute("category", category.get());
            model.addAttribute("isCategoryEdit", true);
            return "admin-edit";
        }
        return "redirect:/admin/categories";
    }

    @PostMapping("/admin/categories/{id}/edit")
    public String updateCategory(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam("imageFile") MultipartFile imageFile) throws IOException {

        categoryService.updateCategory(id, title, description, imageFile);
        return "redirect:/admin/categories";
    }
}