package com.booking.backend.repository;

import com.booking.backend.entity.Doctor;
import com.booking.backend.entity.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    @Query("""
            SELECT d FROM Doctor d
            JOIN d.user u
            WHERE LOWER(CONCAT(u.lastName, ' ', u.firstName))
                  LIKE LOWER(CONCAT('%', :keyword, '%'))
            """)
    List<Doctor> searchDoctor(@Param("keyword") String keyword);
}