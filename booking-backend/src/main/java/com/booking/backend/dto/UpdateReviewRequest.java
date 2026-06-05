package com.booking.backend.dto;

import lombok.Data;

@Data
public class UpdateReviewRequest {

    private Integer rating;

    private String comment;
}