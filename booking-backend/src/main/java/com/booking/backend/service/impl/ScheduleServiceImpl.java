// package com.booking.backend.service.impl;

// import com.booking.backend.dto.ScheduleRequest;
// import com.booking.backend.entity.Doctor;
// import com.booking.backend.entity.Room;
// import com.booking.backend.entity.Schedule;
// import com.booking.backend.enums.ScheduleStatus;
// import com.booking.backend.repository.DoctorRepository;
// import com.booking.backend.repository.RoomRepository;
// import com.booking.backend.repository.ScheduleRepository;
// import com.booking.backend.service.ScheduleService;
// import org.springframework.stereotype.Service;

// import java.util.List;

// @Service
// public class ScheduleServiceImpl implements ScheduleService {

//     private final ScheduleRepository scheduleRepository;
//     private final DoctorRepository doctorRepository;
//     private final RoomRepository roomRepository;

//     public ScheduleServiceImpl(
//             ScheduleRepository scheduleRepository,
//             DoctorRepository doctorRepository,
//             RoomRepository roomRepository) {

//         this.scheduleRepository = scheduleRepository;
//         this.doctorRepository = doctorRepository;
//         this.roomRepository = roomRepository;
//     }

//     // =========================
//     // CREATE
//     // =========================
//     @Override
//     public Schedule createSchedule(ScheduleRequest request) {

//         Doctor doctor = doctorRepository.findById(request.getDoctorId())
//                 .orElseThrow(() -> new RuntimeException("Doctor not found"));

//         Room room = roomRepository.findById(request.getRoomId())
//                 .orElseThrow(() -> new RuntimeException("Room not found"));

//         // ❌ CHECK TRÙNG
//         boolean exists = scheduleRepository.existsByDoctor_IdAndDateAndTimeStart(
//                 request.getDoctorId(),
//                 request.getDate(),
//                 request.getTimeStart());

//         if (exists) {
//             throw new RuntimeException("Ca khám này đã tồn tại, không được tạo trùng!");
//         }

//         Schedule schedule = new Schedule();
//         schedule.setDoctor(doctor);
//         schedule.setRoom(room);
//         schedule.setDate(request.getDate());
//         schedule.setTimeStart(request.getTimeStart());
//         schedule.setTimeEnd(request.getTimeEnd());
//         schedule.setStatus(
//                 request.getStatus() != null
//                         ? request.getStatus()
//                         : ScheduleStatus.AVAILABLE);

//         return scheduleRepository.save(schedule);
//     }

//     // =========================
//     // UPDATE
//     // =========================
//     @Override
//     public Schedule updateSchedule(Long id, ScheduleRequest request) {

//         Schedule schedule = scheduleRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Schedule not found"));

//         Doctor doctor = doctorRepository.findById(request.getDoctorId())
//                 .orElseThrow(() -> new RuntimeException("Doctor not found"));

//         Room room = roomRepository.findById(request.getRoomId())
//                 .orElseThrow(() -> new RuntimeException("Room not found"));

//         schedule.setDoctor(doctor);
//         schedule.setRoom(room);

//         schedule.setDate(request.getDate());
//         schedule.setTimeStart(request.getTimeStart());
//         schedule.setTimeEnd(request.getTimeEnd());

//         if (request.getStatus() != null) {
//             schedule.setStatus(request.getStatus());
//         }

//         return scheduleRepository.save(schedule);
//     }

//     // =========================
//     // GET LIST
//     // =========================
//     @Override
//     public List<Schedule> getSchedules(Long doctorId, ScheduleStatus status) {

//         if (doctorId != null && status != null) {
//             return scheduleRepository.findByDoctor_IdAndStatus(doctorId, status);
//         }

//         if (doctorId != null) {
//             return scheduleRepository.findByDoctor_Id(doctorId);
//         }

//         if (status != null) {
//             return scheduleRepository.findByStatus(status);
//         }

//         return scheduleRepository.findAll();
//     }

//     // =========================
//     // GET BY ID
//     // =========================
//     @Override
//     public Schedule getScheduleById(Long id) {

//         return scheduleRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Schedule not found"));
//     }

//     // =========================
//     // DELETE
//     // =========================
//     @Override
//     public void deleteSchedule(Long id) {

//         scheduleRepository.deleteById(id);
//     }
// }

// ScheduleServiceImpl.java - Thêm implement

package com.booking.backend.service.impl;

