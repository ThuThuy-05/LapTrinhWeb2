package com.booking.backend.service.impl;

import com.booking.backend.entity.Message;
import com.booking.backend.entity.Notification;
import com.booking.backend.repository.ContactRepository;
import com.booking.backend.repository.MessageRepository;
import com.booking.backend.repository.NotificationRepository;
import com.booking.backend.service.MessageService;
import com.booking.backend.utils.WorkingTimeUtil;

import org.springframework.stereotype.Service;
import com.booking.backend.entity.Contact;
import com.booking.backend.entity.User;
import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final ContactRepository contactRepository;
    private final NotificationRepository notificationRepository; // THÊM DÒNG NÀY

    // SỬA CONSTRUCTOR
    public MessageServiceImpl(MessageRepository mr, ContactRepository cr, NotificationRepository nr) {
        this.messageRepository = mr;
        this.contactRepository = cr;
        this.notificationRepository = nr; // THÊM DÒNG NÀY
    }

    @Override
    public List<Message> getMessages(Long contactId) {
        return messageRepository.findByContactIdOrderByCreatedAtAsc(contactId);
    }

    @Override
    public Message saveMessage(Long contactId,
            String sender,
            String content) {

        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        boolean isWorking = WorkingTimeUtil.isWorkingTime();

        // lưu tin nhắn user
        Message msg = new Message();
        msg.setContact(contact);
        msg.setSender(sender);
        msg.setContent(content);

        Message saved = messageRepository.save(msg);

        // =========================
        // THÊM: NẾU LÀ ADMIN GỬI -> TẠO NOTIFICATION CHO BỆNH NHÂN
        // =========================
        if ("ADMIN".equals(sender)) {
            User patient = contact.getUser(); // Lấy user (bệnh nhân) từ contact

            if (patient != null) {
                Notification notification = new Notification();
                notification.setUser(patient);
                notification.setContent("📢 Admin đã phản hồi yêu cầu \"" +
                        contact.getSubject() + "\" của bạn. Nhấn để xem chi tiết và trả lời.");
                notification.setIsRead(false);
                notification.setContactId(contactId);
                notificationRepository.save(notification);

                System.out.println("✅ Đã tạo notification cho user: " + patient.getId());

                // Cập nhật status contact thành DONE
                contact.setStatus("DONE");
                contactRepository.save(contact);
            } else {
                System.out.println("⚠️ Contact không có user (khách chưa đăng nhập?)");
            }
        }

        // =========================
        // NGOÀI GIỜ => BOT
        // =========================
        if (!isWorking && sender.equals("USER")) {

            Message bot = new Message();
            bot.setContact(contact);
            bot.setSender("BOT");

            String lower = content.toLowerCase();

            if (lower.contains("đặt lịch")) {
                bot.setContent("Bạn có thể đặt lịch tại trang Đặt lịch khám.");
            } else if (lower.contains("hủy")) {
                bot.setContent("Bạn có thể hủy lịch trước giờ khám ít nhất 2 tiếng.");
            } else if (lower.contains("da liễu")) {
                bot.setContent("Chuyên khoa Da liễu hiện có nhiều bác sĩ đang làm việc.");
            } else {
                bot.setContent(
                        "Hiện tại đã ngoài giờ hỗ trợ (08:00 - 20:00). "
                                + "Nhân viên sẽ phản hồi bạn vào ngày làm việc tiếp theo.");
            }

            messageRepository.save(bot);

            contact.setStatus("BOT");
            contactRepository.save(contact);
        }

        // =========================
        // TRONG GIỜ => NHÂN VIÊN
        // =========================
        if (isWorking && sender.equals("USER")) { // THÊM điều kiện sender.equals("USER")

            contact.setStatus("LIVE");
            contactRepository.save(contact);
        }

        return saved;
    }
}