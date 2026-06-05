package com.booking.backend.dto;

import lombok.Data;

@Data
public class SpecialtyRequest {

    private String name;
    private String description;
    private String image;
    private Integer price;
    private Boolean active;
}