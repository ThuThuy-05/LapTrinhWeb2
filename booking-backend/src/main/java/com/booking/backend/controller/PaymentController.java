package com.booking.backend.controller;

import com.booking.backend.config.VnPayConfig;
import com.booking.backend.dto.PaymentRequest;
import com.booking.backend.entity.Booking;
import com.booking.backend.entity.Payment;
import com.booking.backend.entity.Schedule;
import com.booking.backend.enums.BookingStatus;
import com.booking.backend.enums.ScheduleStatus;
import com.booking.backend.repository.BookingRepository;
import com.booking.backend.repository.PaymentRepository;
import com.booking.backend.repository.ScheduleRepository;
import com.booking.backend.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import com.booking.backend.enums.BookingStatus;
import com.booking.backend.service.EmailService;
import java.util.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin("*")
public class PaymentController {

        private final PaymentService paymentService;

        private final PaymentRepository paymentRepository;

        private final VnPayConfig vnPayConfig;

        private final BookingRepository bookingRepository;

        private final ScheduleRepository scheduleRepository;

        private final EmailService emailService;

        @PostMapping("/create")
        public Map<String, String> createPayment(
                        @RequestBody PaymentRequest request,
                        HttpServletRequest httpRequest) throws Exception {

                System.out.println("PAYMENT REQUEST: " + request);

                String ip = httpRequest.getRemoteAddr();

                String paymentUrl = paymentService.createPayment(
                                request,
                                ip);

                return Map.of(
                                "paymentUrl",
                                paymentUrl);
        }

        @GetMapping("/vnpay-return")
        public void paymentReturn(
                        @RequestParam Map<String, String> params,
                        HttpServletResponse response) throws Exception {

                String vnpSecureHash = params.get("vnp_SecureHash");

                params.remove("vnp_SecureHash");

                params.remove("vnp_SecureHashType");

                List<String> fieldNames = new ArrayList<>(params.keySet());

                Collections.sort(fieldNames);

                StringBuilder hashData = new StringBuilder();

                Iterator<String> itr = fieldNames.iterator();

                while (itr.hasNext()) {

                        String fieldName = itr.next();

                        String fieldValue = params.get(fieldName);

                        if (fieldValue != null
                                        && !fieldValue.isEmpty()) {

                                hashData.append(fieldName);

                                hashData.append('=');

                                hashData.append(
                                                URLEncoder.encode(
                                                                fieldValue,
                                                                StandardCharsets.US_ASCII.toString()));

                                if (itr.hasNext()) {
                                        hashData.append('&');
                                }
                        }
                }

                String secureHash = VnPayConfig.hmacSHA512(
                                vnPayConfig.getSecretKey(),
                                hashData.toString());

                String responseCode = params.get("vnp_ResponseCode");

                String txnRef = params.get("vnp_TxnRef");

                Payment payment = paymentRepository.findByTransactionNo(
                                txnRef);

                if (payment == null) {

                        response.sendRedirect(
                                        "http://localhost:3000/payment-failed");

                        return;
                }

                Booking booking = bookingRepository.findById(
                                payment.getBookingId()).orElse(null);

                // SUCCESS
                if (secureHash.equals(vnpSecureHash)
                                && "00".equals(responseCode)) {

                        payment.setStatus("SUCCESS");

                        paymentRepository.save(payment);

                        if (booking != null) {

                                booking.setStatus(
                                                BookingStatus.CONFIRMED);

                                bookingRepository.save(booking);

                                // =========================
                                // GỬI EMAIL
                                // =========================

                                emailService.sendBookingSuccessMail(

                                                booking.getUser().getEmail(),

                                                booking.getUser().getFullName(),

                                                booking.getSchedule().getDoctor().getUser().getFullName(),

                                                booking.getSchedule().getDoctor().getSpecialty().getName(),

                                                booking.getSchedule().getRoom().getName(),

                                                booking.getSchedule().getDate().toString(),

                                                booking.getSchedule().getTimeStart().toString(),
booking.getId().toString()

                                );      
                                Schedule schedule = booking.getSchedule();

                                if (schedule != null) {

                                        schedule.setStatus(
                                                        ScheduleStatus.BOOKED);

                                        scheduleRepository.save(schedule);
                                }
                        }

                        response.sendRedirect(
                                        "http://localhost:3000/payment-success");

                        return;
                }

                // FAILED / CANCEL
                payment.setStatus("FAILED");

                paymentRepository.save(payment);

                response.sendRedirect(
                                "http://localhost:3000/payment-failed");
        }
}