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
                .requestMatchers("/css/**", "/assets/**", "/images/**", "/js/**").permitAll()
                .requestMatchers("/", "/menu", "/cart/**", "/product/**", "/category/**", "/error", "/register")
                .permitAll()

                .requestMatchers("/admin/**").hasRole("ADMIN")

                .anyRequest().authenticated());

        http.formLogin(formLogin -> formLogin
                // Lógica para decidir a dónde redirigir tras el login
                .successHandler((request, response, authentication) -> {
                    boolean isAdmin = authentication.getAuthorities().stream()
                            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
                    if (isAdmin) {
                        response.sendRedirect("/admin/metrics");
                    } else {
                        response.sendRedirect("/");
                    }
                })
                .permitAll());

        http.logout(logout -> logout
                .logoutUrl("/logout") // The URL that triggers log out (matches your HTML form)
                .logoutSuccessUrl("/") // Redirects to home page instead of login page
                .permitAll());

        http.csrf(csrf -> csrf.disable());

        return http.build();
    }
}