package com.booking.backend.service;

import com.booking.backend.entity.Message;
import java.util.List;

public interface MessageService {
    List<Message> getMessages(Long contactId);
    Message saveMessage(Long contactId, String sender, String content);
}