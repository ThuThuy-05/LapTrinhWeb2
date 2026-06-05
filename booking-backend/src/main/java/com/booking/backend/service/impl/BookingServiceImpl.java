package com.booking.backend.service.impl;

import com.booking.backend.dto.BookingRequest;
import com.booking.backend.entity.Booking;
import com.booking.backend.entity.Schedule;
import com.booking.backend.entity.User;
import com.booking.backend.enums.BookingStatus;
import com.booking.backend.enums.ScheduleStatus;
import com.booking.backend.repository.BookingRepository;
import com.booking.backend.repository.ScheduleRepository;
import com.booking.backend.repository.UserRepository;
import com.booking.backend.service.BookingService;

import org.springframework.stereotype.Service;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;

    private final UserRepository userRepository;

    private final ScheduleRepository scheduleRepository;

    private final Cloudinary cloudinary;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            UserRepository userRepository,
            ScheduleRepository scheduleRepository,
            Cloudinary cloudinary) {

        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.scheduleRepository = scheduleRepository;
        this.cloudinary = cloudinary;
    }

    // =========================
    // CREATE BOOKING
    // =========================

    @Override
    public Booking createBooking(
            BookingRequest request,
            MultipartFile cccdFront,
            MultipartFile cccdBack) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Schedule schedule = scheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        if (schedule.getStatus() == ScheduleStatus.BOOKED) {
            throw new RuntimeException("Lịch đã được đặt");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setSchedule(schedule);
        booking.setSymptom(request.getSymptom());
        booking.setStatus(BookingStatus.PENDING);
        booking.setBookingDate(LocalDate.now());
        booking.setQrCode(UUID.randomUUID().toString());

        // =========================
        // UPLOAD CCCD MẶT TRƯỚC
        // =========================
        if (cccdFront != null && !cccdFront.isEmpty()) {
            try {
                Map uploadResult = cloudinary.uploader().upload(
                        cccdFront.getBytes(),
                        ObjectUtils.emptyMap());

                String frontUrl = uploadResult.get("secure_url").toString();
                booking.setCccdFrontImage(frontUrl);

            } catch (Exception e) {
                throw new RuntimeException("Upload CCCD mặt trước thất bại");
            }
        }

        // =========================
        // UPLOAD CCCD MẶT SAU
        // =========================
        if (cccdBack != null && !cccdBack.isEmpty()) {
            try {
                Map uploadResult = cloudinary.uploader().upload(
                        cccdBack.getBytes(),
                        ObjectUtils.emptyMap());

                String backUrl = uploadResult.get("secure_url").toString();
                booking.setCccdBackImage(backUrl);

            } catch (Exception e) {
                throw new RuntimeException("Upload CCCD mặt sau thất bại");
            }
        }

        return bookingRepository.save(booking);
    }

    // =========================
    // UPDATE
    // =========================

    @Override
    public Booking updateBooking(Long id, BookingRequest request) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setSymptom(request.getSymptom());

        return bookingRepository.save(booking);
    }

    // =========================
    // GET ALL
    // =========================

    @Override
    public List<Booking> getAllBookings() {

        return bookingRepository.findAll();
    }

    @Override
    public List<Booking> getMyBookings(Long userId) {

        return bookingRepository.findByUserId(userId);
    }
    // =========================
    // GET BY ID
    // =========================

    @Override
    public Booking getBookingById(Long id) {

        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    // =========================
    // DELETE
    // =========================

    @Override
    public void deleteBooking(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // MỞ SLOT LẠI
        Schedule schedule = booking.getSchedule();

        schedule.setStatus(ScheduleStatus.AVAILABLE);

        scheduleRepository.save(schedule);

        bookingRepository.deleteById(id);
    }
}