package com.booking.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO nhận tin nhắn từ client gửi lên
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {
    
    /**
     * Nội dung tin nhắn - Bắt buộc phải có
     */
    @NotBlank(message = "Tin nhắn không được để trống")
    @Size(max = 2000, message = "Tin nhắn không được vượt quá 2000 ký tự")
    private String message;
    
    /**
     * Session ID - Dùng để theo dõi luồng chat
     */
    private String sessionId;
    
    /**
     * User ID - Lấy từ token, không cần client gửi lên
     * (Để backend tự lấy từ SecurityContext)
     */
    private Long userId;
    
    /**
     * Channel gửi tin nhắn: WEB, APP, ZALO, FACEBOOK...
     */
    private String channel;
    
    /**
     * Loại tin nhắn: TEXT, VOICE, IMAGE...
     */
    private String messageType;
    
    /**
     * File đính kèm (nếu có)
     */
    private String attachment;
}