// package com.booking.backend.controller;

// import com.booking.backend.dto.ScheduleRequest;
// import com.booking.backend.entity.Schedule;
// import com.booking.backend.enums.ScheduleStatus;
// import com.booking.backend.service.ScheduleService;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/api")
// @CrossOrigin("*")
// public class ScheduleController {

//     private final ScheduleService scheduleService;

//     public ScheduleController(ScheduleService scheduleService) {
//         this.scheduleService = scheduleService;
//     }

//     // 👉 CREATE (ADMIN / DOCTOR)
//     @PostMapping("/admin/schedules")
//     public Schedule createSchedule(@RequestBody ScheduleRequest request) {
//         return scheduleService.createSchedule(request);
//     }

//     // 👉 UPDATE (ADMIN / DOCTOR)
//     @PutMapping("/admin/schedules/{id}")
//     public Schedule updateSchedule(
//             @PathVariable Long id,
//             @RequestBody ScheduleRequest request) {
//         return scheduleService.updateSchedule(id, request);
//     }

//     // 👉 GET ALL
//     @GetMapping("/schedules")
//     public List<Schedule> getSchedules(
//             @RequestParam(required = false) Long doctorId,
//             @RequestParam(required = false) ScheduleStatus status) {
//         return scheduleService.getSchedules(doctorId, status);
//     }

//     // 👉 GET BY ID
//     @GetMapping("/schedules/{id}")
//     public Schedule getById(@PathVariable Long id) {
//         return scheduleService.getScheduleById(id);
//     }

//     // 👉 DELETE
//     @DeleteMapping("/admin/schedules/{id}")
//     public void delete(@PathVariable Long id) {
//         scheduleService.deleteSchedule(id);
//     }
// }

// ScheduleController.java - Thêm endpoint mới

package com.booking.backend.controller;

import com.booking.backend.dto.ScheduleRequest;
import com.booking.backend.entity.Schedule;
import com.booking.backend.enums.ScheduleStatus;
import com.booking.backend.service.ScheduleService;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    // 👉 CREATE (ADMIN / DOCTOR)
    @PostMapping("/admin/schedules")
    public Schedule createSchedule(@RequestBody ScheduleRequest request) {
        return scheduleService.createSchedule(request);
    }

    // 👉 UPDATE (ADMIN / DOCTOR)
    @PutMapping("/admin/schedules/{id}")
    public Schedule updateSchedule(
            @PathVariable Long id,
            @RequestBody ScheduleRequest request) {
        return scheduleService.updateSchedule(id, request);
    }

    // 👉 GET ALL (có filter)
    @GetMapping("/schedules")
    public List<Schedule> getSchedules(
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) ScheduleStatus status) {
        return scheduleService.getSchedules(doctorId, status);
    }

    // ✅ ENDPOINT MỚI: GET ALL SCHEDULES FOR ADMIN (không cần params)
    @GetMapping("/admin/schedules/all")
    public List<Schedule> getAllSchedulesForAdmin() {
        return scheduleService.getAllSchedulesForAdmin();
    }

    // ✅ ENDPOINT MỚI: GET SCHEDULES BY DATE RANGE
    @GetMapping("/admin/schedules/date-range")
    public List<Schedule> getSchedulesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return scheduleService.getSchedulesByDateRange(startDate, endDate);
    }

    // 👉 GET BY ID
    @GetMapping("/schedules/{id}")
    public Schedule getById(@PathVariable Long id) {
        return scheduleService.getScheduleById(id);
    }

    // 👉 DELETE
    @DeleteMapping("/admin/schedules/{id}")
    public void delete(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
    }
}