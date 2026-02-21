package com.aparizzio.pizzeria.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.authorizeHttpRequests(authorize -> authorize

                // 1. PERMITIR RECURSOS ESTÁTICOS (Imágenes, CSS, JS)
                .requestMatchers("/css/**", "/assets/**", "/images/**", "/js/**").permitAll()

                // 2. PERMITIR PÁGINAS PÚBLICAS (Añadimos /category/** explícitamente)
                .requestMatchers("/", "/menu", "/cart", "/product/**", "/category/**", "/error").permitAll()

                // 3. BLOQUEAR EL RESTO (Panel de admin, etc.)
                .anyRequest().authenticated());

        // Habilitamos el formulario de login temporal de Spring
        http.formLogin(formLogin -> formLogin.permitAll());

        // Desactivamos CSRF temporalmente
        http.csrf(csrf -> csrf.disable());

        return http.build();
    }
}