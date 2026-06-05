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
    private String name;

  
    // ACTIVE
    private Boolean active = true;
}