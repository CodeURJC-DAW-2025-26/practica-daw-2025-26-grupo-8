package com.aparizzio.pizzeria.controller;

import java.util.stream.Collectors;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aparizzio.pizzeria.dto.OrderDTO;
import com.aparizzio.pizzeria.dto.OrderMapper;
import com.aparizzio.pizzeria.dto.UserDTO;
import com.aparizzio.pizzeria.dto.UserUpdateDTO;
import com.aparizzio.pizzeria.dto.UserMapper;
import com.aparizzio.pizzeria.model.User;
import com.aparizzio.pizzeria.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Users", description = "Gestion de perfil de usuario, registro y administracion de usuarios")
public class UserRestController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private OrderMapper orderMapper;

    // GET: Obtain my own profile information
    @GetMapping("/me")
    @Operation(summary = "Obtener mi perfil", description = "Devuelve el perfil del usuario autenticado.")
    @SecurityRequirement(name = "accessTokenCookie")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Perfil obtenido"),
            @ApiResponse(responseCode = "401", description = "No autenticado")
    })
    public ResponseEntity<UserDTO> getMe(HttpServletRequest request) {
        String email = request.getUserPrincipal().getName();
        User user = userService.getUserByEmail(email).orElseThrow();
        return ResponseEntity.ok(userMapper.toDTO(user));
    }

    // PUT: Update my own profile
    @PutMapping("/me")
    @Operation(summary = "Actualizar mi perfil", description = "Actualiza nombre, email y/o contrasena tras validar la contrasena actual.")
    @SecurityRequirement(name = "accessTokenCookie")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Perfil actualizado"),
            @ApiResponse(responseCode = "400", description = "Datos invalidos o contrasena actual incorrecta"),
            @ApiResponse(responseCode = "401", description = "No autenticado")
    })
    public ResponseEntity<UserDTO> updateMe(@RequestBody UserUpdateDTO updateDTO, HttpServletRequest request) {
        String email = request.getUserPrincipal().getName();
        User user = userService.getUserByEmail(email).orElseThrow();

        // Use the updateUserProfile method in UserService
        boolean success = userService.updateUserProfile(
                user.getId(),
                updateDTO.getName(),
                updateDTO.getEmail(),
                updateDTO.getNewPassword(),
                updateDTO.getOldPassword());

        if (success) {
            User updatedUser = userService.getUserById(user.getId()).orElseThrow();
            return ResponseEntity.ok(userMapper.toDTO(updatedUser));
        } else {
            // If the update failed (e.g., old password didn't match), return a bad request
            return ResponseEntity.badRequest().build();
        }
    }

    // POST: Register a new user (public endpoint)
    @PostMapping("/register")
    @Operation(summary = "Registrar usuario", description = "Registra un nuevo usuario cliente.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Usuario registrado"),
            @ApiResponse(responseCode = "400", description = "Datos invalidos")
    })
    public ResponseEntity<String> registerUser(@RequestBody com.aparizzio.pizzeria.dto.UserRegisterDTO requestDTO) {

        if (requestDTO.getPassword() == null || requestDTO.getConfirmPassword() == null) {
            return ResponseEntity.badRequest().body("{\"error\": \"Faltan las contraseñas\"}");
        }

        String result = userService.registerUser(
                requestDTO.getName(),
                requestDTO.getEmail(),
                requestDTO.getPassword(),
                requestDTO.getConfirmPassword());

        if ("success".equals(result)) {
            return ResponseEntity.status(HttpStatus.CREATED).body("{\"message\": \"Usuario registrado\"}");
        }
        return ResponseEntity.badRequest().body("{\"error\": \"" + result + "\"}");
    }

    // GET: See my orders (requires authentication)
    @GetMapping("/me/orders")
    @Operation(summary = "Obtener mis pedidos", description = "Lista los pedidos del usuario autenticado.")
    @SecurityRequirement(name = "accessTokenCookie")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Pedidos obtenidos"),
            @ApiResponse(responseCode = "401", description = "No autenticado")
    })
    public List<OrderDTO> getMyOrders(HttpServletRequest request) {
        String email = request.getUserPrincipal().getName();
        User user = userService.getUserByEmail(email).orElseThrow();

        return userService.getUserOrders(user.getId()).stream()
                .map(orderMapper::toDTO)
                .collect(Collectors.toList());
    }

    // GET: See all users (ADMIN)
    @GetMapping("/")
    @Operation(summary = "Listar usuarios", description = "Devuelve todos los usuarios. Requiere rol ADMIN.")
    @SecurityRequirement(name = "accessTokenCookie")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuarios obtenidos"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers().stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    // GET: See a user by ID (ADMIN)
    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario por ID", description = "Recupera un usuario concreto por su identificador. Requiere rol ADMIN.")
    @SecurityRequirement(name = "accessTokenCookie")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuario encontrado"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<UserDTO> getUser(@PathVariable long id) {
        Optional<User> userOpt = userService.getUserById(id);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userMapper.toDTO(userOpt.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE: Delete a user (ADMIN)
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario", description = "Elimina un usuario por ID de forma segura. Requiere rol ADMIN.")
    @SecurityRequirement(name = "accessTokenCookie")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Usuario eliminado"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<Void> deleteUser(@PathVariable long id) {
        Optional<User> userOpt = userService.getUserById(id);
        if (userOpt.isPresent()) {
            userService.deleteUserSafely(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}