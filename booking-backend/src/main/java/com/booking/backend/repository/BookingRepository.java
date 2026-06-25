package com.booking.backend.repository;

import com.booking.backend.entity.Booking;
import com.booking.backend.enums.BookingStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

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

        Optional<Booking> findByQrCode(String qrCode);
}