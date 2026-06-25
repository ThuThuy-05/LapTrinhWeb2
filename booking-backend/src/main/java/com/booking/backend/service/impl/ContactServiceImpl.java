package com.booking.backend.service.impl;

import com.booking.backend.dto.ContactRequest;
import com.booking.backend.dto.ContactResponse;
import com.booking.backend.entity.Contact;
import com.booking.backend.repository.ContactRepository;
import com.booking.backend.service.ContactService;
import com.booking.backend.service.NotificationService;
import com.booking.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.booking.backend.entity.User;
import com.booking.backend.entity.Message;
import com.booking.backend.repository.MessageRepository;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;

    public ContactServiceImpl(
            ContactRepository contactRepository,
            NotificationService notificationService,
            UserRepository userRepository,
            MessageRepository messageRepository) {

        this.contactRepository = contactRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
    }

    @Override
    public ContactResponse create(ContactRequest request) {

        Contact contact = new Contact();

        contact.setName(request.getName());
        contact.setEmail(request.getEmail());
        contact.setPhone(request.getPhone());
        contact.setSubject(request.getSubject());
        contact.setMessage(request.getMessage());

        // GÁN USER
        if (request.getUserId() != null) {

            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            contact.setUser(user);
        }

        contact.setStatus("PENDING");
        contact.setCreatedAt(LocalDateTime.now());

        Contact saved = contactRepository.save(contact);
        Message firstMessage = new Message();

        firstMessage.setContact(saved);
        firstMessage.setSender("USER");
        firstMessage.setContent(request.getMessage());

        messageRepository.save(firstMessage);

        ContactResponse response = new ContactResponse();
        response.setId(saved.getId());
        response.setStatus(saved.getStatus());
        response.setMessage("SUCCESS");

        return response;
    }

    @Override
    public List<Contact> getAll() {
        return contactRepository.findAll();
    }

    @Override
    public Contact getById(Long id) {

        return contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
    }

    @Override
    public Contact reply(Long id, String reply) {

        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        contact.setAdminReply(reply);

        contact.setReplyAt(LocalDateTime.now());

        contact.setStatus("DONE");

        Contact saved = contactRepository.save(contact);

        Message adminMessage = new Message();

        adminMessage.setContact(saved);
        adminMessage.setSender("ADMIN");
        adminMessage.setContent(reply);

        messageRepository.save(adminMessage);

        // Tạo notification cho bệnh nhân
        if (saved.getUser() != null) {

            notificationService.create(
                    contact.getUser().getId(),
                    "Yêu cầu hỗ trợ của bạn đã được phản hồi",
                    contact.getId());
        }

        return saved;
    }
}