package com.booking.backend.controller;

import com.booking.backend.dto.MessageRequest;
import com.booking.backend.entity.Message;
import com.booking.backend.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin("*") // Đảm bảo FE gọi được API từ domain khác
public class ChatController {

    private final MessageService messageService;

    // Sử dụng Constructor Injection (chuẩn Spring Boot)
    public ChatController(MessageService messageService) {
        this.messageService = messageService;
    }

    // 1. Lấy lịch sử tin nhắn của một hội thoại
    @GetMapping("/{contactId}")
    public ResponseEntity<List<Message>> getHistory(@PathVariable Long contactId) {
        return ResponseEntity.ok(messageService.getMessages(contactId));
    }

    // 2. Gửi tin nhắn mới vào hội thoại
    @PostMapping("/{contactId}")
    public ResponseEntity<Message> send(
            @PathVariable Long contactId,
            @RequestBody MessageRequest request) {

        Message savedMessage = messageService.saveMessage(
                contactId,
                request.getSender(),
                request.getContent());

        return ResponseEntity.ok(savedMessage);
    }
}