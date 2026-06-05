package com.booking.backend.repository;

import com.booking.backend.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, Long> {
    // Tìm bản ghi gần nhất của số điện thoại đó mà status không phải là DONE
    Contact findFirstByPhoneAndStatusNotOrderByCreatedAtDesc(String phone, String status);
}