package com.booking.backend.scheduler;

import com.booking.backend.entity.Booking;
import com.booking.backend.entity.Schedule;
import com.booking.backend.enums.BookingStatus;
import com.booking.backend.enums.ScheduleStatus;
import com.booking.backend.repository.BookingRepository;
import com.booking.backend.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class BookingScheduler {

    private final BookingRepository bookingRepository;
    private final ScheduleRepository scheduleRepository;

    @Scheduled(fixedRate = 60000)
    public void cancelExpiredBookings() {

        List<Booking> bookings = bookingRepository.findByStatus(
                BookingStatus.PENDING);

        LocalDateTime now = LocalDateTime.now();

        for (Booking booking : bookings) {

            if (booking.getCreatedAt()
                    .plusMinutes(5)
                    .isBefore(now)) {

                booking.setStatus(
                        BookingStatus.CANCELLED);

                Schedule schedule = booking.getSchedule();

                schedule.setStatus(
                        ScheduleStatus.AVAILABLE);

                scheduleRepository.save(schedule);
                bookingRepository.save(booking);
            }
        }
    }
}