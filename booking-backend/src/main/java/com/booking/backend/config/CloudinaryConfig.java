package com.booking.backend.config;


import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(Map.of(
                "cloud_name", "dbxbz6alk",
                "api_key", "794261721482868",
                "api_secret", "t0MTfpV-Q-fWzXdDC4Dm6VgmLbY"
        ));
    }
}