package com.booking.backend.controller;

import com.booking.backend.dto.BookingRequest;
import com.booking.backend.entity.Booking;
import com.booking.backend.service.BookingService;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // =========================
    // CREATE BOOKING + UPLOAD CCCD
    // =========================
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Booking> createBooking(
            @RequestParam Long userId,
            @RequestParam Long scheduleId,
            @RequestParam String symptom,
            @RequestPart(required = false) MultipartFile cccdFront,
            @RequestPart(required = false) MultipartFile cccdBack) {

        BookingRequest request = new BookingRequest();
        request.setUserId(userId);
        request.setScheduleId(scheduleId);
        request.setSymptom(symptom);

        Booking booking = bookingService.createBooking(
                request,
                cccdFront,
                cccdBack);

        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    // =========================
    // GET ALL BOOKINGS
    // =========================
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // =========================
    // GET BOOKING BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    // =========================
    // GET MY BOOKINGS
    // =========================
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getMyBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getMyBookings(userId));
    }

    // =========================
    // UPDATE BOOKING
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(
            @PathVariable Long id,
            @RequestBody BookingRequest request) {
        return ResponseEntity.ok(
                bookingService.updateBooking(id, request));
    }

    // =========================
    // DELETE BOOKING
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok("Xóa lịch hẹn thành công");
    }
}