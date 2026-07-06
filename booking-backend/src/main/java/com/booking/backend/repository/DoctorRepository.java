package com.booking.backend.repository;

import com.booking.backend.entity.Doctor;
import com.booking.backend.entity.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

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

        Optional<Doctor> findByUser_Id(Long userId);

        Optional<Doctor> findByUser_Phone(String phone);

        List<Doctor> findByBranch_IdAndSpecialty_Id(
                        Long branchId,
                        Long specialtyId);

        List<Doctor> findByBranch_Id(Long branchId);

        List<Doctor> findBySpecialty_Id(Long specialtyId);

        // Tìm bác sĩ theo tên (search)
        @Query("SELECT d FROM Doctor d JOIN d.user u " +
                        "WHERE LOWER(CONCAT(u.lastName, ' ', u.firstName)) LIKE LOWER(CONCAT('%', :keyword, '%'))")
        List<Doctor> searchDoctor(@Param("keyword") String keyword);

        // Tìm bác sĩ theo tên (không phân biệt hoa thường)
        @Query("SELECT d FROM Doctor d JOIN d.user u " +
                        "WHERE LOWER(u.firstName) LIKE LOWER(CONCAT('%', :name, '%')) " +
                        "OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :name, '%'))")
        List<Doctor> findByNameIgnoreCase(@Param("name") String name);

        // Lấy bác sĩ theo chuyên khoa (có fetch join user)
        @Query("SELECT d FROM Doctor d " +
                        "LEFT JOIN FETCH d.user " +
                        "LEFT JOIN FETCH d.specialty " +
                        "WHERE d.specialty.id = :specialtyId")
        List<Doctor> findDoctorsBySpecialtyWithDetails(@Param("specialtyId") Long specialtyId);
        // ==========================================
        // METHOD BỔ SUNG CHO CHATBOT TRA CỨU LINH HOẠT
        // ==========================================

        // Tìm danh sách bác sĩ dựa theo tên chuyên khoa (Ví dụ: "Mắt", "Tai Mũi Họng")
        @Query("SELECT d FROM Doctor d JOIN d.user u JOIN d.specialty s " +
                        "WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :specialtyName, '%'))")
        List<Doctor> findBySpecialtyNameContainingIgnoreCase(@Param("specialtyName") String specialtyName);

        // Tìm kiếm tổng hợp: Khớp cả tên bác sĩ HOẶC tên chuyên khoa
        @Query("SELECT d FROM Doctor d JOIN d.user u LEFT JOIN d.specialty s " +
                        "WHERE LOWER(CONCAT(u.lastName, ' ', u.firstName)) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                        "OR LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
        List<Doctor> searchDoctorByTextOrSpecialty(@Param("keyword") String keyword);

        // Lấy danh sách các bác sĩ thực sự có lịch khám ACTIVE từ ngày hiện tại trở đi
        @Query("SELECT DISTINCT d FROM Doctor d " +
                        "JOIN Schedule s ON s.doctor.id = d.id " +
                        "WHERE s.date >= :currentDate AND s.status = 'ACTIVE'")
        List<Doctor> findDoctorsWithUpcomingSchedules(@Param("currentDate") java.time.LocalDate currentDate);
}