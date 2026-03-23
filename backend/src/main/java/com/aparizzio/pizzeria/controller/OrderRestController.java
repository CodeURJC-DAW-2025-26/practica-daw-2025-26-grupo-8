package com.aparizzio.pizzeria.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aparizzio.pizzeria.dto.OrderDTO;
import com.aparizzio.pizzeria.dto.OrderRequestDTO;
import com.aparizzio.pizzeria.dto.OrderMapper;
import com.aparizzio.pizzeria.model.Order;
import com.aparizzio.pizzeria.model.Product;
import com.aparizzio.pizzeria.model.User;
import com.aparizzio.pizzeria.service.OrderService;
import com.aparizzio.pizzeria.service.ProductService;
import com.aparizzio.pizzeria.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/v1/orders")
@Tag(name = "Orders", description = "Creacion y gestion de pedidos")
public class OrderRestController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private UserService userService;

    @Autowired
    private com.aparizzio.pizzeria.service.OrderEmailService orderEmailService;

    // POST: Create a new order
    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear pedido", description = "Crea un pedido para el usuario autenticado.")
    @SecurityRequirement(name = "accessTokenCookie")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Pedido creado"),
            @ApiResponse(responseCode = "401", description = "No autenticado")
    })
    public OrderDTO createOrder(@RequestBody OrderRequestDTO requestDTO, HttpServletRequest request) {

        // Identifies the user making the order from the JWT token
        String email = request.getUserPrincipal().getName();
        User user = userService.getUserByEmail(email).orElseThrow();

        // Remake the list of products from the list of product IDs sent by the client
        List<Product> orderProducts = new ArrayList<>();
        for (Long productId : requestDTO.getProductIds()) {
            Optional<Product> p = productService.getProductById(productId);
            p.ifPresent(orderProducts::add);
        }

        // Create the order using the real service method, which will calculate the
        // total price and save everything to the database
        Order newOrder = orderService.createOrder(
                orderProducts,
                requestDTO.getAddress(),
                requestDTO.getCity(),
                requestDTO.getPostalCode(),
                requestDTO.getPhoneNumber(),
                user);

        // Send the order summary email to the user
        orderEmailService.sendOrderSummaryEmail(user, newOrder);

        return orderMapper.toDTO(newOrder);
    }

    // GET: See all orders (ADMIN)
    @GetMapping("/")
    @Operation(summary = "Listar pedidos", description = "Devuelve todos los pedidos. Requiere rol ADMIN.")
    @SecurityRequirement(name = "accessTokenCookie")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Pedidos obtenidos"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public java.util.List<OrderDTO> getAllOrders() {
        return orderService.getAllOrders().stream()
                .map(orderMapper::toDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    // GET: See order details (ADMIN)
    @GetMapping("/{id}")
    @Operation(summary = "Obtener pedido por ID", description = "Recupera un pedido concreto. Requiere rol ADMIN.")
    @SecurityRequirement(name = "accessTokenCookie")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Pedido encontrado"),
            @ApiResponse(responseCode = "404", description = "Pedido no encontrado"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<OrderDTO> getOrder(@PathVariable long id) {
        Optional<Order> orderOpt = orderService.getOrderById(id);
        if (orderOpt.isPresent()) {
            return ResponseEntity.ok(orderMapper.toDTO(orderOpt.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE: Delete an order (ADMIN)
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar pedido", description = "Elimina un pedido por ID. Requiere rol ADMIN.")
    @SecurityRequirement(name = "accessTokenCookie")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Pedido eliminado"),
            @ApiResponse(responseCode = "404", description = "Pedido no encontrado"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    public ResponseEntity<Void> deleteOrder(@PathVariable long id) {
        Optional<Order> orderOpt = orderService.getOrderById(id);
        if (orderOpt.isPresent()) {
            orderService.deleteOrder(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}