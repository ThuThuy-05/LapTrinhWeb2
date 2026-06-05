package com.booking.backend.service;

import com.booking.backend.dto.ContactRequest;
import com.booking.backend.dto.ContactResponse;

public interface ContactService {
    ContactResponse create(ContactRequest request);
}