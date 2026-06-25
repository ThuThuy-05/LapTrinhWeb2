package com.booking.backend.service;

import com.booking.backend.entity.Notification;

import java.util.List;

public interface NotificationService {

    Notification create(
            Long userId,
            String content,
            Long contactId);

    List<Notification> getByUser(Long userId);

    Notification markAsRead(Long id);
}