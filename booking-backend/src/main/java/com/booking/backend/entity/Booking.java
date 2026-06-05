package com.booking.backend.entity;

import com.booking.backend.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // USER ĐẶT
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // LỊCH KHÁM
    @ManyToOne
    @JoinColumn(name = "schedule_id")
    private Schedule schedule;

    // // THÔNG TIN BỆNH NHÂN
    // private String patientName;

    // private String patientPhone;

    // private Integer patientAge;

    // private String patientGender;

    // TRIỆU CHỨNG
    @Column(columnDefinition = "TEXT")
    private String symptom;

    // TRẠNG THÁI
    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;

    // NGÀY ĐẶT
    private LocalDate bookingDate = LocalDate.now();

    // QR
    private String qrCode;

    // ẢNH CCCD
    @Column(name = "citizen_card_image")
    private String citizenCardImage;
    private String cccdFrontImage;

    private String cccdBackImage;

    // CREATED
    private LocalDateTime createdAt = LocalDateTime.now();
}