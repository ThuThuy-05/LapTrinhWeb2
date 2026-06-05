package com.booking.backend.repository;

import com.booking.backend.entity.Doctor;
import com.booking.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    // =========================
    // CHECK USER ĐÃ LÀ BÁC SĨ CHƯA
    // =========================
    boolean existsByUser(User user);

    // =========================
    // CHECK THEO EMAIL (QUAN TRỌNG)
    // =========================
    boolean existsByUser_Email(String email);

    // =========================
    // CHECK THEO PHONE (OPTION)
    // =========================
    boolean existsByUser_Phone(String phone);
}