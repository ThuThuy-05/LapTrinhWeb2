package com.booking.backend.controller;

import com.booking.backend.dto.AdminDashboard;
import com.booking.backend.dto.DoctorDashboard;
import com.booking.backend.entity.Booking;
import com.booking.backend.entity.Doctor;
import com.booking.backend.enums.BookingStatus;
import com.booking.backend.enums.Role;
import com.booking.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin("*")
public class DashboardController {

    private final BookingRepository bookingRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final SpecialtyRepository specialtyRepository;
    private final BranchRepository branchRepository;
    private final ReviewRepository reviewRepository;

    // ==========================
    // DASHBOARD DOCTOR
    // ==========================
    @GetMapping("/doctor/{doctorId}")
    public DoctorDashboard getDoctorDashboard(
            @PathVariable Long doctorId) {

        List<Booking> bookings = bookingRepository.findBySchedule_Doctor_Id(doctorId);

        DoctorDashboard dto = new DoctorDashboard();

        dto.setTotalAppointments(bookings.size());

        dto.setTodayAppointments(
                bookings.stream()
                        .filter(b -> b.getSchedule().getDate()
                                .equals(LocalDate.now()))
                        .count());

        dto.setCompletedAppointments(
                bookings.stream()
                        .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                        .count());

        dto.setCancelledAppointments(
                bookings.stream()
                        .filter(b -> b.getStatus() == BookingStatus.CANCELLED)
                        .count());

        dto.setPendingAppointments(
                bookings.stream()
                        .filter(b -> b.getStatus() == BookingStatus.PENDING)
                        .count());

        dto.setTotalPatients(
                bookings.stream()
                        .map(b -> b.getUser().getId())
                        .distinct()
                        .count());

        return dto;
    }

    // ==========================
    // DASHBOARD ADMIN
    // ==========================
    @GetMapping("/admin")
    public AdminDashboard getAdminDashboard() {

        List<Booking> bookings = bookingRepository.findAll();

        AdminDashboard dto = new AdminDashboard();

        // KPI
        dto.setTotalDoctors(
                doctorRepository.count());

        dto.setTotalPatients(
                userRepository.countByRole(Role.PATIENT));

        dto.setTotalBookings(
                bookingRepository.count());

        dto.setTotalSpecialties(
                specialtyRepository.count());

        dto.setTotalBranches(
                branchRepository.count());

        dto.setTotalReviews(
                reviewRepository.count());

        // Booking status
        dto.setPendingBookings(
                bookings.stream()
                        .filter(b -> b.getStatus() == BookingStatus.PENDING)
                        .count());

        dto.setConfirmedBookings(
                bookings.stream()
                        .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
                        .count());

        dto.setCompletedBookings(
                bookings.stream()
                        .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                        .count());

        dto.setCancelledBookings(
                bookings.stream()
                        .filter(b -> b.getStatus() == BookingStatus.CANCELLED)
                        .count());

        // Hôm nay
        dto.setTodayBookings(
                bookings.stream()
                        .filter(b -> b.getSchedule().getDate()
                                .equals(LocalDate.now()))
                        .count());

        dto.setTodayCompletedBookings(
                bookings.stream()
                        .filter(b -> b.getSchedule().getDate().equals(LocalDate.now())
                                && b.getStatus() == BookingStatus.COMPLETED)
                        .count());

        dto.setTodayCancelledBookings(
                bookings.stream()
                        .filter(b -> b.getSchedule().getDate().equals(LocalDate.now())
                                && b.getStatus() == BookingStatus.CANCELLED)
                        .count());

        // Top Doctor
        Map<Long, Long> doctorCounts = bookings.stream()
                .collect(Collectors.groupingBy(
                        b -> b.getSchedule().getDoctor().getId(),
                        Collectors.counting()));

        doctorCounts.entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .ifPresent(entry -> {

                    Doctor doctor = doctorRepository.findById(entry.getKey()).orElse(null);

                    if (doctor != null) {

                        dto.setTopDoctorName(
                                doctor.getUser().getFullName());

                        dto.setTopDoctorBookings(
                                entry.getValue());
                    }
                });

        // Top Specialty
        Map<String, Long> specialtyCounts = bookings.stream()
                .collect(Collectors.groupingBy(
                        b -> b.getSchedule()
                                .getDoctor()
                                .getSpecialty()
                                .getName(),
                        Collectors.counting()));

        specialtyCounts.entrySet()
                .stream()
                .max(Comparator.comparingLong(Map.Entry::getValue))
                .ifPresent(entry -> {

                    dto.setTopSpecialtyName(
                            entry.getKey());

                    dto.setTopSpecialtyBookings(
                            entry.getValue());
                });

        return dto;
    }
}