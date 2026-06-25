package com.booking.backend.dto;
import lombok.Data;
@Data


public class NotificationResponse {

    private Long id;

    private String content;

    private boolean isRead;

    private Long userId;

    private Long contactId;
}