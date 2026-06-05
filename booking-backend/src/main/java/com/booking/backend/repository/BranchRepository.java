// ===============================
// BranchRepository.java
// ===============================

package com.booking.backend.repository;

import com.booking.backend.entity.Branch;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BranchRepository
        extends JpaRepository<Branch, Long> {

    boolean existsByName(String name);

    Optional<Branch> findByName(String name);

}