// package com.booking.backend.service;

// import com.booking.backend.dto.ScheduleRequest;
// import com.booking.backend.entity.Schedule;
// import com.booking.backend.enums.ScheduleStatus;

// import java.util.List;

// public interface ScheduleService {

//     Schedule createSchedule(ScheduleRequest request);

//     Schedule updateSchedule(Long id, ScheduleRequest request);

//     List<Schedule> getSchedules(Long doctorId, ScheduleStatus status);

//     Schedule getScheduleById(Long id);

//     void deleteSchedule(Long id);

//     // ✅ THÊM METHOD MỚI: Lấy tất cả lịch (không filter)
//     List<Schedule> getAllSchedulesForAdmin();
// }

// ScheduleService.java - Thêm các method mới

package com.booking.backend.service;

import com.booking.backend.dto.ScheduleRequest;
import com.booking.backend.entity.Schedule;
import com.booking.backend.enums.ScheduleStatus;
import java.time.LocalDate;
import java.util.List;

public interface ScheduleService {

    Schedule createSchedule(ScheduleRequest request);

    Schedule updateSchedule(Long id, ScheduleRequest request);

    List<Schedule> getSchedules(Long doctorId, ScheduleStatus status);

    // ✅ Method mới
    List<Schedule> getAllSchedulesForAdmin();

    // ✅ Method mới
    List<Schedule> getSchedulesByDateRange(LocalDate startDate, LocalDate endDate);

    Schedule getScheduleById(Long id);

    void deleteSchedule(Long id);
}