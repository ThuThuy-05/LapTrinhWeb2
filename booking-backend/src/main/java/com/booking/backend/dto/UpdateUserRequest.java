package com.booking.backend.dto;

import com.booking.backend.enums.Gender;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateUserRequest {

    private String firstName;
    private String lastName;
    private String email;

    private LocalDate dateOfBirth;
    private String address;
    private Gender gender;
}