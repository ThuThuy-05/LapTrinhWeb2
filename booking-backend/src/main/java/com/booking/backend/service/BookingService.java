package com.booking.backend.service;

import com.booking.backend.dto.BookingRequest;
import com.booking.backend.entity.Booking;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface BookingService {

    Booking createBooking(BookingRequest request, MultipartFile cccdFront, MultipartFile cccdBack);

    Booking updateBooking(Long id, BookingRequest request);

    List<Booking> getAllBookings();

    Booking getBookingById(Long id);

    void deleteBooking(Long id);

    List<Booking> getMyBookings(Long userId);
}