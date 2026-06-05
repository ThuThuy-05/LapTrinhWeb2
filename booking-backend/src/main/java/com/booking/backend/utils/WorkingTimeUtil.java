// package com.booking.backend.utils;

// import java.time.DayOfWeek;
// import java.time.ZonedDateTime;
// import java.time.ZoneId;

// import java.time.*;

// public class WorkingTimeUtil {

//     public static boolean isWorkingTime() {

//         ZonedDateTime now = Instant.now()
//                 .atZone(ZoneId.of("Asia/Ho_Chi_Minh"));

//         DayOfWeek day = now.getDayOfWeek();
//         int hour = now.getHour();

//         System.out.println("NOW VN: " + now);

//         boolean isWeekday = day != DayOfWeek.SATURDAY && day != DayOfWeek.SUNDAY;
//         boolean isWorkingHour = hour >= 8 && hour < 18;

//         return isWeekday && isWorkingHour;
//     }
// }

package com.booking.backend.utils;

import java.time.*;

public class WorkingTimeUtil {

    public static boolean isWorkingTime() {

        ZonedDateTime now = Instant.now()
                .atZone(ZoneId.of("Asia/Ho_Chi_Minh"));

        DayOfWeek day = now.getDayOfWeek();
        int hour = now.getHour();

        System.out.println("NOW VN: " + now);
        System.out.println("DAY: " + day);
        System.out.println("HOUR: " + hour);

        // 🔥 FULL TUẦN: không nghỉ CN nữa
        boolean isWorkingHour = hour >= 8 && hour < 22;

        return isWorkingHour;
    }
}