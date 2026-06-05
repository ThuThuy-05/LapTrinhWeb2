package com.booking.backend.controller;

import com.booking.backend.dto.ContactRequest;
import com.booking.backend.dto.ContactResponse;
import com.booking.backend.service.ContactService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin("*")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ContactResponse create(@RequestBody ContactRequest request) {
        return contactService.create(request);
    }
}