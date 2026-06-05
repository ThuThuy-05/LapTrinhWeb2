package com.booking.backend.service.impl;

import com.booking.backend.dto.ContactRequest;
import com.booking.backend.dto.ContactResponse;
import com.booking.backend.entity.Contact;
import com.booking.backend.repository.ContactRepository;
import com.booking.backend.service.ContactService;
import com.booking.backend.utils.WorkingTimeUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;

    public ContactServiceImpl(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Override
    public ContactResponse create(ContactRequest request) {
        // 1. Tìm hội thoại đang mở
        Contact existingContact = contactRepository.findFirstByPhoneAndStatusNotOrderByCreatedAtDesc(
                request.getPhone(), "DONE");

        Contact contact;
        boolean isWorking = WorkingTimeUtil.isWorkingTime(); // Kiểm tra giờ hiện tại

        if (existingContact != null) {
            // Cập nhật tin nhắn
            String updatedMessage = existingContact.getMessage() + "\n---" + request.getMessage();
            existingContact.setMessage(updatedMessage);

            // QUAN TRỌNG: Cập nhật lại status nếu giờ làm việc thay đổi
            // (Ví dụ: Từ ngoài giờ chuyển sang trong giờ)
            existingContact.setStatus(isWorking ? "LIVE" : "BOT");

            contact = contactRepository.save(existingContact);
        } else {
            // Tạo mới
            contact = new Contact();
            contact.setName(request.getName());
            contact.setEmail(request.getEmail());
            contact.setPhone(request.getPhone());
            contact.setSubject(request.getSubject());
            contact.setMessage(request.getMessage());
            contact.setCreatedAt(LocalDateTime.now());
            contact.setStatus(isWorking ? "LIVE" : "BOT");
            contact = contactRepository.save(contact);
        }

        ContactResponse response = new ContactResponse();
        response.setId(contact.getId());
        response.setStatus(contact.getStatus()); // Trả về status mới nhất
        response.setMessage("SUCCESS");
        return response;
    }
}