import com.booking.backend.dto.ScheduleRequest;
import com.booking.backend.entity.Doctor;
import com.booking.backend.entity.Room;
import com.booking.backend.entity.Schedule;
import com.booking.backend.enums.ScheduleStatus;
import com.booking.backend.repository.DoctorRepository;
import com.booking.backend.repository.RoomRepository;
import com.booking.backend.repository.ScheduleRepository;
import com.booking.backend.service.ScheduleService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final DoctorRepository doctorRepository;
    private final RoomRepository roomRepository;

    public ScheduleServiceImpl(
            ScheduleRepository scheduleRepository,
            DoctorRepository doctorRepository,
            RoomRepository roomRepository) {

        this.scheduleRepository = scheduleRepository;
        this.doctorRepository = doctorRepository;
        this.roomRepository = roomRepository;
    }

    // =========================
    // CREATE
    // =========================
    @Override
    public Schedule createSchedule(ScheduleRequest request) {

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // CHECK TRÙNG LỊCH
        boolean exists = scheduleRepository.existsByDoctor_IdAndDateAndTimeStart(
                request.getDoctorId(),
                request.getDate(),
                request.getTimeStart());

        if (exists) {
            throw new RuntimeException("Ca khám này đã tồn tại, không được tạo trùng!");
        }

        // CHECK TRÙNG KHUNG GIỜ VỚI BÁC SĨ
        boolean overlapping = scheduleRepository
                .existsByDoctor_IdAndDateAndTimeStartLessThanEqualAndTimeEndGreaterThanEqual(
                        request.getDoctorId(),
                        request.getDate(),
                        request.getTimeEnd(),
                        request.getTimeStart());

        if (overlapping) {
            throw new RuntimeException("Bác sĩ đã có lịch trong khung giờ này!");
        }

        Schedule schedule = new Schedule();
        schedule.setDoctor(doctor);
        schedule.setRoom(room);
        schedule.setDate(request.getDate());
        schedule.setTimeStart(request.getTimeStart());
        schedule.setTimeEnd(request.getTimeEnd());
        schedule.setStatus(
                request.getStatus() != null
                        ? request.getStatus()
                        : ScheduleStatus.AVAILABLE);

        return scheduleRepository.save(schedule);
    }

    // =========================
    // UPDATE
    // =========================
    @Override
    public Schedule updateSchedule(Long id, ScheduleRequest request) {

        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // CHECK TRÙNG KHI UPDATE (trừ chính nó)
        boolean exists = scheduleRepository.existsByDoctor_IdAndDateAndTimeStartAndIdNot(
                request.getDoctorId(),
                request.getDate(),
                request.getTimeStart(),
                id);

        if (exists) {
            throw new RuntimeException("Ca khám này đã tồn tại, không được cập nhật trùng!");
        }

        schedule.setDoctor(doctor);
        schedule.setRoom(room);
        schedule.setDate(request.getDate());
        schedule.setTimeStart(request.getTimeStart());
        schedule.setTimeEnd(request.getTimeEnd());

        if (request.getStatus() != null) {
            schedule.setStatus(request.getStatus());
        }

        return scheduleRepository.save(schedule);
    }

    // =========================
    // GET LIST (cũ)
    // =========================
    @Override
    public List<Schedule> getSchedules(Long doctorId, ScheduleStatus status) {

        if (doctorId != null && status != null) {
            return scheduleRepository.findByDoctor_IdAndStatus(doctorId, status);
        }

        if (doctorId != null) {
            return scheduleRepository.findByDoctor_Id(doctorId);
        }

        if (status != null) {
            return scheduleRepository.findByStatus(status);
        }

        return scheduleRepository.findAll();
    }

    // ✅ METHOD MỚI: Lấy tất cả lịch cho Admin (có thể kèm thông tin doctor và room)
    @Override
    public List<Schedule> getAllSchedulesForAdmin() {
        // Lấy tất cả schedule kèm theo thông tin doctor và room (EAGER loading)
        List<Schedule> schedules = scheduleRepository.findAllWithDetails();

        // Hoặc nếu không có custom query, dùng:
        // List<Schedule> schedules = scheduleRepository.findAll();

        return schedules;
    }

    // =========================
    // GET BY ID
    // =========================
    @Override
    public Schedule getScheduleById(Long id) {

        return scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
    }

    // =========================
    // DELETE
    // =========================
    @Override
    public void deleteSchedule(Long id) {

        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        // Không cho xóa lịch đã được đặt
        if (schedule.getStatus() == ScheduleStatus.BOOKED) {
            throw new RuntimeException("Không thể xóa lịch đã được đặt!");
        }

        scheduleRepository.deleteById(id);
    }

    @Override
    public List<Schedule> getSchedulesByDateRange(LocalDate startDate, LocalDate endDate) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getSchedulesByDateRange'");
    }

    @Override
    public List<Schedule> getSchedulesByDoctor(Long doctorId) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        return scheduleRepository.findByDoctor_Id(doctor.getId());
    }

    @Override
    public List<Doctor> getDoctorsAvailableByDate(LocalDate date) {

        List<Schedule> schedules = scheduleRepository.findByDateAndStatus(
                date,
                ScheduleStatus.AVAILABLE);
                
        return schedules.stream()
                .map(Schedule::getDoctor)
                .distinct()
                .toList();
    }
}