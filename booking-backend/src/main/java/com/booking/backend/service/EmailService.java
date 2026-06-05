package com.booking.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // =========================
    // GỬI MAIL ĐẶT LỊCH THÀNH CÔNG
    // =========================
    public void sendBookingSuccessMail(
            String toEmail,
            String patientName,
            String doctorName,
            String specialty,
            String room,
            String date,
            String time,
            String bookingCode) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject("ĐẶT LỊCH KHÁM THÀNH CÔNG");

        message.setText(
                "Xin chào " + patientName + ",\n\n"

                        + "🎉 Bạn đã đặt lịch khám thành công!\n\n"

                        + "===== THÔNG TIN LỊCH KHÁM =====\n"
                        + "Mã lịch khám: " + bookingCode + "\n"
                        + "Bác sĩ: " + doctorName + "\n"
                        + "Chuyên khoa: " + specialty + "\n"
                        + "Phòng khám: " + room + "\n"
                        + "Ngày khám: " + java.time.LocalDate.parse(date)
                                .format(java.time.format.DateTimeFormatter.ofPattern("dd-MM-yyyy"))
                        + "\n"
                        + "Giờ khám: " + time.substring(0, 5) + "\n\n"

                        + "⚠️ Vui lòng đến trước 15 phút.\n"
                        + "📍 Mang theo CMND/CCCD khi đi khám.\n\n"

                        + "Nếu cần hỗ trợ, vui lòng liên hệ hotline 1900 xxxx.\n\n"

                        + "Bệnh viện 3T Hospital xin cảm ơn và hẹn gặp lại!");
        mailSender.send(message);
    }
}