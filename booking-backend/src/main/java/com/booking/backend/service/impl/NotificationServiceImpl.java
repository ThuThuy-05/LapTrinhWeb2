package com.booking.backend.service.impl;

import com.booking.backend.entity.Notification;
import com.booking.backend.entity.User;
import com.booking.backend.repository.NotificationRepository;
import com.booking.backend.repository.UserRepository;
import com.booking.backend.service.NotificationService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationServiceImpl
        implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationServiceImpl(
            NotificationRepository notificationRepository,
            UserRepository userRepository) {

        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Notification create(
            Long userId,
            String content,
            Long contactId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification noti = new Notification();

        noti.setUser(user);
        noti.setContent(content);
        noti.setIsRead(false);

        // QUAN TRỌNG
        noti.setContactId(contactId);

        return notificationRepository.save(noti);
    }

    @Override
    public List<Notification> getByUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Override
    public Notification markAsRead(Long id) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow();

        notification.setIsRead(true);

        return notificationRepository.save(notification);
    }
}