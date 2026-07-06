package com.booking.backend.config;

import com.booking.backend.security.JwtFilter;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

        @Autowired
        private JwtFilter jwtFilter;

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration config = new CorsConfiguration();

                config.setAllowedOrigins(List.of("http://localhost:3000"));
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(List.of("*"));
                config.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", config);

                return source;
        }

        // 🔐 mã hoá password
        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        // 🔥 cấu hình security
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // 🔥 QUAN TRỌNG

                                .csrf(csrf -> csrf.disable())

                                // ❗ JWT không dùng session
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                                .authorizeHttpRequests(auth -> auth

                                                // ✅ Swagger
                                                .requestMatchers(
                                                                "/swagger-ui/**",
                                                                "/swagger-ui.html",
                                                                "/v3/api-docs/**",
                                                                "/v3/api-docs/swagger-config")
                                                .permitAll()

                                                // ✅ Auth (login, register)
                                                // .requestMatchers("/api/auth/**").permitAll()
                                                .requestMatchers(
                                                                "/api/auth/login",
                                                                "/api/auth/register")
                                                .permitAll()

                                                .requestMatchers("/api/chat/**").permitAll()
                                                // =========================
                                                // PUBLIC APIs
                                                // =========================
                                                .requestMatchers(HttpMethod.GET,
                                                                "/api/banners/**",
                                                                "/api/doctors/**",
                                                                "/api/specialties/**",
                                                                "/api/branches/**",
                                                                "/api/schedules/**",
                                                                "/api/posts/**",
                                                                "/api/rooms/**",
                                                                "/api/reviews/**")
                                                .permitAll()
                                                .requestMatchers("/api/payments/**").permitAll()
                                                .requestMatchers("/api/payment/**").permitAll()
                                                // 🔐 Phân quyền
                                                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                                .requestMatchers("/api/doctor/**").hasRole("DOCTOR")
                                                .requestMatchers("/api/patient/**").hasRole("PATIENT")
                                                .requestMatchers("/sepay-webhook").permitAll()

                                                // 🔒 còn lại phải login
                                                .anyRequest().authenticated())
                                // Mới
                                .exceptionHandling(ex -> ex
                                                .authenticationEntryPoint((req, res, authEx) -> {

                                                        res.setStatus(401);

                                                        res.setContentType("application/json");

                                                        res.setCharacterEncoding("UTF-8");

                                                        res.getWriter().write(
                                                                        """
                                                                                        {
                                                                                            "message": "Token không hợp lệ hoặc đã hết hạn"
                                                                                        }
                                                                                        """);
                                                }))

                                // 🔥 thêm JWT filter
                                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}