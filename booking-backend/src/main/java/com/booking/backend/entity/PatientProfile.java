package com.booking.backend.entity;


import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "patient_profiles")
public class PatientProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 👉 Người tạo hồ sơ (user)
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String name;        // tên bệnh nhân
    private String phone;
    private String address;
    private String gender;

    private LocalDate dateOfBirth;

    private String identityNumber; // CMND/CCCD

    private String note; // ghi chú thêm
}