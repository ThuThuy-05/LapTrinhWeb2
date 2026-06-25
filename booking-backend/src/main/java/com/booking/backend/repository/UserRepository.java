package com.booking.backend.repository;

import com.booking.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import com.booking.backend.enums.Role;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    boolean existsByEmailAndIdNot(String email, Long id);

    boolean existsByPhoneAndIdNot(String phone, Long id);

    long countByRole(Role role);

}