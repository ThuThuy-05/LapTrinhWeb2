package com.booking.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // =========================
    // Runtime Exception
    // =========================
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException ex) {
        // 🚨 THÊM DÒNG NÀY: Để khi lỗi xảy ra, bạn CÓ THỂ NHÌN THẤY nó ở Terminal
        ex.printStackTrace();

        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage());

        return ResponseEntity
                .badRequest()
                .body(response);
    }

    // =========================
    // Exception chung
    // =========================
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception ex) throws Exception {

        // 💡 MẸO QUAN TRỌNG: Nếu lỗi do Swagger (OpenAPI) tự gây ra,
        // hãy ném ngược lại để Spring Boot tự xử lý, đừng can thiệp vào.
        if (ex.getClass().getName().contains("org.springdoc") ||
                ex.getMessage() != null && ex.getMessage().contains("swagger")) {
            throw ex;
        }

        // 🚨 THÊM DÒNG NÀY: Để xem lỗi gốc là gì trong Terminal
        ex.printStackTrace();

        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(response);
    }
}