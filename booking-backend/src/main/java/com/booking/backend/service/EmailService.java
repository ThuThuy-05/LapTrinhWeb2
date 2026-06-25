package com.booking.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

        @Autowired
        private JavaMailSender mailSender;

        // =========================
        // GỬI MAIL ĐẶT LỊCH THÀNH CÔNG - HTML
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

                try {
                        MimeMessage message = mailSender.createMimeMessage();
                        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                        helper.setTo(toEmail);
                        helper.setSubject("🎉 ĐẶT LỊCH KHÁM THÀNH CÔNG - 3T Hospital");

                        // Format ngày
                        String formattedDate = LocalDate.parse(date)
                                        .format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));

                        // Format giờ
                        String formattedTime = time.substring(0, 5);

                        // Tạo nội dung HTML
                        String htmlContent = buildBookingSuccessHtml(
                                        patientName, doctorName, specialty, room,
                                        formattedDate, formattedTime, bookingCode);

                        helper.setText(htmlContent, true);

                        mailSender.send(message);
                        System.out.println("📧 Đã gửi email thành công tới: " + toEmail);

                } catch (Exception e) {
                        System.err.println("❌ Lỗi gửi email: " + e.getMessage());
                        e.printStackTrace();
                }
        }

        // =========================
        // XÂY DỰNG HTML CONTENT
        // =========================
        private String buildBookingSuccessHtml(
                        String patientName,
                        String doctorName,
                        String specialty,
                        String room,
                        String date,
                        String time,
                        String bookingCode) {

                return """
                                <!DOCTYPE html>
                                <html lang="vi">
                                <head>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <title>Xác nhận đặt lịch</title>
                                    <style>
                                        * { margin: 0; padding: 0; box-sizing: border-box; }
                                        body {
                                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                                            background: #f0f9ff;
                                            padding: 20px;
                                            line-height: 1.6;
                                        }
                                        .container {
                                            max-width: 600px;
                                            margin: 0 auto;
                                            background: #ffffff;
                                            border-radius: 20px;
                                            overflow: hidden;
                                            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
                                        }
                                        .header {
                                            background: linear-gradient(135deg, #1e3a8a 0%, #0d9488 100%);
                                            padding: 40px 30px 30px;
                                            text-align: center;
                                            position: relative;
                                        }
                                        .header::after {
                                            content: '';
                                            position: absolute;
                                            bottom: 0;
                                            left: 0;
                                            right: 0;
                                            height: 4px;
                                            background: linear-gradient(90deg, #14b8a6, #0ea5e9, #14b8a6);
                                        }
                                        .header .hospital-name {
                                            font-size: 28px;
                                            font-weight: 700;
                                            color: #ffffff;
                                            letter-spacing: 0.5px;
                                        }
                                        .header .hospital-name span { color: #5eead4; }
                                        .header .sub-title {
                                            color: rgba(255,255,255,0.8);
                                            font-size: 14px;
                                            margin-top: 4px;
                                        }
                                        .header .badge {
                                            display: inline-block;
                                            margin-top: 12px;
                                            padding: 6px 20px;
                                            background: rgba(255,255,255,0.2);
                                            backdrop-filter: blur(4px);
                                            border-radius: 50px;
                                            color: #ffffff;
                                            font-size: 14px;
                                            font-weight: 600;
                                        }
                                        .content { padding: 35px 30px 25px; }
                                        .greeting {
                                            font-size: 22px;
                                            font-weight: 600;
                                            color: #1e293b;
                                            margin-bottom: 6px;
                                        }
                                        .greeting span { color: #0d9488; }
                                        .greeting-sub {
                                            color: #64748b;
                                            font-size: 14px;
                                            margin-bottom: 25px;
                                        }
                                        .divider {
                                            border: none;
                                            height: 2px;
                                            background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
                                            margin: 20px 0;
                                        }
                                        .info-grid {
                                            display: grid;
                                            grid-template-columns: 1fr 1fr;
                                            gap: 12px;
                                            margin: 20px 0;
                                        }
                                        .info-item {
                                            background: #f8fafc;
                                            border-radius: 12px;
                                            padding: 14px 16px;
                                            border: 1px solid #f1f5f9;
                                        }
                                        .info-item .label {
                                            font-size: 11px;
                                            font-weight: 600;
                                            color: #94a3b8;
                                            text-transform: uppercase;
                                            letter-spacing: 0.5px;
                                        }
                                        .info-item .value {
                                            font-size: 15px;
                                            font-weight: 600;
                                            color: #1e293b;
                                            margin-top: 3px;
                                        }
                                        .info-item .value .highlight { color: #0d9488; }
                                        .info-item.full { grid-column: 1 / -1; }
                                        .booking-code {
                                            background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
                                            border: 2px dashed #0d9488;
                                            border-radius: 12px;
                                            padding: 16px;
                                            text-align: center;
                                            margin: 20px 0;
                                        }
                                        .booking-code .code-label {
                                            font-size: 12px;
                                            color: #64748b;
                                        }
                                        .booking-code .code-value {
                                            font-size: 24px;
                                            font-weight: 700;
                                            color: #0d9488;
                                            font-family: 'Courier New', monospace;
                                            letter-spacing: 2px;
                                            margin-top: 2px;
                                        }
                                        .notice {
                                            background: #fefce8;
                                            border-left: 4px solid #f59e0b;
                                            border-radius: 8px;
                                            padding: 14px 16px;
                                            margin: 20px 0;
                                        }
                                        .notice .title {
                                            font-weight: 600;
                                            color: #92400e;
                                            font-size: 14px;
                                        }
                                        .notice ul {
                                            list-style: none;
                                            padding: 0;
                                            margin-top: 6px;
                                        }
                                        .notice ul li {
                                            padding: 3px 0;
                                            color: #78350f;
                                            font-size: 13px;
                                            display: flex;
                                            align-items: center;
                                            gap: 8px;
                                        }
                                        .notice ul li::before {
                                            content: '•';
                                            color: #f59e0b;
                                            font-weight: 700;
                                        }
                                        .divider-light {
                                            border: none;
                                            border-top: 1px solid #f1f5f9;
                                            margin: 20px 0;
                                        }
                                        .support-text {
                                            text-align: center;
                                            color: #64748b;
                                            font-size: 13px;
                                            margin: 15px 0 10px;
                                        }
                                        .support-text strong { color: #0d9488; }
                                        .footer {
                                            background: #f8fafc;
                                            padding: 20px 30px;
                                            text-align: center;
                                        }
                                        .footer p {
                                            color: #94a3b8;
                                            font-size: 12px;
                                            margin: 3px 0;
                                        }
                                        .footer .social-icons {
                                            margin: 8px 0;
                                            display: flex;
                                            justify-content: center;
                                            gap: 12px;
                                        }
                                        .footer .social-icons a {
                                            display: inline-block;
                                            width: 32px;
                                            height: 32px;
                                            border-radius: 50%;
                                            background: #e2e8f0;
                                            text-align: center;
                                            line-height: 32px;
                                            color: #475569;
                                            text-decoration: none;
                                            font-size: 14px;
                                            transition: background 0.2s;
                                        }
                                        .footer .social-icons a:hover {
                                            background: #0d9488;
                                            color: #ffffff;
                                        }
                                        @media (max-width: 480px) {
                                            .info-grid { grid-template-columns: 1fr; }
                                            .info-item.full { grid-column: 1; }
                                            .header .hospital-name { font-size: 22px; }
                                            .content { padding: 25px 18px 20px; }
                                        }
                                    </style>
                                </head>
                                <body>
                                    <div class="container">
                                        <!-- Header -->
                                        <div class="header">
                                            <div class="hospital-name">3T <span>Hospital</span></div>
                                            <div class="sub-title">Hệ thống y tế hàng đầu Việt Nam</div>
                                            <div class="badge">✅ Xác nhận đặt lịch</div>
                                        </div>

                                        <!-- Content -->
                                        <div class="content">
                                            <div class="greeting">Xin chào <span>"""
                                + patientName
                                + """
                                                </span> 👋</div>
                                                                <div class="greeting-sub">Bạn đã đặt lịch khám thành công tại 3T Hospital</div>

                                                                <hr class="divider">

                                                                <!-- Booking Code -->
                                                                <div class="booking-code">
                                                                    <div class="code-label">📋 MÃ ĐẶT LỊCH</div>
                                                                    <div class="code-value">"""
                                + bookingCode + """
                                                </div>
                                                                </div>

                                                                <!-- Info Grid -->
                                                                <div class="info-grid">
                                                                    <div class="info-item">
                                                                        <div class="label">👨‍⚕️ Bác sĩ</div>
                                                                        <div class="value">"""
                                + doctorName + """
                                                </div>
                                                                    </div>
                                                                    <div class="info-item">
                                                                        <div class="label">🩺 Chuyên khoa</div>
                                                                        <div class="value">"""
                                + specialty + """
                                                </div>
                                                                    </div>
                                                                    <div class="info-item">
                                                                        <div class="label">📅 Ngày khám</div>
                                                                        <div class="value">"""
                                + date + """
                                                </div>
                                                                    </div>
                                                                    <div class="info-item">
                                                                        <div class="label">🕐 Giờ khám</div>
                                                                        <div class="value"><span class="highlight">"""
                                + time + """
                                                </span></div>
                                                                    </div>
                                                                    <div class="info-item full">
                                                                        <div class="label">🏥 Phòng khám</div>
                                                                        <div class="value">"""
                                + room
                                + """
                                                </div>
                                                                    </div>
                                                                </div>

                                                                <hr class="divider-light">

                                                                <!-- Notice -->
                                                                <div class="notice">
                                                                    <div class="title">📌 Lưu ý quan trọng</div>
                                                                    <ul>
                                                                        <li>Vui lòng đến trước <strong>15 phút</strong> để làm thủ tục</li>
                                                                        <li>Mang theo <strong>CMND/CCCD</strong> và <strong>BHYT</strong> (nếu có)</li>
                                                                        <li>Mang theo sổ khám bệnh cũ (nếu có)</li>
                                                                        <li>Nếu cần hỗ trợ, vui lòng liên hệ hotline</li>
                                                                    </ul>
                                                                </div>

                                                                <div class="support-text">
                                                                    💬 Cần hỗ trợ? Liên hệ <strong>1900 1234</strong> hoặc
                                                                    <a href="mailto:support@3thospital.vn" style="color: #0d9488; text-decoration: none;">
                                                                        support@3thospital.vn
                                                                    </a>
                                                                </div>
                                                            </div>

                                                            <!-- Footer -->
                                                            <div class="footer">
                                                                <p>📧 Email này được gửi tự động từ hệ thống 3T Hospital</p>
                                                                <p>© 2024 3T Hospital - Tất cả quyền được bảo lưu</p>
                                                            </div>
                                                        </div>
                                                    </body>
                                                    </html>
                                                    """;
        }
}