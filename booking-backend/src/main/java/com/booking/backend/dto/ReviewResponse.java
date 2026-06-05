package com.booking.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewResponse {
    private Long id;
    private Long userId; // thêm
    private String userName;
    private String doctorName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
    private Boolean isHidden;

}