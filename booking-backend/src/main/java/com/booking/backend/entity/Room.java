package com.booking.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // TÊN PHÒNG
    @Column(nullable = false, unique = true)
    private String name;

    // VỊ TRÍ
    private String location;

    // CHI NHÁNH
    @ManyToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;

    // ACTIVE
    private Boolean active = true;
}