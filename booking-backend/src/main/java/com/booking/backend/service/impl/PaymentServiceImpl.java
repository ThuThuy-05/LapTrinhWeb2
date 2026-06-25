package com.booking.backend.service.impl;

import com.booking.backend.config.VnPayConfig;
import com.booking.backend.dto.PaymentRequest;
import com.booking.backend.entity.Payment;
import com.booking.backend.repository.PaymentRepository;
import com.booking.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

import com.booking.backend.entity.Booking;
import com.booking.backend.enums.BookingStatus;
import com.booking.backend.repository.BookingRepository;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

        private final PaymentRepository paymentRepository;

        private final VnPayConfig vnPayConfig;

        private final BookingRepository bookingRepository;

        @Override
        public String createPayment(
                        PaymentRequest request,
                        String ip) throws Exception {

                // =========================
                // CHECK BOOKING
                // =========================

                Booking booking = bookingRepository.findById(
                                request.getBookingId())
                                .orElseThrow(() -> new RuntimeException("Booking không tồn tại"));

                // ĐÃ THANH TOÁN
                if (booking.getStatus() == BookingStatus.CONFIRMED) {

                        throw new RuntimeException(
                                        "Lịch này đã thanh toán");
                }

                // =========================
                // TẠO PAYMENT MỚI
                // =========================

                String txnRef = String.valueOf(System.currentTimeMillis());
                Payment payment = paymentRepository
                                .findByBookingId(request.getBookingId())
                                .orElse(new Payment());

                // nếu đã thanh toán thành công
                if ("SUCCESS".equals(payment.getStatus())) {
                        throw new RuntimeException("Booking đã thanh toán");
                }

                payment.setBookingId(request.getBookingId());

                payment.setAmount(request.getAmount());

                payment.setMethod(request.getMethod());

                payment.setStatus("PENDING");

                payment.setCreatedAt(LocalDateTime.now());

                payment.setTransactionNo(txnRef);

                paymentRepository.save(payment);

                if ("BANK_QR".equals(request.getMethod())) {
                        return "BANK_QR";
                }

                // =========================
                // VNPAY PARAMS
                // =========================

                Map<String, String> vnpParams = new HashMap<>();

                vnpParams.put("vnp_Version", "2.1.0");

                vnpParams.put("vnp_Command", "pay");

                vnpParams.put("vnp_TmnCode",
                                vnPayConfig.getVnp_TmnCode());

                vnpParams.put("vnp_Amount",
                                String.valueOf(
                                                (long) (request.getAmount() * 100)));

                vnpParams.put("vnp_CurrCode", "VND");

                vnpParams.put("vnp_TxnRef", txnRef);

                vnpParams.put("vnp_OrderInfo",
                                "Thanh toan booking " + txnRef);

                vnpParams.put("vnp_OrderType", "other");

                vnpParams.put("vnp_Locale", "vn");

                vnpParams.put("vnp_ReturnUrl",
                                vnPayConfig.getVnp_ReturnUrl());

                vnpParams.put("vnp_IpAddr", ip);

                Calendar cld = Calendar.getInstance(
                                TimeZone.getTimeZone("Etc/GMT+7"));

                SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");

                String createDate = formatter.format(cld.getTime());

                vnpParams.put("vnp_CreateDate", createDate);

                cld.add(Calendar.MINUTE, 15);

                String expireDate = formatter.format(cld.getTime());

                vnpParams.put("vnp_ExpireDate", expireDate);

                List<String> fieldNames = new ArrayList<>(vnpParams.keySet());

                Collections.sort(fieldNames);

                StringBuilder hashData = new StringBuilder();

                StringBuilder query = new StringBuilder();

                Iterator<String> itr = fieldNames.iterator();

                while (itr.hasNext()) {

                        String fieldName = itr.next();

                        String fieldValue = vnpParams.get(fieldName);

                        if (fieldValue != null
                                        && !fieldValue.isEmpty()) {

                                hashData.append(fieldName);

                                hashData.append('=');

                                hashData.append(
                                                URLEncoder.encode(
                                                                fieldValue,
                                                                StandardCharsets.UTF_8));

                                query.append(
                                                URLEncoder.encode(
                                                                fieldName,
                                                                StandardCharsets.UTF_8));

                                query.append('=');

                                query.append(
                                                URLEncoder.encode(
                                                                fieldValue,
                                                                StandardCharsets.UTF_8));

                                if (itr.hasNext()) {

                                        query.append('&');

                                        hashData.append('&');
                                }
                        }
                }

                String secureHash = VnPayConfig.hmacSHA512(
                                vnPayConfig.getSecretKey(),
                                hashData.toString());

                query.append("&vnp_SecureHash=");

                query.append(secureHash);

                return vnPayConfig.getVnp_PayUrl()
                                + "?"
                                + query;
        }
}