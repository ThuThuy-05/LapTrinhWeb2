package com.booking.backend.dto;

import lombok.Data;

@Data
public class AdminDashboard {

    // KPI
    private long totalDoctors;
    private long totalPatients;
    private long totalBookings;
    private long totalSpecialties;
    private long totalBranches;
    private long totalReviews;

    // Booking Status
    private long pendingBookings;
    private long confirmedBookings;
    private long completedBookings;
    private long cancelledBookings;

    // Today
    private long todayBookings;
    private long todayCompletedBookings;
    private long todayCancelledBookings;

    // Doctor
    private String topDoctorName;
    private long topDoctorBookings;

    // Specialty
    private String topSpecialtyName;
    private long topSpecialtyBookings;
}