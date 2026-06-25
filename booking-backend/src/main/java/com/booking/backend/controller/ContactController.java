package com.booking.backend.controller;

import com.booking.backend.dto.ContactRequest;
import com.booking.backend.dto.ContactResponse;
import com.booking.backend.dto.ReplyRequest;
import com.booking.backend.entity.Contact;
import com.booking.backend.service.ContactService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin("*")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    // Patient gửi liên hệ
    @PostMapping
    public ContactResponse create(
            @RequestBody ContactRequest request) {

        return contactService.create(request);
    }

    // Admin xem danh sách
    @GetMapping
    public List<Contact> getAll() {
        return contactService.getAll();
    }

    // Admin xem chi tiết
    @GetMapping("/{id}")
    public Contact getById(
            @PathVariable Long id) {

        return contactService.getById(id);
    }

    // Admin phản hồi
    @PostMapping("/{id}/reply")
    public Contact reply(
            @PathVariable Long id,
            @RequestBody ReplyRequest request) {

        return contactService.reply(
                id,
                request.getReply());
    }
}