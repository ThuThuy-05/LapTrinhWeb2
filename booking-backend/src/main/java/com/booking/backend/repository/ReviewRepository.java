package com.booking.backend.repository;

import com.booking.backend.entity.Review;
import com.booking.backend.enums.BookingStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByDoctorId(Long doctorId);

    List<Review> findByUserId(Long userId);

    boolean existsByUser_IdAndDoctor_Id(Long userId, Long doctorId);

    List<Review> findByDoctorIdAndIsHiddenFalse(Long doctorId);

    List<Review> findTop5ByOrderByCreatedAtDesc();

    // =========================
    // BỔ SUNG METHOD CHO CHATBOT
    // =========================

    // 1. Lấy đánh giá theo bác sĩ
    @Query("SELECT r FROM Review r " +
            "LEFT JOIN FETCH r.user " +
            "WHERE r.doctor.id = :doctorId " +
            "ORDER BY r.createdAt DESC")
    List<Review> findRecentReviewsByDoctor(@Param("doctorId") Long doctorId);

    // 2. Tính rating trung bình của bác sĩ
    @Query("SELECT AVG(r.rating) FROM Review r " +
            "WHERE r.doctor.id = :doctorId")
    Double getAverageRatingByDoctorId(@Param("doctorId") Long doctorId);

    // 3. Lấy bác sĩ được đánh giá cao nhất
    @Query("""
            SELECT r.doctor, AVG(r.rating)
            FROM Review r
            GROUP BY r.doctor
            ORDER BY AVG(r.rating) DESC
            """)
    List<Object[]> findTopRatedDoctors();

    // 4. Lấy đánh giá theo rating
    @Query("SELECT r FROM Review r " +
            "WHERE r.rating >= :minRating " +
            "ORDER BY r.rating DESC, r.createdAt DESC")
    List<Review> findByMinRating(@Param("minRating") Integer minRating);
}
