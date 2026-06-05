package com.booking.backend.dto;

import com.booking.backend.enums.ScheduleStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ScheduleRequest {

    // DOCTOR
    private Long doctorId;

    // ROOM
    private Long roomId;

    // DATE
    @Schema(type = "string", example = "2026-05-16")
    private LocalDate date;

    // TIME START
    @Schema(type = "string", example = "08:00:00")
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime timeStart;

    // TIME END
    @Schema(type = "string", example = "09:00:00")
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime timeEnd;

    // STATUS
    private ScheduleStatus status;
}