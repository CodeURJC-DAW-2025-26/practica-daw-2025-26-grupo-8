package com.aparizzio.pizzeria.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.aparizzio.pizzeria.model.Order;
import com.aparizzio.pizzeria.model.Product;
import com.aparizzio.pizzeria.model.User;

@Service
public class OrderEmailService {

    private static final Logger LOGGER = LoggerFactory.getLogger(OrderEmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String senderAddress;

    public void sendOrderSummaryEmail(User user, Order order) {
        if (user == null || user.getEmail() == null || user.getEmail().isBlank()) {
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        if (senderAddress != null && !senderAddress.isBlank()) {
            message.setFrom(senderAddress);
        }
        message.setTo(user.getEmail());
        message.setSubject("✅ Confirmación de pedido Aparizzio #" + order.getId());
        message.setText(buildOrderSummaryBody(user, order));

        mailSender.send(message);
        LOGGER.info("Correo de confirmación enviado al usuario {} para el pedido {}", user.getEmail(), order.getId());
    }

    private String buildOrderSummaryBody(User user, Order order) {
        StringBuilder body = new StringBuilder();
        body.append("Hola ")
                .append(user.getName() != null ? user.getName() : "cliente")
                .append(",\n\n")
                .append("Hemos recibido tu pedido correctamente.\n")
                .append("Número de pedido: #")
                .append(order.getId())
                .append("\n\n")
                .append("Resumen de productos:\n");

        Map<String, Integer> unitsByProduct = new HashMap<>();
        int total = 0;
        List<Product> products = order.getProducts();

        if (products != null) {
            for (Product product : products) {
                if (product == null || product.getTitle() == null) {
                    continue;
                }
                unitsByProduct.merge(product.getTitle(), 1, Integer::sum);
                total += product.getPrice();
            }
        }

        for (Map.Entry<String, Integer> entry : unitsByProduct.entrySet()) {
            body.append("- ")
                    .append(entry.getKey())
                    .append(" x")
                    .append(entry.getValue())
                    .append("\n");
        }

        body.append("\n")
                .append("Dirección de entrega: ")
                .append(order.getAddress())
                .append(", ")
                .append(order.getCity())
                .append(" ")
                .append(order.getPostalCode())
                .append("\n")
                .append("Teléfono de contacto: ")
                .append(order.getPhoneNumber())
                .append("\n")
                .append("Total: ")
                .append(total)
                .append("€\n\n")
                .append("Gracias por confiar en Aparizzio 🍕");

        return body.toString();
    }
}