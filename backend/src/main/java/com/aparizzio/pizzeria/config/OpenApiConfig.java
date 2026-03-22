package com.aparizzio.pizzeria.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

@OpenAPIDefinition(info = @Info(title = "PizzaFast API REST", version = "v1", description = "API REST de PizzaFast para autenticacion, usuarios, catalogo, imagenes y pedidos.", contact = @Contact(name = "Equipo PizzaFast"), license = @License(name = "MIT")))
@SecurityScheme(name = "accessTokenCookie", type = SecuritySchemeType.APIKEY, in = SecuritySchemeIn.COOKIE, paramName = "AccessToken", description = "Cookie HTTP-only con JWT de acceso. Se obtiene al hacer login en /api/v1/auth/login.")
public class OpenApiConfig {
}
