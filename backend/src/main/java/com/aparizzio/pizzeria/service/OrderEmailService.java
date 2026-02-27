package com.aparizzio.pizzeria.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.MimeMessageHelper;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

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

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            if (senderAddress != null && !senderAddress.isBlank()) {
                helper.setFrom(senderAddress);
            }

            helper.setTo(user.getEmail());
            helper.setSubject("✅ Confirmación de pedido Aparizzio #" + order.getId());

            String plainText = buildOrderSummaryText(user, order);
            String htmlText = buildOrderSummaryHtml(user, order);

            helper.setText(plainText, htmlText);
            mailSender.send(message);
            LOGGER.info("Correo de confirmación enviado al usuario {} para el pedido {}", user.getEmail(),
                    order.getId());
        } catch (MessagingException exception) {
            throw new IllegalStateException("No se pudo construir el correo HTML", exception);
        }
    }

    private String buildOrderSummaryText(User user, Order order) {
        StringBuilder body = new StringBuilder();
        body.append("Hola ")
                .append(user.getName() != null ? user.getName() : "cliente")
                .append(",\n\n")
                .append("Hemos recibido tu pedido correctamente.\n")
                .append("Número de pedido: #")
                .append(order.getId())
                .append("\n\n")
                .append("Resumen de productos:\n");

        Map<String, Integer> unitsByProduct = getUnitsByProduct(order);
        int total = 0;
        List<Product> products = order.getProducts();

        if (products != null) {
            for (Product product : products) {
                if (product == null || product.getTitle() == null) {
                    continue;
                }
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

    private String buildOrderSummaryHtml(User user, Order order) {
        String customerName = user.getName() != null ? user.getName() : "cliente";
        Map<String, Integer> unitsByProduct = getUnitsByProduct(order);

        int total = 0;
        if (order.getProducts() != null) {
            for (Product product : order.getProducts()) {
                if (product == null) {
                    continue;
                }
                total += product.getPrice();
            }
        }

        StringBuilder productsRows = new StringBuilder();
        for (Map.Entry<String, Integer> entry : unitsByProduct.entrySet()) {
            productsRows.append("<tr>")
                    .append("<td style='padding:10px 12px;border-bottom:1px solid #eee;'>")
                    .append(escapeHtml(entry.getKey()))
                    .append("</td>")
                    .append("<td style='padding:10px 12px;border-bottom:1px solid #eee;text-align:right;font-weight:600;'>x")
                    .append(entry.getValue())
                    .append("</td>")
                    .append("</tr>");
        }

        if (productsRows.length() == 0) {
            productsRows.append("<tr><td colspan='2' style='padding:10px 12px;color:#666;'>Sin productos</td></tr>");
        }

        return "<!DOCTYPE html>"
                + "<html lang='es'>"
                + "<head>"
                + "<meta charset='UTF-8' />"
                + "<meta name='viewport' content='width=device-width, initial-scale=1.0' />"
                + "</head>"
                + "<body style='margin:0;padding:0;background:#f7f7f7;font-family:Roboto,Arial,sans-serif;color:#333;'>"
                + "<div style='max-width:640px;margin:24px auto;padding:0 12px;'>"
                + "<div style='background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.08);'>"
                + "<div style='background:linear-gradient(135deg,#ff6347 0%,#e5533d 100%);color:#fff;padding:22px 24px;'>"
                + "<h1 style='margin:0;font-size:24px;font-family:Lobster,Segoe UI,Arial,sans-serif;letter-spacing:.4px;'>🍕 Aparizzio</h1>"
                + "<p style='margin:8px 0 0 0;font-size:14px;opacity:.95;'>Tu pedido ha sido confirmado</p>"
                + "</div>"
                + "<div style='padding:24px;'>"
                + "<p style='margin:0 0 12px 0;font-size:16px;'>Hola <strong>" + escapeHtml(customerName)
                + "</strong>,</p>"
                + "<p style='margin:0 0 16px 0;line-height:1.5;'>Hemos recibido tu pedido correctamente. Te dejamos aquí el resumen:</p>"
                + "<div style='background:#fff7f5;border:1px solid #ffd7cf;border-radius:10px;padding:14px 16px;margin-bottom:16px;'>"
                + "<p style='margin:0;font-size:14px;'><strong>Número de pedido:</strong> #" + order.getId() + "</p>"
                + "<p style='margin:8px 0 0 0;font-size:14px;'><strong>Dirección:</strong> "
                + escapeHtml(nvl(order.getAddress())) + ", "
                + escapeHtml(nvl(order.getCity())) + " "
                + escapeHtml(nvl(order.getPostalCode())) + "</p>"
                + "<p style='margin:8px 0 0 0;font-size:14px;'><strong>Teléfono:</strong> "
                + escapeHtml(nvl(order.getPhoneNumber())) + "</p>"
                + "</div>"
                + "<table style='width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:8px;overflow:hidden;'>"
                + "<thead><tr style='background:#fff2ee;'>"
                + "<th style='text-align:left;padding:10px 12px;font-size:14px;'>Producto</th>"
                + "<th style='text-align:right;padding:10px 12px;font-size:14px;'>Unidades</th>"
                + "</tr></thead>"
                + "<tbody>" + productsRows + "</tbody>"
                + "</table>"
                + "<p style='margin:16px 0 0 0;text-align:right;font-size:20px;color:#ff6347;'><strong>Total: "
                + total + "€</strong></p>"
                + "<p style='margin:20px 0 0 0;color:#555;font-size:14px;'>Gracias por confiar en Aparizzio ❤️</p>"
                + "</div></div></div></body></html>";
    }

    private Map<String, Integer> getUnitsByProduct(Order order) {
        Map<String, Integer> unitsByProduct = new LinkedHashMap<>();
        List<Product> products = order.getProducts();
        if (products == null) {
            return unitsByProduct;
        }

        for (Product product : products) {
            if (product == null || product.getTitle() == null) {
                continue;
            }
            unitsByProduct.merge(product.getTitle(), 1, Integer::sum);
        }
        return unitsByProduct;
    }

    private String nvl(String value) {
        return value == null ? "" : value;
    }

    private String escapeHtml(String value) {
        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}