package com.booking.backend.repository;

import com.booking.backend.entity.Booking;
import com.booking.backend.enums.BookingStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends JpaRepository<Booking, Long> {

        boolean existsByScheduleId(Long scheduleId);

        List<Booking> findByUserId(Long userId);

        boolean existsByUser_IdAndSchedule_Doctor_IdAndStatus(
                        Long userId,
                        Long doctorId,
                        BookingStatus status);

        List<Booking> findBySchedule_Doctor_Id(Long doctorId);

        List<Booking> findByStatus(BookingStatus status);

        List<Booking> findByUser_IdOrderByBookingDateDesc(Long userId);

        long countByBookingDate(LocalDate bookingDate);

        // long countByBookingDate(LocalDate date);

        // 1. Tìm booking theo QR Code
        Optional<Booking> findByQrCode(String qrCode);

        // =========================
        // METHOD ĐẾM BOOKING - QUAN TRỌNG
        // =========================

        // Lấy booking sắp tới của user
        @Query("SELECT b FROM Booking b " +
                        "LEFT JOIN FETCH b.schedule s " +
                        "LEFT JOIN FETCH s.doctor d " +
                        "LEFT JOIN FETCH d.user " +
                        "WHERE b.user.id = :userId " +
                        "AND b.bookingDate >= :fromDate " +
                        "AND b.status IN ('pending', 'confirmed') " +
                        "ORDER BY b.bookingDate ASC, s.timeStart ASC")
        List<Booking> findUpcomingBookings(@Param("userId") Long userId,
                        @Param("fromDate") LocalDate fromDate);

        // Lấy booking chi tiết theo ID
        @Query("SELECT b FROM Booking b " +
                        "LEFT JOIN FETCH b.user " +
                        "LEFT JOIN FETCH b.schedule s " +
                        "LEFT JOIN FETCH s.doctor d " +
                        "LEFT JOIN FETCH d.user " +
                        "WHERE b.id = :id")
        Optional<Booking> findBookingWithDetails(@Param("id") Long id);

        // Đếm booking đang chờ
        @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = 'pending'")
        long countPendingBookings();
}