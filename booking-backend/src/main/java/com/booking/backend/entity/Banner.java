package com.booking.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "banners")
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // tiêu đề banner
    @Column(nullable = false)
    private String title;

    // mô tả banner
    @Column(columnDefinition = "TEXT")
    private String description;

    // link ảnh banner
    private String imageUrl;

    // active / hidden
    private Boolean active = true;

    // ngày tạo
    private LocalDateTime createdAt = LocalDateTime.now();
}