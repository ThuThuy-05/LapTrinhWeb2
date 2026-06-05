package com.booking.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "contacts")
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String message;

    // LIVE = có người trực, BOT = ngoài giờ, DONE = đã xử lý
    private String status;

    private LocalDateTime createdAt;

    // Thêm vào trong Contact.java
    @OneToMany(mappedBy = "contact", cascade = CascadeType.ALL)
    private List<Message> messages;
}