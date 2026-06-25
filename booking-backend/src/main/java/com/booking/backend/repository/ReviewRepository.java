package com.booking.backend.repository;

import com.booking.backend.entity.Review;
import com.booking.backend.enums.BookingStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByDoctorId(Long doctorId);

    List<Review> findByUserId(Long userId);

    boolean existsByUser_IdAndDoctor_Id(Long userId, Long doctorId);

    List<Review> findByDoctorIdAndIsHiddenFalse(Long doctorId);

    List<Review> findTop5ByOrderByCreatedAtDesc();
}
