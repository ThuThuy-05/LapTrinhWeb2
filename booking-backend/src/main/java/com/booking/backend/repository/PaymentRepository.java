package com.booking.backend.repository;

import com.booking.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Payment findByTransactionNo(String transactionNo);

    Optional<Payment> findByBookingId(Long bookingId);

    
}