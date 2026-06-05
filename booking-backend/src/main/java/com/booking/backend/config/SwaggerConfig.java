package com.booking.backend.config;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Movie Booking Application",
        version = "v1.0.0",
        description = "Backend REST APIs for Movie Booking Application",
        contact = @Contact(
            name = "DoctorBooking",
            email = "nguyenthithuthuy23705@gmail.com"
        ),
        license = @License(
            name = "MIT License",
            url = "https://opensource.org/licenses/MIT"
        )
    ),
    security = @SecurityRequirement(name = "bearerAuth"),
    servers = {
         @Server(
            url = "http://localhost:8080",
            description = "Local Server"
        ),
        // @Server(
        //     url = "https://chuyendethuctap-production-e210.up.railway.app",
        //     description = "Production (Railway HTTPS)"
        // )
    }
)
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT"
)
public class SwaggerConfig {
}