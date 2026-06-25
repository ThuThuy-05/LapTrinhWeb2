package com.booking.backend.service;

import com.booking.backend.dto.ContactRequest;
import com.booking.backend.dto.ContactResponse;
import com.booking.backend.entity.Contact;

import java.util.List;

public interface ContactService {

    ContactResponse create(ContactRequest request);

    List<Contact> getAll();

    Contact getById(Long id);

    Contact reply(Long id, String reply);
}