package com.booking.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 👉 Người đánh giá
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 👉 Bác sĩ được đánh giá
    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    // 👉 Số sao (1-5)
    @Column(nullable = false)
    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "is_hidden")
    private Boolean isHidden = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // 👉 Auto set thời gian
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}