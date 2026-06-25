package com.booking.backend.repository;

import com.booking.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import com.booking.backend.entity.User;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByCreatedAtDesc(User user);
}