package com.booking.backend.dto;

import lombok.Data;

@Data
public class UpdateUserResponse {
    private Long id;
    private String name;
    private String phone;
    private String email;
    private String avatar;
    private String role;
    private String address;
}