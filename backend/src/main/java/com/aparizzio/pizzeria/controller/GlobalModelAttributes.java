package com.aparizzio.pizzeria.controller;

import java.security.Principal;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
public class GlobalModelAttributes {

    // Automatically adds a "logged" boolean to all Mustache templates
    @ModelAttribute("logged")
    public boolean isLogged(Principal principal) {
        return principal != null;
    }

    // Automatically adds the CSRF "token" to all Mustache templates 
    // (You will need this to perform the POST request for logging out)
    @ModelAttribute("token")
    public String getCsrfToken(HttpServletRequest request) {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        return csrfToken != null ? csrfToken.getToken() : "";
    }
}