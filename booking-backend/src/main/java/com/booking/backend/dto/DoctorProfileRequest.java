package com.booking.backend.dto;

import com.booking.backend.enums.Gender;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DoctorProfileRequest {

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private Gender gender;

    private LocalDate dateOfBirth;

    private String address;

    // thông tin nghề nghiệp
    private String degree;

    private Integer experience;

    private String description;

    // avatar cloudinary
    private String avatar;
}