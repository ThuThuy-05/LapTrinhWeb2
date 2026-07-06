package com.booking.backend.entity;

import com.booking.backend.enums.Gender;
import com.booking.backend.enums.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =====================
    // BASIC INFO
    // =====================

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true, length = 15)
    private String phone;

    @Column(unique = true)
    private String email;

    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private String avatar;

    // 🔥 THÊM TRƯỜNG ĐỊA CHỈ VÀO ĐÂY (Để kiểu String cho khách tự nhập text tự do)
    @Column(length = 255)
    private String address;

    // =====================
    // ROLE + STATUS
    // =====================

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.PATIENT;

    @Column(nullable = false)
    private boolean active = true;

    // =====================
    // TIME
    // =====================

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // =====================
    // RELATION
    // =====================

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<Booking> bookings;

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<Review> reviews;

    // =====================
    // AUTO CREATE/UPDATE
    // =====================

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (avatar == null || avatar.isEmpty()) {
            avatar = "/uploads/default-avatar.png";
        }

        active = true;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // =====================
    // GETTER SETTER
    // =====================

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    // 🔥 THÊM GETTER/SETTER CHO TRƯỜNG ADDRESS
    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    // =====================
    // FULL NAME HELPER
    // =====================
    public String getFullName() {
        return (firstName != null ? firstName : "") + " " +
                (lastName != null ? lastName : "");
    }
}