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

        // tìm bác sĩ theo ngày
        List<Schedule> findByDate(LocalDate date);

        List<Schedule> findByDateAndStatus(
                        LocalDate date,
                        ScheduleStatus status);

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

        // =========================
        // METHOD LẤY LỊCH TRỐNG CHO CHATBOT
        // =========================

        // 1. Lấy tất cả lịch của bác sĩ từ hôm nay trở đi
        @Query("SELECT s FROM Schedule s " +
                        "LEFT JOIN FETCH s.doctor d " +
                        "LEFT JOIN FETCH d.user " +
                        "WHERE s.doctor.id = :doctorId " +
                        "AND s.date >= :fromDate " +
                        "AND s.status = 'AVAILABLE' " +
                        "ORDER BY s.date ASC, s.timeStart ASC")
        List<Schedule> findAvailableSchedulesByDoctor(
                        @Param("doctorId") Long doctorId,
                        @Param("fromDate") LocalDate fromDate);

        // 2. Lấy lịch theo ngày cụ thể
        @Query("SELECT s FROM Schedule s " +
                        "LEFT JOIN FETCH s.doctor d " +
                        "LEFT JOIN FETCH d.user " +
                        "WHERE s.doctor.id = :doctorId " +
                        "AND s.date = :date " +
                        "AND s.status = 'AVAILABLE' " +
                        "ORDER BY s.timeStart ASC")
        List<Schedule> findAvailableSchedulesByDoctorAndDate(
                        @Param("doctorId") Long doctorId,
                        @Param("date") LocalDate date);

        // 3. Đếm số lịch của bác sĩ
        @Query("SELECT COUNT(s) FROM Schedule s " +
                        "WHERE s.doctor.id = :doctorId " +
                        "AND s.date >= :fromDate " +
                        "AND s.status = 'AVAILABLE'")
        long countAvailableSchedulesByDoctor(
                        @Param("doctorId") Long doctorId,
                        @Param("fromDate") LocalDate fromDate);

        // 4. Lấy lịch sắp tới
        @Query("SELECT s FROM Schedule s " +
                        "LEFT JOIN FETCH s.doctor d " +
                        "LEFT JOIN FETCH d.user " +
                        "WHERE s.doctor.id = :doctorId " +
                        "AND s.date >= :fromDate " +
                        "AND s.status = 'ACTIVE' " +
                        "ORDER BY s.date ASC, s.timeStart ASC")
        List<Schedule> findUpcomingSchedules(
                        @Param("doctorId") Long doctorId,
                        @Param("fromDate") LocalDate fromDate);

        // 5. Lấy tất cả lịch theo ngày
        @Query("SELECT s FROM Schedule s " +
                        "LEFT JOIN FETCH s.doctor d " +
                        "LEFT JOIN FETCH d.user " +
                        "WHERE s.date = :date " +
                        "AND s.status = 'AVAILABLE'")
        List<Schedule> findSchedulesByDateWithDetails(@Param("date") LocalDate date);

        // Lấy tất cả schedule kèm thông tin chi tiết
        @Query("SELECT s FROM Schedule s " +
                        "LEFT JOIN FETCH s.doctor d " +
                        "LEFT JOIN FETCH d.user " +
                        "LEFT JOIN FETCH d.specialty " +
                        "LEFT JOIN FETCH d.branch " +
                        "LEFT JOIN FETCH s.room r " +
                        "ORDER BY s.date DESC, s.timeStart ASC")
        List<Schedule> findAllWithDetails();
}