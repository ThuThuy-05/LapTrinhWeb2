package com.booking.backend.service;

import com.booking.backend.dto.PaymentRequest;

public interface PaymentService {

    String createPayment(
            PaymentRequest request,
            String ip) throws Exception;
}