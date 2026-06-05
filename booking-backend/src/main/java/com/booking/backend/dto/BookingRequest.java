package com.booking.backend.dto;

import lombok.Data;

@Data
public class BookingRequest {

    private Long userId;

    private Long scheduleId;

    private String symptom;
}