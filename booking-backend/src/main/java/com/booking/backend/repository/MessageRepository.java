package com.booking.backend.repository;

import com.booking.backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    // Lấy toàn bộ tin nhắn của một hội thoại theo thứ tự thời gian
    List<Message> findByContactIdOrderByCreatedAtAsc(Long contactId);
}