package com.booking.backend.dto;

import lombok.Data;

@Data
public class BookingStatusRequest {

    private String status;

    private String diagnosis;

    private String prescription;

    private String doctorNote;
}