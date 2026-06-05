package com.booking.backend.dto;

import com.booking.backend.enums.Gender;
import lombok.Data;

import java.time.LocalDate;

import org.springframework.web.multipart.MultipartFile;

@Data
public class DoctorRequest {

    // USER
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String password;

    private Gender gender;

    private LocalDate dateOfBirth;
    private String avatar;

    private Boolean active;

    private String address;
    // DOCTOR
    private Long specialtyId;

    private Long branchId;

    private String degree;

    private Integer experience;

    private String description;

    private MultipartFile file;

}