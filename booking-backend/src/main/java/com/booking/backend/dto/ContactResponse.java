package com.booking.backend.dto;

import lombok.Data;

@Data
public class ContactResponse {
    private Long id;
    private String status;
    private String message;
}