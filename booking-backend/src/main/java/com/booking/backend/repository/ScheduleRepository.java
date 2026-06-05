// package com.booking.backend.repository;

// import com.booking.backend.entity.Schedule;
// import com.booking.backend.enums.ScheduleStatus;

// import org.springframework.data.jpa.repository.JpaRepository;

// import java.time.LocalDate;
// import java.time.LocalTime;
// import java.util.List;

// public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
//     List<Schedule> findByDoctor_Id(Long doctorId);

//     List<Schedule> findByStatus(ScheduleStatus status);

//     List<Schedule> findByDoctor_IdAndStatus(Long doctorId, ScheduleStatus status);

//     List<Schedule> findByDate(LocalDate date);

//     boolean existsByDoctor_IdAndDateAndTimeStart(
//             Long doctorId,
//             LocalDate date,
//             LocalTime timeStart);
// }

// ScheduleRepository.java - Thêm các method mới

// ScheduleRepository.java

package com.booking.backend.repository;

import com.booking.backend.entity.Schedule;
import com.booking.backend.enums.ScheduleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    // Các method hiện có
    List<Schedule> findByDoctor_Id(Long doctorId);

    List<Schedule> findByStatus(ScheduleStatus status);

    List<Schedule> findByDoctor_IdAndStatus(Long doctorId, ScheduleStatus status);

    // ✅ SỬA: Dùng LocalDate và LocalTime
    boolean existsByDoctor_IdAndDateAndTimeStart(Long doctorId, LocalDate date, LocalTime timeStart);

    // ✅ SỬA: Check trùng khi update (trừ chính nó) - Dùng LocalDate và LocalTime
    @Query("SELECT COUNT(s) > 0 FROM Schedule s " +
            "WHERE s.doctor.id = :doctorId " +
            "AND s.date = :date " +
            "AND s.timeStart = :timeStart " +
            "AND s.id != :id")
    boolean existsByDoctor_IdAndDateAndTimeStartAndIdNot(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date,
            @Param("timeStart") LocalTime timeStart,
            @Param("id") Long id);

    // ✅ SỬA: Check overlapping time - Dùng LocalTime
    @Query("SELECT COUNT(s) > 0 FROM Schedule s " +
            "WHERE s.doctor.id = :doctorId " +
            "AND s.date = :date " +
            "AND s.timeStart < :timeEnd " +
            "AND s.timeEnd > :timeStart")
    boolean existsByDoctor_IdAndDateAndTimeStartLessThanEqualAndTimeEndGreaterThanEqual(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date,
            @Param("timeEnd") LocalTime timeEnd,
            @Param("timeStart") LocalTime timeStart);

    // Lấy tất cả schedule kèm thông tin chi tiết
    @Query("SELECT s FROM Schedule s " +
            "LEFT JOIN FETCH s.doctor d " +
            "LEFT JOIN FETCH d.user " +
            "LEFT JOIN FETCH d.specialty " +
            "LEFT JOIN FETCH d.branch " +
            "LEFT JOIN FETCH s.room r " +
            "ORDER BY s.date DESC, s.timeStart ASC")
    List<Schedule> findAllWithDetails();

    // Lấy schedule theo date range
    @Query("SELECT s FROM Schedule s " +
            "LEFT JOIN FETCH s.doctor d " +
            "LEFT JOIN FETCH d.user " +
            "LEFT JOIN FETCH s.room r " +
            "WHERE s.date BETWEEN :startDate AND :endDate " +
            "ORDER BY s.date DESC, s.timeStart ASC")
    List<Schedule> findByDateBetween(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    // Lấy schedule theo doctor và date
    List<Schedule> findByDoctor_IdAndDate(Long doctorId, LocalDate date);
}