package com.booking.backend.dto;

import com.booking.backend.enums.Gender;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class UserDetailResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String avatar;
    private String role;
    private String address;
    private Gender gender;
    private LocalDate dateOfBirth;
    private LocalDateTime createdAt;
    private boolean active;
}