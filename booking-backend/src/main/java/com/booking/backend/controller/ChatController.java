package com.booking.backend.controller;

import com.booking.backend.dto.ChatRequest;
import com.booking.backend.dto.ChatResponse;
import com.booking.backend.service.HospitalChatbotService;
import com.booking.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class ChatController {

    private final HospitalChatbotService chatbotService;

    /**
     * Gửi tin nhắn và nhận phản hồi từ chatbot
     */
    @PostMapping("/send")
    public ResponseEntity<ChatResponse> sendMessage(@Valid @RequestBody ChatRequest request) {
        try {
            log.info("📩 Nhận tin nhắn: {}", request.getMessage());

            // Lấy userId từ token (nếu có)
            Long userId = SecurityUtils.getCurrentUserId();
            if (userId == null) {
                userId = 0L; // User chưa đăng nhập
            }

            // Gọi service xử lý
            String responseText = chatbotService.getResponse(request.getMessage(), userId);

            // Tạo response
            ChatResponse response = ChatResponse.builder()
                    .message(responseText)
                    .sender("BOT")
                    .timestamp(java.time.LocalDateTime.now().toString())
                    .success(true)
                    .build();

            log.info("✅ Đã trả lời user {}: {}", userId,
                    responseText.substring(0, Math.min(50, responseText.length())));
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ Lỗi xử lý chat: ", e);

            ChatResponse errorResponse = ChatResponse.builder()
                    .message("Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau!")
                    .sender("BOT")
                    .timestamp(java.time.LocalDateTime.now().toString())
                    .success(false)
                    .error(e.getMessage())
                    .build();

            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * Tạo session mới cho chat
     */
    @PostMapping("/session")
    public ResponseEntity<Map<String, String>> createSession() {
        String sessionId = java.util.UUID.randomUUID().toString();
        Map<String, String> response = new HashMap<>();
        response.put("sessionId", sessionId);
        response.put("message", "Đã tạo session mới!");
        return ResponseEntity.ok(response);
    }

    /**
     * Kiểm tra trạng thái chatbot
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "online");
        status.put("version", "1.0.0");
        status.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(status);
    }

    /**
     * Reset conversation
     */
    @PostMapping("/reset")
    public ResponseEntity<Map<String, String>> resetConversation(@RequestParam(required = false) Long userId) {
        if (userId == null) {
            userId = SecurityUtils.getCurrentUserId();
        }
        if (userId == null) {
            userId = 0L;
        }

        chatbotService.resetConversation(userId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Đã reset conversation. Bạn có thể bắt đầu chat mới!");
        return ResponseEntity.ok(response);
    }
}