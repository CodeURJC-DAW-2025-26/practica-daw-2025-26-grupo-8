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
                // 1. Rutas públicas (Usuario anónimo puede ver la web)
                .requestMatchers("/", "/menu", "/product/*", "/category/*", "/error").permitAll()

                // 2. Recursos estáticos e imágenes (¡Muy importante para que no se rompa el
                // diseño!)
                .requestMatchers("/css/*", "/assets/", "/images/*").permitAll()

                // 3. El resto de rutas requerirán autenticación (pedidos, panel de admin, etc.)
                .anyRequest().authenticated());

        // Por ahora dejamos el login por defecto de Spring para poder entrar a las
        // zonas privadas
        http.formLogin(formLogin -> formLogin.permitAll());

        // Para evitar problemas al hacer peticiones POST temporales
        http.csrf(csrf -> csrf.disable());

        return http.build();
    }
}