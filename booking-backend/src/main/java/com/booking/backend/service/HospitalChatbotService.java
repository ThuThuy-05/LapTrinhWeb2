package com.booking.backend.service;

import java.util.List;

public interface HospitalChatbotService {

    /**
     * Trả lời chatbot
     */
    String getResponse(String message, Long userId);

    /**
     * Reset cuộc hội thoại
     */
    void resetConversation(Long userId);

    /**
     * Lấy lịch sử chat
     */
    List<String> getHistory(Long userId);

    /**
     * Xóa lịch sử chat
     */
    void clearHistory(Long userId);
}