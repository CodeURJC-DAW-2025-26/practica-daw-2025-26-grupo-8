package com.aparizzio.pizzeria.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaRedirectController {
    // Redirige cualquier ruta dentro de /new/ que no tenga extensión
    // (evitando pisar archivos estáticos) al index.html de React.
    @GetMapping(value = "/new/{path:[^\\.]*}")
    public String forwardToSpa() {
        return "forward:/new/index.html";
    }
}