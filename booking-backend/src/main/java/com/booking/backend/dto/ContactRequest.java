package com.booking.backend.dto;

import lombok.Data;

@Data
public class ContactRequest {
    private Long userId;

    private String name;
    private String email;
    private String phone;
    private String subject;
    private String message;
}