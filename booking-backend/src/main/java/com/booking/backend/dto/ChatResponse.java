package com.booking.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * DTO trả về phản hồi từ chatbot
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {

    /**
     * Nội dung phản hồi
     */
    private String message;

    /**
     * Người gửi: BOT hoặc USER
     */
    @Builder.Default
    private String sender = "BOT";

    /**
     * Thời gian gửi
     */
    @Builder.Default
    private String timestamp = LocalDateTime.now().toString();

    /**
     * Trạng thái xử lý: true = thành công, false = thất bại
     */
    @Builder.Default
    private boolean success = true;

    /**
     * Thông báo lỗi (nếu có)
     */
    private String error;

    /**
     * Mã session
     */
    private String sessionId;

    /**
     * Loại response: TEXT, QUICK_REPLY, BUTTON, LIST, CARD
     */
    @Builder.Default
    private String responseType = "TEXT";

    /**
     * Các lựa chọn nhanh (quick replies)
     */
    private List<String> quickReplies;

    /**
     * Data bổ sung
     */
    private Map<String, Object> data;

    /**
     * Intent phát hiện được
     */
    private String intent;

    /**
     * Độ tin cậy của intent
     */
    private Double confidence;
}