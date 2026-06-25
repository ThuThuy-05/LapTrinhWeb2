package com.booking.backend.controller;

import com.booking.backend.dto.MessageRequest;
import com.booking.backend.entity.Message;
import com.booking.backend.service.MessageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin("*")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/{contactId}")
    public List<Message> getMessages(
            @PathVariable Long contactId) {

        return messageService.getMessages(contactId);
    }

    @PostMapping("/{contactId}")
    public Message sendMessage(
            @PathVariable Long contactId,
            @RequestBody MessageRequest request) {

        return messageService.saveMessage(
                contactId,
                request.getSender(),
                request.getContent());
    }
}