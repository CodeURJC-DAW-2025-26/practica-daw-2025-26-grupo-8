package com.aparizzio.pizzeria.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.aparizzio.pizzeria.security.jwt.JwtRequestFilter;
import com.aparizzio.pizzeria.security.jwt.JwtTokenProvider;
import com.aparizzio.pizzeria.security.jwt.UnauthorizedHandlerJwt;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    public RepositoryUserDetailsService userDetailService;

    @Autowired
    private UnauthorizedHandlerJwt unauthorizedHandlerJwt;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // ---------------------------------------
    // 1. API REST SECURITY (Stateless, JWT)
    // ---------------------------------------
    @Order(1)
    public SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {

        http.authenticationProvider(authenticationProvider());

        // Only apply this security configuration to API endpoints
        http.securityMatcher("/api/v1/**")
                .exceptionHandling(handling -> handling.authenticationEntryPoint(unauthorizedHandlerJwt));

        http.authorizeHttpRequests(authorize -> authorize
                // PUBLIC ENDPOINTS (Login, register and read-only access to
                // products/categories/images)
                .requestMatchers(HttpMethod.POST, "/api/v1/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/products/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/images/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/users/register").permitAll()

                // PRIVATE ENDPOINTS
                .requestMatchers(HttpMethod.POST, "/api/v1/products/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/v1/products/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/products/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/v1/categories/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/v1/categories/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/categories/**").hasRole("ADMIN")

                // Any other request to the API will require authentication
                .anyRequest().authenticated());

        // Disable forms and CSRF for the API
        http.formLogin(formLogin -> formLogin.disable());
        http.csrf(csrf -> csrf.disable());
        http.httpBasic(httpBasic -> httpBasic.disable());

        // Stateless sessions for the API
        http.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(new JwtRequestFilter(userDetailService, jwtTokenProvider),
                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // -------------------------------
    // 2. WEB APLICATION SECURITY
    // -------------------------------
    @Bean
    @Order(2)
    public SecurityFilterChain webFilterChain(HttpSecurity http) throws Exception {

        http.authenticationProvider(authenticationProvider());

        http.authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/css/**", "/assets/**", "/images/**", "/js/**").permitAll()
                .requestMatchers("/", "/menu", "/cart/**", "/product/**", "/category/**", "/error", "/register")
                .permitAll()

                // Documentation endpoints (Swagger/OpenAPI)
                .requestMatchers("/v3/api-docs*/**", "/swagger-ui.html", "/swagger-ui/**").permitAll()

                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().permitAll());

        http.formLogin(formLogin -> formLogin
                .loginPage("/")
                .loginProcessingUrl("/login")
                .failureUrl("/?error=true")
                .defaultSuccessUrl("/")
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
                .logoutUrl("/logout")
                .logoutSuccessUrl("/")
                .permitAll());

        http.exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint(new LoginUrlAuthenticationEntryPoint("/?auth_required=true"))
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.sendError(403, "Access denied. You do not have the required permissions.");
                }));

        http.csrf(csrf -> csrf.disable());

        return http.build();
    }
}