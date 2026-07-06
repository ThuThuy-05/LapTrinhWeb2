package com.booking.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String askGemini(String prompt, String systemInstruction) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="
                + apiKey;

        Map<String, Object> body = new HashMap<>();

        // 1. Đóng gói phần tin nhắn của User (contents)
        Map<String, Object> text = new HashMap<>();
        text.put("text", prompt);

        Map<String, Object> part = new HashMap<>();
        part.put("parts", List.of(text));
        body.put("contents", List.of(part));

        // 2. Đóng gói phần chỉ thị hệ thống (systemInstruction) nếu có
        if (systemInstruction != null && !systemInstruction.trim().isEmpty()) {
            Map<String, Object> sysText = new HashMap<>();
            sysText.put("text", systemInstruction);

            Map<String, Object> sysPart = new HashMap<>();
            sysPart.put("parts", List.of(sysText));

            body.put("systemInstruction", sysPart);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            // Thay vì lấy String thô chứa toàn bộ cây JSON từ Google, ta bóc tách lấy text
            // luôn cho gọn
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            return root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi xử lý phản hồi từ Gemini API: " + e.getMessage(), e);
        }
    }
}