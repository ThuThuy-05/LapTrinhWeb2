package com.booking.backend.controller;

import com.booking.backend.dto.ChatRequest;
import com.booking.backend.dto.ChatResponse;
import com.booking.backend.service.HospitalChatbotService;
import com.booking.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class ChatController {

    private final HospitalChatbotService chatbotService;

    /**
     * Gửi tin nhắn và nhận phản hồi từ chatbot
     * POST /api/chat/send
     */
    @PostMapping("/send")
    public ResponseEntity<ChatResponse> sendMessage(@Valid @RequestBody ChatRequest request) {
        log.info("📩 Nhận tin nhắn: {}", request.getMessage());

        try {
            // Lấy userId từ token (nếu có)
            Long userId = SecurityUtils.getCurrentUserId();
            if (userId == null) {
                userId = 0L; // User chưa đăng nhập
            }

            log.info("👤 User ID: {}", userId);

            // Gọi service xử lý
            String responseText = chatbotService.getResponse(request.getMessage(), userId);

            // Tạo response
            ChatResponse response = ChatResponse.builder()
                    .message(responseText)
                    .sender("BOT")
                    .timestamp(LocalDateTime.now().toString())
                    .success(true)
                    .build();

            log.info("✅ Đã trả lời user {}: {}...", userId,
                    responseText.length() > 50 ? responseText.substring(0, 50) + "..." : responseText);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ Lỗi xử lý chat: ", e);

            ChatResponse errorResponse = ChatResponse.builder()
                    .message("Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau!")
                    .sender("BOT")
                    .timestamp(LocalDateTime.now().toString())
                    .success(false)
                    .error(e.getMessage())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Tạo session mới cho chat
     * POST /api/chat/session
     */
    @PostMapping("/session")
    public ResponseEntity<Map<String, Object>> createSession() {
        log.info("🔄 Tạo session mới");

        try {
            String sessionId = UUID.randomUUID().toString();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("sessionId", sessionId);
            response.put("message", "Đã tạo session mới!");
            response.put("timestamp", LocalDateTime.now().toString());

            log.info("✅ Session created: {}", sessionId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ Lỗi tạo session: ", e);

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Không thể tạo session");
            response.put("timestamp", LocalDateTime.now().toString());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Reset conversation
     * POST /api/chat/reset?userId=xxx
     */
    @PostMapping("/reset")
    public ResponseEntity<Map<String, Object>> resetConversation(
            @RequestParam(required = false) Long userId) {

        log.info("🔄 Reset conversation cho userId: {}", userId);

        try {
            // Lấy userId nếu không có
            if (userId == null) {
                userId = SecurityUtils.getCurrentUserId();
            }
            if (userId == null) {
                userId = 0L;
            }

            // Gọi service reset
            chatbotService.resetConversation(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đã reset conversation. Bạn có thể bắt đầu chat mới!");
            response.put("userId", userId);
            response.put("timestamp", LocalDateTime.now().toString());

            log.info("✅ Reset thành công cho user: {}", userId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ Lỗi reset conversation: ", e);

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Không thể reset conversation");
            response.put("timestamp", LocalDateTime.now().toString());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Lấy lịch sử chat của user
     * GET /api/chat/history?userId=xxx
     */
    @GetMapping("/history")
    public ResponseEntity<Map<String, Object>> getHistory(
            @RequestParam(required = false) Long userId) {

        log.info("📜 Lấy lịch sử chat cho userId: {}", userId);

        try {
            if (userId == null) {
                userId = SecurityUtils.getCurrentUserId();
            }
            if (userId == null) {
                userId = 0L;
            }

            var history = chatbotService.getHistory(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", userId);
            response.put("history", history);
            response.put("count", history.size());
            response.put("timestamp", LocalDateTime.now().toString());

            log.info("✅ Đã lấy {} tin nhắn cho user: {}", history.size(), userId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ Lỗi lấy lịch sử: ", e);

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Không thể lấy lịch sử");
            response.put("timestamp", LocalDateTime.now().toString());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Xóa lịch sử chat của user
     * DELETE /api/chat/history?userId=xxx
     */
    @DeleteMapping("/history")
    public ResponseEntity<Map<String, Object>> clearHistory(
            @RequestParam(required = false) Long userId) {

        log.info("🗑️ Xóa lịch sử chat cho userId: {}", userId);

        try {
            if (userId == null) {
                userId = SecurityUtils.getCurrentUserId();
            }
            if (userId == null) {
                userId = 0L;
            }

            chatbotService.clearHistory(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Đã xóa lịch sử chat!");
            response.put("userId", userId);
            response.put("timestamp", LocalDateTime.now().toString());

            log.info("✅ Đã xóa lịch sử cho user: {}", userId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ Lỗi xóa lịch sử: ", e);

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Không thể xóa lịch sử");
            response.put("timestamp", LocalDateTime.now().toString());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}