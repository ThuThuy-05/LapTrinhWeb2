package com.booking.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ScheduleResponse {

    private Long id;

    private Long doctorId;

    private Long roomId;

    // ĐÃ SỬA: Thay đổi định dạng sang Ngày/Tháng/Năm (dd/MM/yyyy) theo thứ tự ông
    // muốn
    @JsonFormat(pattern = "dd/MM/yyyy", timezone = "Asia/Ho_Chi_Minh")
    private LocalDate date;

    // ĐÃ SỬA: Thêm timezone để chặn đứng việc Backend tự ý trừ mất 1 tiếng
    @JsonFormat(pattern = "HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private LocalTime timeStart;

    @JsonFormat(pattern = "HH:mm:ss", timezone = "Asia/Ho_Chi_Minh")
    private LocalTime timeEnd;

    private String status;

    private String doctorName;
    private String roomName;
}