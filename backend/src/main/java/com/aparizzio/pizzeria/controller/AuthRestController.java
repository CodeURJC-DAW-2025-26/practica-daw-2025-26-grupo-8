package com.aparizzio.pizzeria.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aparizzio.pizzeria.security.jwt.AuthResponse;
import com.aparizzio.pizzeria.security.jwt.AuthResponse.Status;
import com.aparizzio.pizzeria.security.jwt.LoginRequest;
import com.aparizzio.pizzeria.security.jwt.UserLoginService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Auth", description = "Endpoints de autenticacion con JWT en cookies HTTP-only")
public class AuthRestController {

    @Autowired
    private UserLoginService userLoginService;

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesion", description = "Valida credenciales y genera cookies AccessToken y RefreshToken.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Autenticacion correcta o error funcional en cuerpo de respuesta"),
            @ApiResponse(responseCode = "401", description = "Credenciales invalidas")
    })
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest loginRequest,
            HttpServletResponse response) {

        return userLoginService.login(response, loginRequest);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refrescar token", description = "Renueva la cookie AccessToken usando la cookie RefreshToken.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Refresco procesado"),
            @ApiResponse(responseCode = "400", description = "Refresh token ausente o invalido")
    })
    public ResponseEntity<AuthResponse> refreshToken(
            @CookieValue(name = "RefreshToken", required = false) String refreshToken, HttpServletResponse response) {

        return userLoginService.refresh(response, refreshToken);
    }

    @PostMapping("/logout")
    @Operation(summary = "Cerrar sesion", description = "Elimina cookies de autenticacion y limpia el contexto de seguridad.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Sesion cerrada")
    })
    public ResponseEntity<AuthResponse> logOut(HttpServletResponse response) {
        return ResponseEntity.ok(new AuthResponse(Status.SUCCESS, userLoginService.logout(response)));
    }
}
