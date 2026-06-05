package com.booking.backend.repository;

import com.booking.backend.entity.Booking;
import com.booking.backend.enums.BookingStatus;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {

        boolean existsByScheduleId(Long scheduleId);

        List<Booking> findByUserId(Long userId);

        boolean existsByUser_IdAndSchedule_Doctor_IdAndStatus(
                        Long userId,
                        Long doctorId,
                        BookingStatus status);
}