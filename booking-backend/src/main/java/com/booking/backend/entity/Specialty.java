package com.booking.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "specialties")
public class Specialty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================
    // BASIC INFO
    // =========================
    @Column(nullable = false, unique = true, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    // =========================
    // PRICE
    // =========================
    @Column(nullable = false)
    private Integer price = 0;

    // =========================
    // IMAGE
    // =========================
    private String image;

    // =========================
    // STATUS
    // =========================
    @Column(nullable = false)
    private Boolean active = true;

    // =========================
    // RELATIONSHIP
    // =========================
    @OneToMany(mappedBy = "specialty")
    @JsonIgnore
    private List<Doctor> doctors;

    // =========================
    // TIME
    // =========================
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // =========================
    // AUTO CREATE
    // =========================
    @PrePersist
    public void prePersist() {

        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();

        if (this.active == null) {
            this.active = true;
        }

        if (this.price == null) {
            this.price = 0;
        }
    }

    // =========================
    // AUTO UPDATE
    // =========================
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}