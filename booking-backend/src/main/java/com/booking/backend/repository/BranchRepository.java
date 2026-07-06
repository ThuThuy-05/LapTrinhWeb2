package com.booking.backend.repository;

import com.booking.backend.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BranchRepository extends JpaRepository<Branch, Long> {

    boolean existsByName(String name);

    Optional<Branch> findByName(String name);

    List<Branch> findByActiveTrue();

    // Tìm chi nhánh theo địa chỉ (thành phố)
    @Query("""
                SELECT b
                FROM Branch b
                WHERE LOWER(b.address) LIKE LOWER(CONCAT('%', :city, '%'))
                  AND b.active = true
            """)
    List<Branch> findByCity(@Param("city") String city);

    // ==========================================
    // METHOD BỔ SUNG CHO CHATBOT TRA CỨU LINH HOẠT
    // ==========================================

    // Tìm kiếm chi nhánh theo tên HOẶC địa chỉ (Ví dụ người dùng gõ "Cơ sở 1" hoặc
    // "Quận 10")
    @Query("""
                SELECT b
                FROM Branch b
                WHERE b.active = true AND (
                    LOWER(b.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR LOWER(b.address) LIKE LOWER(CONCAT('%', :keyword, '%'))
                )
            """)
    List<Branch> searchBranchByKeyword(@Param("keyword") String keyword);
}