package com.booking.backend.service.impl;

import com.booking.backend.entity.Message;
import com.booking.backend.repository.ContactRepository;
import com.booking.backend.repository.MessageRepository;
import com.booking.backend.service.MessageService;
import com.booking.backend.utils.WorkingTimeUtil;

import org.springframework.stereotype.Service;
import com.booking.backend.entity.Contact;
import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final ContactRepository contactRepository;

    public MessageServiceImpl(MessageRepository mr, ContactRepository cr) {
        this.messageRepository = mr;
        this.contactRepository = cr;
    }

    @Override
    public List<Message> getMessages(Long contactId) {
        return messageRepository.findByContactIdOrderByCreatedAtAsc(contactId);
    }

    @Override
    public Message saveMessage(Long contactId, String sender, String content) {

        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        boolean isWorking = WorkingTimeUtil.isWorkingTime();

        // 1. user message
        Message msg = new Message();
        msg.setContact(contact);
        msg.setSender(sender);
        msg.setContent(content);

        Message saved = messageRepository.save(msg);

        // 2. AUTO BOT nếu ngoài giờ
        if (!isWorking && sender.equals("USER")) {

            Message bot = new Message();
            bot.setContact(contact);
            bot.setSender("BOT");
            bot.setContent("Hiện tại ngoài giờ làm việc (7h - 21h). Chúng tôi sẽ phản hồi sớm!");

            messageRepository.save(bot);

            // cập nhật status luôn cho đồng bộ
            contact.setStatus("BOT");
            contactRepository.save(contact);
        } else {
            contact.setStatus("LIVE");
            contactRepository.save(contact);
        }

        return saved;
    }
}