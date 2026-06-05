package com.booking.backend.dto;

import lombok.Data;

@Data
public class MessageRequest {
    private String sender; // "USER" hoặc "ADMIN"
    private String content; // Nội dung tin nhắn
}