package com.booking.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SpecialtyResponse {

    private Long id;
    private String name;
    private String description;
    private Boolean active;
    private String image;
    private Integer price;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}