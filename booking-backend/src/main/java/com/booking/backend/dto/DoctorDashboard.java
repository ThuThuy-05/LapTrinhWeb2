package com.booking.backend.dto;

import lombok.Data;

@Data
public class DoctorDashboard {
    private long totalAppointments;

    private long todayAppointments;

    private long completedAppointments;

    private long cancelledAppointments;

    private long pendingAppointments;

    private long totalPatients;

}
