package com.booking.backend.dto;

import com.booking.backend.enums.Gender;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RegisterRequest {

    // 🔑 bắt buộc
    private String phone;
    private String password;

    // 👤 thông tin cá nhân
    private String firstName; // tên
    private String lastName; // họ + tên lót

    private String email;

    private LocalDate dateOfBirth;

    private Gender gender;

    private String avatar; // có thể null (update sau cũng được)
    private String address;
}