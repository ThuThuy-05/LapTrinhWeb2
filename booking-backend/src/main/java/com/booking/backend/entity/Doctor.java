package com.booking.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // USER
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // CHUYÊN KHOA
    @ManyToOne
    @JoinColumn(name = "specialty_id", nullable = false)
    private Specialty specialty;

    // CHI NHÁNH
    @ManyToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;

    // HỌC VỊ
    private String degree;

    // KINH NGHIỆM
    @Column(nullable = false)
    private Integer experience;

    // MÔ TẢ
    @Column(columnDefinition = "TEXT")
    private String description;

    
}