package com.booking.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "branches")
public class Branch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // TÊN CHI NHÁNH
    @Column(nullable = false)
    private String name;

    // ĐỊA CHỈ CHI NHÁNH
    @Column(nullable = false, length = 500)
    private String address;

    // ACTIVE
    private Boolean active = true;
}