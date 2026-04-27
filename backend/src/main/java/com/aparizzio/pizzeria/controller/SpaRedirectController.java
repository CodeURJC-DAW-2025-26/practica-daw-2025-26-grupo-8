package com.aparizzio.pizzeria.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaRedirectController {

    // Añadimos "/new" y "/new/" explícitamente a la lista de valores
    @GetMapping(value = { "/new", "/new/", "/new/{path:[^\\.]*}" })
    public String forwardToSpa() {
        return "forward:/new/index.html";
    }
}