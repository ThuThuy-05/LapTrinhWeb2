package com.booking.backend.service;

import com.booking.backend.entity.*;
import com.booking.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class HospitalChatbotService {

    private final DoctorRepository doctorRepository;
    private final SpecialtyRepository specialtyRepository;
    private final BookingRepository bookingRepository;
    private final ScheduleRepository scheduleRepository;
    private final PaymentRepository paymentRepository;
    private final BranchRepository branchRepository;
    private final PostRepository postRepository;
    private final ReviewRepository reviewRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final Map<Long, List<String>> history = new ConcurrentHashMap<>();

    private static final String LINE = "━━━━━━━━━━━━━━━━━━━━━━";
    private final Random random = new Random();

    // ===================== MAIN =====================

    public String getResponse(String message, Long userId) {

        if (message == null || message.trim().isEmpty()) {
            return "⚠️ Vui lòng nhập câu hỏi.";
        }

        String msg = message.toLowerCase().trim();

        log.info("USER {}: {}", userId, msg);
        save(userId, "USER: " + msg);

        String response = route(msg, userId);

        save(userId, "BOT: " + response);

        return response;
    }

    private String getDoctorSchedule(String msg) {
        String name = extractName(msg);
        if (name == null || name.trim().isEmpty()) {
            return "📅 Vui lòng nhập tên bác sĩ.\n" +
                    "Ví dụ: \"lịch bác sĩ Thanh Trầm\"";
        }
        return getDoctorScheduleByName(name);
    }

    // ===================== ROUTER =====================

    private String route(String msg, Long userId) {

        // === LỊCH LÀM VIỆC CỦA BÁC SĨ ===
        if ((msg.contains("lịch") || msg.contains("schedule")) &&
                (msg.contains("bác sĩ") || msg.contains("bs") || msg.contains("doctor"))) {
            return getDoctorSchedule(msg);
        }

        // === CHI TIẾT LỊCH KHÁM ===
        if ((msg.contains("chi tiết") || msg.contains("xem")) && msg.contains("bk")) {
            String code = extractBookingCode(msg);
            if (code != null) {
                return getBookingDetail(code);
            }
        }

        // === DANH SÁCH BÁC SĨ ===
        if (msg.contains("danh sách") && (msg.contains("bác sĩ") || msg.contains("bs"))) {
            return listDoctors();
        }

        // === TÌM BÁC SĨ THEO TÊN ===
        if (is(msg, "bác sĩ", "bs", "doctor")) {
            return doctorFlow(msg);
        }

        // === TẤT CẢ CHUYÊN KHOA ===
        if (msg.contains("tất cả") && (msg.contains("khoa") || msg.contains("chuyên khoa"))) {
            return specialtyFlow(msg);
        }

        // === CHUYÊN KHOA ===
        if (is(msg, "khoa", "chuyên khoa")) {
            if (msg.contains("chi tiết") || msg.contains("thông tin")) {
                String name = extractSpecialtyFromMsg(msg);
                if (name != null && !name.isEmpty()) {
                    return specialtyDetail(name);
                }
            }
            return specialtyFlow(msg);
        }

        // === ĐẶT LỊCH KHÁM ===
        if (is(msg, "đặt lịch", "book", "hẹn", "đặt khám")) {
            return bookingFlow(userId);
        }

        // === XEM LỊCH KHÁM CỦA TÔI ===
        if (is(msg, "xem lịch", "kiểm tra", "booking", "lịch của tôi", "lịch khám của tôi")) {
            return checkBooking(msg, userId);
        }

        // === GIÁ DỊCH VỤ ===
        if (is(msg, "giá", "chi phí", "price", "bảng giá", "giá khám")) {
            return priceInfo();
        }

        // === THANH TOÁN ===
        if (is(msg, "thanh toán", "payment", "trả tiền")) {
            return paymentInfo(userId);
        }

        // === CHI NHÁNH ===
        if (is(msg, "chi nhánh", "địa điểm", "cơ sở", "branch")) {
            return branchInfo();
        }

        // === TIN TỨC ===
        if (is(msg, "tin tức", "post", "news", "bài viết")) {
            return postInfo();
        }

        // === ĐÁNH GIÁ ===
        if (is(msg, "đánh giá", "review", "nhận xét", "feedback")) {
            return reviewInfo();
        }

        // === PHÒNG KHÁM ===
        if (is(msg, "phòng", "room", "phòng khám")) {
            return roomInfo();
        }

        // === GIỜ LÀM VIỆC ===
        if (is(msg, "giờ", "time", "mở cửa", "working hour")) {
            return workingHours();
        }

        // === THỐNG KÊ ===
        if (is(msg, "thống kê", "báo cáo", "report", "tổng quan")) {
            return getStatistics();
        }

        // === TRẠNG THÁI HỆ THỐNG ===
        if (is(msg, "trạng thái", "status", "ping", "kiểm tra")) {
            return getSystemStatus();
        }

        // === CHÀO HỎI ===
        if (is(msg, "xin chào", "hello", "hi", "chào bạn", "chào")) {
            return greeting();
        }

        if (is(msg, "cảm ơn", "thanks", "thank you", "thank")) {
            return thanks();
        }

        // === RESET ===
        if (is(msg, "reset", "xóa lịch sử", "clear", "làm mới")) {
            resetConversation(userId);
            return "🔄 Đã reset conversation! Hãy hỏi tôi bất cứ điều gì.";
        }

        // === GIỚI THIỆU ===
        if (is(msg, "giới thiệu", "về bệnh viện", "about")) {
            return hospitalInfo();
        }

        // === DEFAULT ===
        return fallback();
    }

    // ===================== DOCTOR FLOW =====================

    private String doctorFlow(String msg) {

        try {
            // Trích xuất tên bác sĩ
            String name = extractName(msg);

            // Nếu không có tên -> hướng dẫn
            if (name == null || name.trim().isEmpty()) {
                return "👨‍⚕️ Vui lòng nhập tên bác sĩ.\n" +
                        "Ví dụ: \"bác sĩ Thanh Trầm\" hoặc \"lịch bác sĩ Thanh Trầm\"";
            }

            // Lịch làm việc
            if (msg.contains("lịch")) {
                return getDoctorScheduleByName(name);
            }

            // Thông tin bác sĩ
            return getDoctorInfo(name);

        } catch (Exception e) {
            log.error("doctor error", e);
            return "❌ Không lấy được thông tin bác sĩ.";
        }
    }

    // ===================== DANH SÁCH BÁC SĨ =====================

    private String listDoctors() {

        List<Doctor> doctors = Optional.ofNullable(doctorRepository.findAll())
                .orElse(new ArrayList<>());

        if (doctors.isEmpty()) {
            return "❌ Không có bác sĩ.";
        }

        StringBuilder sb = new StringBuilder("👨‍⚕️ DANH SÁCH BÁC SĨ\n" + LINE + "\n");

        doctors.stream().limit(10).forEach(d -> {

            User u = d.getUser();

            String fullName = (u.getLastName() != null ? u.getLastName() : "")
                    + " "
                    + (u.getFirstName() != null ? u.getFirstName() : "");

            sb.append("• ").append(fullName.trim()).append("\n");

            if (d.getSpecialty() != null) {
                sb.append("  🏥 ").append(d.getSpecialty().getName()).append("\n");
            }

            if (d.getExperience() != null) {
                sb.append("  ⏳ ").append(d.getExperience()).append(" năm KN\n");
            }

            sb.append("\n");
        });

        return sb.toString();
    }

    // ===================== THÔNG TIN BÁC SĨ =====================

    private String getDoctorInfo(String name) {

        if (name == null || name.trim().isEmpty()) {
            return "👨‍⚕️ Vui lòng nhập tên bác sĩ.\n" +
                    "Ví dụ: \"bác sĩ Thanh Trầm\"";
        }

        String keyword = name.trim();

        // Tìm kiếm bác sĩ với nhiều cách
        List<Doctor> doctors = findDoctors(keyword);

        if (doctors.isEmpty()) {
            // Hiển thị danh sách bác sĩ gợi ý
            List<Doctor> allDoctors = doctorRepository.findAll();
            if (allDoctors != null && !allDoctors.isEmpty()) {
                StringBuilder suggest = new StringBuilder();
                suggest.append("❌ Không tìm thấy bác sĩ \"").append(keyword).append("\".\n\n");
                suggest.append("💡 DANH SÁCH BÁC SĨ CÓ SẴN:\n");
                int count = 0;
                for (Doctor d : allDoctors) {
                    if (count >= 10)
                        break;
                    User u = d.getUser();
                    String fullName = (u.getFirstName() != null ? u.getFirstName() : "") + " " +
                            (u.getLastName() != null ? u.getLastName() : "");
                    suggest.append("• ").append(fullName.trim()).append("\n");
                    count++;
                }
                return suggest.toString();
            }
            return "❌ Không tìm thấy bác sĩ: " + keyword;
        }

        // Hiển thị thông tin bác sĩ đầu tiên
        Doctor d = doctors.get(0);
        User u = d.getUser();

        String fullName = (u.getLastName() != null ? u.getLastName() : "")
                + " "
                + (u.getFirstName() != null ? u.getFirstName() : "");

        StringBuilder result = new StringBuilder();
        result.append("👨‍⚕️ ").append(fullName.trim()).append("\n");
        result.append("🏥 ").append(d.getSpecialty() != null ? d.getSpecialty().getName() : "N/A").append("\n");
        result.append("🎓 ").append(d.getDegree() != null ? d.getDegree() : "N/A").append("\n");
        result.append("⏳ ").append(d.getExperience()).append(" năm KN\n");
        result.append("📞 ").append(u.getPhone() != null ? u.getPhone() : "N/A").append("\n");
        result.append("✉️ ").append(u.getEmail() != null ? u.getEmail() : "N/A").append("\n");

        // Nếu có nhiều hơn 1 kết quả
        if (doctors.size() > 1) {
            result.append("\n📌 Còn ").append(doctors.size() - 1).append(" bác sĩ khác:\n");
            for (int i = 1; i < Math.min(doctors.size(), 5); i++) {
                Doctor other = doctors.get(i);
                User otherUser = other.getUser();
                String otherName = (otherUser.getFirstName() != null ? otherUser.getFirstName() : "") + " " +
                        (otherUser.getLastName() != null ? otherUser.getLastName() : "");
                result.append("   • ").append(otherName.trim());
                if (other.getSpecialty() != null) {
                    result.append(" (").append(other.getSpecialty().getName()).append(")");
                }
                result.append("\n");
            }
        }

        return result.toString();
    }

    private String getDoctorScheduleByName(String name) {

        if (name == null || name.trim().isEmpty()) {
            return "📅 Vui lòng nhập tên bác sĩ.\n" +
                    "Ví dụ: \"lịch bác sĩ Thanh Trầm\"";
        }

        String keyword = name.trim();

        // Tìm kiếm bác sĩ
        List<Doctor> doctors = findDoctors(keyword);

        if (doctors == null || doctors.isEmpty()) {
            return "❌ Không tìm thấy bác sĩ: " + keyword;
        }

        Doctor d = doctors.get(0);
        User u = d.getUser();

        String fullName = (u.getLastName() != null ? u.getLastName() : "")
                + " "
                + (u.getFirstName() != null ? u.getFirstName() : "");
        // Lấy lịch làm việc từ database
        List<Schedule> schedules = scheduleRepository.findByDoctor_Id(d.getId());

        if (schedules == null || schedules.isEmpty()) {
            return "📅 Bác sĩ " + fullName.trim() + " chưa có lịch làm việc.\n\n" +
                    "💡 Bạn có thể:\n" +
                    "• Xem danh sách bác sĩ: \"danh sách bác sĩ\"\n" +
                    "• Đặt lịch: \"đặt lịch\"";
        }

        StringBuilder sb = new StringBuilder();
        sb.append("📅 **LỊCH LÀM VIỆC CỦA BÁC SĨ ")
                .append(fullName.trim().toUpperCase())
                .append("**\n");
        sb.append(LINE).append("\n\n");

        // Nhóm lịch theo ngày
        Map<String, List<Schedule>> groupedSchedules = new LinkedHashMap<>();
        for (Schedule s : schedules) {
            String dateKey = s.getDate() != null ? s.getDate().toString() : "Ngày khác";
            groupedSchedules.computeIfAbsent(dateKey, k -> new ArrayList<>()).add(s);
        }

        // Hiển thị lịch theo từng ngày
        for (Map.Entry<String, List<Schedule>> entry : groupedSchedules.entrySet()) {
            sb.append("📌 ").append(entry.getKey()).append(":\n");

            for (Schedule s : entry.getValue()) {
                String timeStart = s.getTimeStart() != null
                        ? s.getTimeStart().toString()
                        : "";

                String timeEnd = s.getTimeEnd() != null
                        ? s.getTimeEnd().toString()
                        : "";

                sb.append("   ⏰ ")
                        .append(timeStart)
                        .append(" - ")
                        .append(timeEnd);

                if (s.getRoom() != null) {
                    sb.append(" (🏥 Phòng ")
                            .append(s.getRoom().getName())
                            .append(")");
                }

                sb.append("\n");
            }

            sb.append("\n");
        }

        // Thông tin thêm (ĐÃ ĐƯA VÀO TRONG METHOD)
        Long doctorId = d.getId();

        String url = "/booking/" + doctorId;

        sb.append("\n💡 👉 Nhấn để đặt lịch với bác sĩ: ")
                .append(url)
                .append("\n");
        sb.append("📞 Hoặc gọi hotline: 1900-xxxx");

        return sb.toString();
    }

    // ===================== CHI TIẾT LỊCH KHÁM =====================

    private String getBookingDetail(String bookingCode) {
        try {
            Optional<Booking> bookingOpt;
            if (bookingCode.startsWith("BK")) {
                Long id = Long.parseLong(bookingCode.substring(2));
                bookingOpt = bookingRepository.findById(id);
            } else {
                bookingOpt = bookingRepository.findByQrCode(bookingCode);
            }

            if (bookingOpt == null || bookingOpt.isEmpty()) {
                return "❌ Không tìm thấy lịch khám với mã: " + bookingCode;
            }

            Booking b = bookingOpt.get();
            StringBuilder sb = new StringBuilder();
            sb.append("✅ **CHI TIẾT LỊCH KHÁM**\n");
            sb.append(LINE).append("\n\n");

            sb.append("📌 Mã: BK").append(b.getId()).append("\n");

            if (b.getUser() != null) {
                sb.append("👤 Bệnh nhân: ").append(b.getUser().getFullName()).append("\n");
                sb.append("📞 SĐT: ").append(b.getUser().getPhone()).append("\n");
            }

            if (b.getSchedule() != null) {
                Schedule schedule = b.getSchedule();
                sb.append("📅 Ngày: ").append(b.getBookingDate()).append("\n");
                sb.append("⏰ Giờ: ").append(schedule.getTimeStart())
                        .append(" - ").append(schedule.getTimeEnd()).append("\n");

                if (schedule.getDoctor() != null) {
                    Doctor doctor = schedule.getDoctor();
                    User doctorUser = doctor.getUser();
                    sb.append("👨‍⚕️ Bác sĩ: ").append(doctorUser.getFullName()).append("\n");
                    if (doctor.getSpecialty() != null) {
                        sb.append("🏥 Chuyên khoa: ").append(doctor.getSpecialty().getName()).append("\n");
                    }
                }
            }

            if (b.getSymptom() != null && !b.getSymptom().isEmpty()) {
                sb.append("\n📝 Triệu chứng: ").append(b.getSymptom()).append("\n");
            }

            if (b.getDiagnosis() != null && !b.getDiagnosis().isEmpty()) {
                sb.append("🔬 Chẩn đoán: ").append(b.getDiagnosis()).append("\n");
            }

            if (b.getPrescription() != null && !b.getPrescription().isEmpty()) {
                sb.append("💊 Đơn thuốc: ").append(b.getPrescription()).append("\n");
            }

            if (b.getDoctorNote() != null && !b.getDoctorNote().isEmpty()) {
                sb.append("📋 Ghi chú bác sĩ: ").append(b.getDoctorNote()).append("\n");
            }

            if (b.getStatus() != null) {
                String emoji = getStatusEmoji(b.getStatus().name());
                sb.append("\n📊 Trạng thái: ").append(emoji).append(" ").append(b.getStatus());
            }

            return sb.toString();

        } catch (Exception e) {
            log.error("Lỗi lấy chi tiết lịch: ", e);
            return "❌ Không thể lấy chi tiết lịch khám. Vui lòng thử lại!";
        }
    }

    // ===================== HÀM TÌM BÁC SĨ =====================

    private List<Doctor> findDoctors(String keyword) {
        List<Doctor> result = new ArrayList<>();

        if (keyword == null || keyword.trim().isEmpty()) {
            return result;
        }

        String searchKey = keyword.trim();

        // Cách 1: Tìm chính xác qua searchDoctor
        List<Doctor> searchResult = doctorRepository.searchDoctor(searchKey);
        if (searchResult != null && !searchResult.isEmpty()) {
            result.addAll(searchResult);
            return result.stream().distinct().toList();
        }

        // Cách 2: Tìm từng từ
        String[] parts = searchKey.split(" ");
        for (String part : parts) {
            if (part.length() > 1) {
                List<Doctor> partResult = doctorRepository.searchDoctor(part);
                if (partResult != null && !partResult.isEmpty()) {
                    result.addAll(partResult);
                }
            }
        }

        if (!result.isEmpty()) {
            return result.stream().distinct().toList();
        }

        // Cách 3: Tìm gần đúng với tất cả bác sĩ
        List<Doctor> allDoctors = doctorRepository.findAll();
        for (Doctor d : allDoctors) {
            User u = d.getUser();
            String fullName = (u.getFirstName() != null ? u.getFirstName() : "") + " " +
                    (u.getLastName() != null ? u.getLastName() : "");
            String fullNameLower = fullName.toLowerCase().trim();

            String[] searchWords = searchKey.split(" ");
            for (String word : searchWords) {
                if (word.length() > 1 && fullNameLower.contains(word)) {
                    result.add(d);
                    break;
                }
            }
        }

        return result.stream().distinct().toList();
    }

    // ===================== CHUYÊN KHOA =====================

    private String specialtyFlow(String msg) {

        List<Specialty> list = specialtyRepository.findAll();

        if (list == null || list.isEmpty())
            return "❌ Không có chuyên khoa.";

        StringBuilder sb = new StringBuilder("🏥 DANH SÁCH CHUYÊN KHOA\n" + LINE + "\n");

        for (Specialty s : list) {
            sb.append("• ").append(s.getName()).append("\n");
        }

        return sb.toString();
    }

    private String specialtyDetail(String specialtyName) {
        if (specialtyName == null || specialtyName.trim().isEmpty()) {
            return "⚠️ Vui lòng nhập tên chuyên khoa.";
        }

        List<Specialty> specialties = specialtyRepository.findByNameContainingIgnoreCase(specialtyName.trim());

        if (specialties == null || specialties.isEmpty()) {
            return "❌ Không tìm thấy chuyên khoa: " + specialtyName;
        }

        Specialty s = specialties.get(0);
        StringBuilder sb = new StringBuilder();
        sb.append("🏥 CHUYÊN KHOA ").append(s.getName().toUpperCase()).append("\n");
        sb.append(LINE).append("\n");

        if (s.getDescription() != null && !s.getDescription().isEmpty()) {
            sb.append("📝 ").append(s.getDescription()).append("\n\n");
        }

        if (s.getPrice() != null && s.getPrice() > 0) {
            sb.append("💰 Giá khám: ").append(String.format("%,d", s.getPrice())).append("đ\n\n");
        }

        List<Doctor> doctors = doctorRepository.findBySpecialty_Id(s.getId());
        int count = doctors != null ? doctors.size() : 0;
        sb.append("👨‍⚕️ Số bác sĩ: ").append(count).append("\n");

        if (count > 0) {
            sb.append("\n📋 DANH SÁCH BÁC SĨ:\n");
            for (Doctor d : doctors) {
                User u = d.getUser();
                String fullName = (u.getFirstName() != null ? u.getFirstName() : "") + " " +
                        (u.getLastName() != null ? u.getLastName() : "");
                sb.append("• ").append(fullName.trim());
                if (d.getExperience() != null) {
                    sb.append(" (").append(d.getExperience()).append(" năm)");
                }
                sb.append("\n");
            }
        }

        return sb.toString();
    }

    // ===================== ĐẶT LỊCH =====================

    private String bookingFlow(Long userId) {

        StringBuilder sb = new StringBuilder("📋 HƯỚNG DẪN ĐẶT LỊCH\n" + LINE + "\n");

        if (userId != null) {
            Optional<User> user = userRepository.findById(userId);
            user.ifPresent(u -> sb.append("👤 Bạn đã đăng nhập: ").append(u.getFullName()).append("\n"));
        } else {
            sb.append("⚠️ Bạn chưa đăng nhập. Vui lòng đăng nhập để đặt lịch.\n");
        }

        sb.append("\n👉 Các bước đặt lịch:\n");
        sb.append("1️⃣ Chọn bác sĩ bạn muốn khám\n");
        sb.append("2️⃣ Chọn ngày và giờ khám\n");
        sb.append("3️⃣ Xác nhận thông tin\n\n");
        sb.append("📞 Hoặc gọi hotline: 1900-xxxx để được hỗ trợ");

        return sb.toString();
    }

    // ===================== KIỂM TRA LỊCH KHÁM CỦA TÔI =====================

    private String checkBooking(String msg, Long userId) {

        if (userId == null) {
            return "⚠️ Vui lòng đăng nhập để xem lịch khám của bạn.";
        }

        List<Booking> list = bookingRepository.findByUser_IdOrderByBookingDateDesc(userId);

        if (list == null || list.isEmpty()) {
            return "📋 Bạn chưa có lịch đặt nào.\n\n👉 Để đặt lịch, hãy hỏi: \"đặt lịch\"";
        }

        StringBuilder sb = new StringBuilder("📋 LỊCH KHÁM CỦA BẠN\n" + LINE + "\n");

        int limit = 0;
        for (Booking b : list) {
            if (limit >= 5)
                break;

            sb.append("• BK").append(b.getId());

            // Ngày đặt
            if (b.getBookingDate() != null) {
                sb.append(" - ").append(b.getBookingDate());
            }

            // Lấy thời gian từ Schedule
            if (b.getSchedule() != null) {
                Schedule schedule = b.getSchedule();
                if (schedule.getTimeStart() != null && schedule.getTimeEnd() != null) {
                    sb.append(" ").append(schedule.getTimeStart())
                            .append(" - ").append(schedule.getTimeEnd());
                }
            }

            // Trạng thái
            if (b.getStatus() != null) {
                String emoji = getStatusEmoji(b.getStatus().name());
                sb.append(" ").append(emoji).append(" ").append(b.getStatus());
            }

            sb.append("\n");
            limit++;
        }

        if (list.size() > 5) {
            sb.append("\n📌 Còn ").append(list.size() - 5).append(" lịch khác.");
        }

        return sb.toString();
    }

    // ===================== GET STATUS EMOJI =====================

    private String getStatusEmoji(String status) {
        if (status == null)
            return "📌";

        switch (status.toUpperCase()) {
            case "CONFIRMED":
            case "XÁC NHẬN":
                return "✅";
            case "PENDING":
            case "CHỜ XÁC NHẬN":
                return "⏳";
            case "COMPLETED":
            case "HOÀN THÀNH":
                return "✔️";
            case "CANCELLED":
            case "ĐÃ HỦY":
                return "❌";
            default:
                return "📌";
        }
    }

    // ===================== GIÁ DỊCH VỤ =====================

    private String priceInfo() {
        try {
            List<Specialty> specialties = specialtyRepository.findAll();

            if (specialties == null || specialties.isEmpty()) {
                return "💰 Hiện tại chưa có thông tin giá dịch vụ.\n" +
                        "📞 Vui lòng liên hệ hotline 1900-xxxx để biết chi tiết.";
            }

            List<Specialty> priceList = specialties.stream()
                    .filter(s -> s.getPrice() != null && s.getPrice() > 0)
                    .toList();

            if (priceList.isEmpty()) {
                return "💰 Hiện tại chưa có thông tin giá dịch vụ.\n" +
                        "📞 Vui lòng liên hệ hotline 1900-xxxx để biết chi tiết.";
            }

            StringBuilder sb = new StringBuilder();
            sb.append("💰 BẢNG GIÁ DỊCH VỤ\n");
            sb.append(LINE).append("\n\n");

            for (Specialty s : priceList) {
                sb.append("• ").append(s.getName());
                if (s.getPrice() != null && s.getPrice() > 0) {
                    sb.append(": ").append(String.format("%,d", s.getPrice())).append("đ");
                }
                if (s.getDescription() != null && !s.getDescription().isEmpty()) {
                    sb.append("\n  ").append(s.getDescription());
                }
                sb.append("\n\n");
            }

            sb.append("💡 Giá có thể thay đổi theo thời điểm. Liên hệ 1900-xxxx để biết chính xác.");
            return sb.toString();

        } catch (Exception e) {
            log.error("Lỗi lấy giá dịch vụ: ", e);
            return "💰 Hiện tại chưa có thông tin giá dịch vụ.\n📞 Vui lòng liên hệ hotline 1900-xxxx để biết chi tiết.";
        }
    }

    // ===================== THANH TOÁN =====================

    private String paymentInfo(Long userId) {
        StringBuilder sb = new StringBuilder();
        sb.append("💳 THÔNG TIN THANH TOÁN\n" + LINE + "\n");
        sb.append("• Tiền mặt (tại quầy)\n");
        sb.append("• Chuyển khoản ngân hàng\n");
        sb.append("• Thẻ tín dụng (Visa/Mastercard)\n");
        sb.append("• Ví điện tử (Momo/ZaloPay)\n");
        sb.append("• Bảo hiểm y tế\n\n");
        sb.append("📌 Thông tin chuyển khoản:\n");
        sb.append("• Ngân hàng: Vietcombank\n");
        sb.append("• Số TK: 123456789\n");
        sb.append("• Chủ TK: BỆNH VIỆN ABC\n");
        sb.append("• ND: [Mã đặt lịch] - [Họ tên]");
        return sb.toString();
    }

    // ===================== CHI NHÁNH =====================

    private String branchInfo() {
        List<Branch> branches = branchRepository.findAll();

        if (branches == null || branches.isEmpty()) {
            return "🏥 CƠ SỞ CHÍNH\n" + LINE + "\n" +
                    "📍 123 Đường ABC, Quận 1, TP.HCM\n" +
                    "📞 1900-xxxx\n" +
                    "⏰ 7:00 - 17:00 (T2-T7)";
        }

        StringBuilder sb = new StringBuilder("🏥 DANH SÁCH CHI NHÁNH\n" + LINE + "\n");

        for (Branch b : branches) {
            sb.append("📍 ").append(b.getName()).append("\n");
            if (b.getAddress() != null) {
                sb.append("   Địa chỉ: ").append(b.getAddress()).append("\n");
            }
            if (b.getActive() != null) {
                String status = b.getActive() ? "🟢 Đang hoạt động" : "🔴 Tạm ngưng";
                sb.append("   ").append(status).append("\n");
            }
            sb.append("\n");
        }

        return sb.toString();
    }

    // ===================== TIN TỨC =====================

    private String postInfo() {
        List<Post> posts = postRepository.findTop5ByOrderByCreatedAtDesc();

        if (posts == null || posts.isEmpty())
            return "📰 Không có bài viết mới.";

        StringBuilder sb = new StringBuilder("📰 TIN TỨC MỚI\n" + LINE + "\n");

        for (Post p : posts) {
            sb.append("• ").append(p.getTitle()).append("\n");
        }

        return sb.toString();
    }

    // ===================== ĐÁNH GIÁ =====================

    private String reviewInfo() {
        List<Review> reviews = reviewRepository.findTop5ByOrderByCreatedAtDesc();

        if (reviews == null || reviews.isEmpty())
            return "⭐ Chưa có đánh giá nào.";

        StringBuilder sb = new StringBuilder("⭐ ĐÁNH GIÁ GẦN ĐÂY\n" + LINE + "\n");

        for (Review r : reviews) {
            sb.append("• ⭐ ").append(r.getRating()).append("/5");
            if (r.getComment() != null && !r.getComment().isEmpty()) {
                sb.append(" - \"").append(r.getComment()).append("\"");
            }
            sb.append("\n");
        }

        return sb.toString();
    }

    // ===================== PHÒNG KHÁM =====================

    private String roomInfo() {
        List<Room> rooms = roomRepository.findAll();

        if (rooms == null || rooms.isEmpty())
            return "🏥 Chưa có thông tin phòng khám.";

        StringBuilder sb = new StringBuilder("🏥 DANH SÁCH PHÒNG KHÁM\n" + LINE + "\n");

        for (Room r : rooms) {
            sb.append("• ").append(r.getName());
            sb.append("\n");
        }

        return sb.toString();
    }

    // ===================== GIỜ LÀM VIỆC =====================

    private String workingHours() {
        return "⏰ GIỜ LÀM VIỆC\n" + LINE + "\n" +
                "• Thứ 2 - Thứ 6: 7:00 - 17:00\n" +
                "• Thứ 7: 7:00 - 12:00\n" +
                "• Chủ nhật: Nghỉ\n\n" +
                "🚑 Cấp cứu: 24/7 - Hotline: 115\n" +
                "📞 Đặt lịch: 7:00 - 21:00 (hàng ngày)";
    }

    // ===================== THỐNG KÊ =====================

    private String getStatistics() {
        try {
            long doctorCount = doctorRepository.count();
            long specialtyCount = specialtyRepository.count();
            long bookingCount = bookingRepository.count();
            long userCount = userRepository.count();
            long branchCount = branchRepository.count();

            long todayBookings = bookingRepository.countByBookingDate(LocalDate.now());

            StringBuilder sb = new StringBuilder();
            sb.append("📊 **THỐNG KÊ BỆNH VIỆN**\n");
            sb.append(LINE).append("\n\n");
            sb.append("👨‍⚕️ Tổng bác sĩ: ").append(doctorCount).append("\n");
            sb.append("🏥 Tổng chuyên khoa: ").append(specialtyCount).append("\n");
            sb.append("📅 Tổng đặt lịch: ").append(bookingCount).append("\n");
            sb.append("👤 Tổng người dùng: ").append(userCount).append("\n");
            sb.append("🏢 Tổng chi nhánh: ").append(branchCount).append("\n\n");
            sb.append("📋 Hôm nay: ").append(todayBookings).append(" lịch hẹn");

            return sb.toString();

        } catch (Exception e) {
            log.error("Lỗi thống kê: ", e);
            return "Xin lỗi, tôi không thể lấy thống kê.";
        }
    }

    // ===================== TRẠNG THÁI HỆ THỐNG =====================

    private String getSystemStatus() {
        StringBuilder sb = new StringBuilder();
        sb.append("🟢 **TRẠNG THÁI HỆ THỐNG**\n");
        sb.append(LINE).append("\n\n");
        sb.append("✅ Chatbot: Đang hoạt động\n");
        sb.append("✅ Kết nối database: ").append(checkDatabaseConnection()).append("\n");
        sb.append("⏰ ").append(LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")))
                .append("\n");
        sb.append("\n💡 Tôi sẵn sàng hỗ trợ bạn!");
        return sb.toString();
    }

    private String checkDatabaseConnection() {
        try {
            long count = userRepository.count();
            return "✅ Kết nối tốt (" + count + " users)";
        } catch (Exception e) {
            return "❌ Lỗi kết nối";
        }
    }

    // ===================== GIỚI THIỆU =====================

    private String hospitalInfo() {
        return "🏥 BỆNH VIỆN ABC\n" + LINE + "\n\n" +
                "📌 Thành lập: 2000\n" +
                "📍 Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM\n" +
                "📞 Hotline: 1900-xxxx\n" +
                "🌐 Website: www.benhvien.com\n\n" +
                "🌟 Dịch vụ của chúng tôi:\n" +
                "• Khám chữa bệnh đa khoa\n" +
                "• Đội ngũ bác sĩ giàu kinh nghiệm\n" +
                "• Trang thiết bị hiện đại\n" +
                "• Dịch vụ chăm sóc tận tâm\n\n" +
                "💡 Hỏi tôi để biết thêm chi tiết!";
    }

    // ===================== CHÀO HỎI =====================

    private String greeting() {
        return "👋 Xin chào! Tôi là trợ lý ảo của bệnh viện.\n\n" +
                "Tôi có thể giúp bạn:\n" +
                "• Tìm bác sĩ theo tên: \"bác sĩ Thanh Trầm\"\n" +
                "• Xem lịch làm việc: \"lịch bác sĩ Thanh Trầm\"\n" +
                "• Danh sách bác sĩ: \"danh sách bác sĩ\"\n" +
                "• Xem chuyên khoa: \"chuyên khoa\"\n" +
                "• Đặt lịch khám: \"đặt lịch\"\n" +
                "• Xem giá dịch vụ: \"giá khám\"\n\n" +
                "💡 Hãy hỏi tôi bất cứ điều gì!";
    }

    private String thanks() {
        return "❤️ Không có gì! Rất vui được giúp bạn.\n" +
                "Nếu cần thêm, đừng ngần ngại hỏi nhé!";
    }

    // ===================== FALLBACK =====================

    private String fallback() {
        String[] responses = {
                "🤔 Tôi chưa hiểu câu hỏi của bạn.\n\n" +
                        "💡 Hãy thử hỏi:\n" +
                        "• \"lịch bác sĩ Thanh Trầm\" - Xem lịch làm việc\n" +
                        "• \"bác sĩ Thanh Trầm\" - Tìm thông tin bác sĩ\n" +
                        "• \"danh sách bác sĩ\" - Xem tất cả bác sĩ\n" +
                        "• \"chuyên khoa\" - Xem các chuyên khoa\n" +
                        "• \"giá khám\" - Xem bảng giá\n" +
                        "• \"đặt lịch\" - Hướng dẫn đặt lịch",

                "😊 Tôi có thể giúp gì?\n\n" +
                        "📌 Gợi ý:\n" +
                        "1️⃣ Xem lịch bác sĩ: \"lịch bác sĩ [tên]\"\n" +
                        "2️⃣ Tìm bác sĩ: \"bác sĩ [tên]\"\n" +
                        "3️⃣ Đặt lịch: \"đặt lịch\"\n" +
                        "4️⃣ Giá: \"giá khám\"\n" +
                        "5️⃣ Chuyên khoa: \"chuyên khoa\"",

                "💡 Bạn có thể hỏi tôi về:\n" +
                        "• Lịch làm việc của bác sĩ\n" +
                        "• Thông tin bác sĩ\n" +
                        "• Đặt lịch khám\n" +
                        "• Giá dịch vụ\n" +
                        "• Thanh toán\n" +
                        "• Chi nhánh\n" +
                        "• Tin tức\n\n" +
                        "Hãy hỏi một cách tự nhiên nhé!"
        };
        return responses[random.nextInt(responses.length)];
    }

    // ===================== HELPERS =====================

    private boolean is(String msg, String... keys) {
        for (String k : keys) {
            if (msg.contains(k))
                return true;
        }
        return false;
    }

    private String extractName(String msg) {
        String cleaned = msg.replace("bác sĩ", "")
                .replace("bs", "")
                .replace("doctor", "")
                .replace("dr", "")
                .replace("lịch", "")
                .replace("làm việc", "")
                .replace("của", "")
                .replace("thông tin", "")
                .replace("tìm", "")
                .replace("xem", "")
                .replace("xin", "")
                .replace("hỏi", "")
                .trim();

        if (cleaned.isEmpty()) {
            return null;
        }

        return cleaned;
    }

    private String extractSpecialtyFromMsg(String msg) {
        String cleaned = msg.replace("khoa", "")
                .replace("chuyên khoa", "")
                .replace("bác sĩ", "")
                .replace("bs", "")
                .replace("chi tiết", "")
                .replace("thông tin", "")
                .replace("tìm", "")
                .trim();

        if (!cleaned.isEmpty()) {
            String[] parts = cleaned.split(" ");
            for (String part : parts) {
                if (part.length() > 2) {
                    return part;
                }
            }
        }

        if (msg.contains("khoa")) {
            int idx = msg.indexOf("khoa");
            String after = msg.substring(idx + 4).trim();
            if (!after.isEmpty()) {
                String[] parts = after.split(" ");
                return parts[0];
            }
        }

        return null;
    }

    private String extractBookingCode(String msg) {
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("(BK\\d+)");
        java.util.regex.Matcher matcher = pattern.matcher(msg.toUpperCase());
        if (matcher.find()) {
            return matcher.group();
        }
        return null;
    }

    private void save(Long userId, String msg) {
        if (userId == null)
            return;

        history.computeIfAbsent(userId, k -> new ArrayList<>()).add(msg);
    }

    // ===================== PUBLIC METHODS =====================

    public void resetConversation(Long userId) {
        if (userId != null) {
            history.remove(userId);
            log.info("Reset conversation for user: {}", userId);
        }
    }

    public List<String> getHistory(Long userId) {
        if (userId == null) {
            return new ArrayList<>();
        }
        return history.getOrDefault(userId, new ArrayList<>());
    }

    public void clearHistory(Long userId) {
        if (userId != null) {
            history.remove(userId);
            log.info("Đã xóa history của user: {}", userId);
        }
    }
}