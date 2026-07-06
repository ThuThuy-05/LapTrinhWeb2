package com.booking.backend.repository;

import com.booking.backend.entity.Specialty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SpecialtyRepository extends JpaRepository<Specialty, Long> {
    Optional<Specialty> findByName(String name);

    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, Long id);

    List<Specialty> findByNameContainingIgnoreCase(String keyword);

    // Lấy chuyên khoa có bác sĩ
    @Query("SELECT DISTINCT s FROM Specialty s JOIN s.doctors d")
    List<Specialty> findSpecialtiesWithActiveDoctors();

    // Lấy chuyên khoa có giá
    @Query("SELECT s FROM Specialty s WHERE s.price IS NOT NULL AND s.price > 0")
    List<Specialty> findSpecialtiesWithPrice();
}