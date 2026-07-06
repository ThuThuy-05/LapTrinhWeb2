package com.booking.backend.service.impl;

import com.booking.backend.entity.*;
import com.booking.backend.repository.*;
import com.booking.backend.service.HospitalChatbotService;
import com.booking.backend.service.GeminiService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HospitalChatbotServiceImpl implements HospitalChatbotService {

    private final DoctorRepository doctorRepository;
    private final SpecialtyRepository specialtyRepository;
    private final BookingRepository bookingRepository;
    private final ScheduleRepository scheduleRepository;
    private final BranchRepository branchRepository;
    private final ObjectMapper objectMapper;
    private final GeminiService geminiService;

    // Bộ nhớ RAM lưu trữ lịch sử hội thoại tạm thời tránh xung đột đa luồng
    private final Map<Long, List<Map<String, String>>> history = new ConcurrentHashMap<>();

    // ===================== LOGIC CHÍNH XỬ LÝ TIN NHẮN =====================

    @Override
    @Transactional
    public String getResponse(String message, Long userId) {
        if (message == null || message.trim().isEmpty()) {
            return "⚠️ Vui lòng nhập nội dung câu hỏi.";
        }

        String userMsg = message.trim();
        log.info("[Chatbot] Tin nhắn từ User {}: {}", userId, userMsg);

        // 1. Quét dữ liệu nền liên quan từ SQL sang JSON tri thức phục vụ AI
        String knowledgeBaseJson = collectKnowledgeBase(userMsg, userId);
        String conversationHistory = formatHistory(userId);

        // 2. Thiết lập quy tắc hoạt động nghiêm ngặt cho Bot
        String systemInstruction = """
                Bạn là trợ lý ảo AI chuyên nghiệp của Bệnh viện 3T Hospital.
                Nhiệm vụ của bạn là hỗ trợ bệnh nhân dựa trên dữ liệu hệ thống (JSON) được cung cấp dưới đây.

                QUY TẮC QUAN TRỌNG:
                1. ƯU TIÊN sử dụng thông tin trong mục "cau_hoi_thuong_gap_faq" nếu khách hàng hỏi về quy trình, chính sách, bảo hiểm, giờ làm việc chung.
                2. CHỈ trả lời thông tin liên quan đến Bác sĩ, Lịch khám, Giá dịch vụ dựa vào dữ liệu thực tế trong mục "DỮ LIỆU HỆ THỐNG". Tuyệt đối không tự bịa thông tin.
                3. Nếu dữ liệu trống hoặc không tìm thấy thông tin phù hợp với yêu cầu, hãy lịch sự từ chối và hướng dẫn họ gọi đến số hotline 1900-xxxx để được tổng đài viên hỗ trợ.
                4. Trả lời bằng tiếng Việt, giọng điệu ân cần, ngắn gọn, phân tách dòng rõ ràng. Hãy sử dụng định dạng Markdown (In đậm, danh sách dấu chấm tròn, biểu tượng icon) để hiển thị trực quan, chuyên nghiệp.

                DỮ LIỆU HỆ THỐNG (SQL JSON):
                """
                + knowledgeBaseJson + "\n\nLỊCH SỬ CUỘC TRÒ CHUYỆN:\n" + conversationHistory;

        String botResponse;
        try {
            // 3. Gọi trực tiếp sang dịch vụ Gemini API
            botResponse = geminiService.askGemini(userMsg, systemInstruction);
        } catch (Exception e) {
            log.error("❌ Lỗi luồng gọi trợ lý ảo: ", e);
            botResponse = "Xin lỗi bạn, hệ thống kết nối AI đang bận trong giây lát. Vui lòng liên hệ Hotline 1900-xxxx hoặc tải lại trang để thử lại!";
        }

        // 4. Đồng bộ lịch sử hội thoại vào bộ nhớ đệm
        saveMessage(userId, "user", userMsg);
        saveMessage(userId, "model", botResponse);

        return botResponse;
    }

    // ===================== KHAI THÁC THÔNG TIN NỀN (SQL TO JSON)
    // =====================

    private String collectKnowledgeBase(String originalMsg, Long userId) {
        Map<String, Object> knowledge = new HashMap<>();
        String msg = originalMsg.toLowerCase();
        String cleanKeyword = extractName(msg); // Cắt từ khóa cốt lõi sạch sẽ khoảng trắng

        if (msg.contains("bác sĩ") || msg.contains("bs") || msg.contains("khoa") || msg.contains("lịch")
                || cleanKeyword != null) {
            List<Doctor> doctors = new ArrayList<>();

            if (cleanKeyword != null) {
                // Quét liên kết: Khớp theo cả tên bác sĩ HOẶC tên chuyên khoa từ keyword sạch
                doctors = doctorRepository.searchDoctorByTextOrSpecialty(cleanKeyword);
            }

            // FIX: Nếu không tìm thấy đích danh, lọc các bác sĩ thực sự ĐANG CÓ LỊCH ACTIVE
            // sắp tới
            if (doctors.isEmpty()) {
                doctors = doctorRepository.findDoctorsWithUpcomingSchedules(LocalDate.now());
            }

            // Dự phòng cuối cùng nếu hệ thống trống lịch hoàn toàn
            if (doctors.isEmpty()) {
                doctors = doctorRepository.findAll();
            }

            List<Map<String, Object>> docData = doctors.stream().limit(6).map(d -> {
                Map<String, Object> map = new HashMap<>();
                User u = d.getUser();
                map.put("id", d.getId());
                map.put("ten_bac_si", u != null ? (u.getFirstName() + " " + u.getLastName()).trim() : "N/A");
                map.put("chuyen_khoa", d.getSpecialty() != null ? d.getSpecialty().getName() : "N/A");
                map.put("chi_nhanh", d.getBranch() != null ? d.getBranch().getName() : "N/A");
                map.put("kinh_nghiem", d.getExperience() + " năm");
                map.put("bang_cap", d.getDegree());

                // Lấy chi tiết danh sách khung giờ trống của bác sĩ này
                List<Schedule> schedules = scheduleRepository.findAvailableSchedulesByDoctor(d.getId(),
                        LocalDate.now());
                map.put("cac_suat_lich_trong_sap_toi", schedules.stream()
                        .map(s -> formatDate(s.getDate()) + " [" + s.getTimeStart() + " - " + s.getTimeEnd() + "]")
                        .collect(Collectors.toList()));
                return map;
            }).collect(Collectors.toList());

            knowledge.put("danh_sach_bac_si_va_lich_trinh", docData);
        }

        if (msg.contains("khoa") || msg.contains("giá") || msg.contains("phí") || msg.contains("tiền")
                || cleanKeyword != null) {
            List<Specialty> specialties = new ArrayList<>();

            if (cleanKeyword != null) {
                specialties = specialtyRepository.findByNameContainingIgnoreCase(cleanKeyword);
            }
            if (specialties.isEmpty()) {
                specialties = specialtyRepository.findSpecialtiesWithPrice();
            }
            if (specialties.isEmpty()) {
                specialties = specialtyRepository.findAll();
            }

            knowledge.put("chuyen_khoa_va_gia_dich_vu", specialties.stream().map(s -> {
                Map<String, Object> map = new HashMap<>();
                map.put("ten_chuyen_khoa", s.getName());
                map.put("gia_tien_kham",
                        s.getPrice() != null ? String.format("%,d", s.getPrice()) + "đ" : "Chưa cập nhật");
                map.put("mo_ta_khoa", s.getDescription());
                return map;
            }).collect(Collectors.toList()));
        }

        if (msg.contains("chi nhánh") || msg.contains("địa điểm") || msg.contains("cơ sở") || msg.contains("ở đâu")
                || msg.contains("địa chỉ") || cleanKeyword != null) {
            List<Branch> branches = new ArrayList<>();

            if (cleanKeyword != null) {
                // Tìm kiếm thông minh dựa theo keyword địa danh hoặc tên cơ sở hành chính
                branches = branchRepository.searchBranchByKeyword(cleanKeyword);
            }
            if (branches.isEmpty()) {
                branches = branchRepository.findByActiveTrue();
            }

            List<Map<String, Object>> branchData = branches.stream().map(b -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id_chi_nhanh", b.getId());
                map.put("ten_chi_nhanh", b.getName());
                map.put("dia_chi_chi_tiet", b.getAddress());

                // Lấy ra tất cả bác sĩ đang trực thuộc chi nhánh tương ứng
                List<Doctor> doctorsInBranch = doctorRepository.findByBranch_Id(b.getId());
                map.put("danh_sach_ten_bac_si_thuoc_chi_nhanh", doctorsInBranch.stream()
                        .map(d -> d.getUser() != null
                                ? (d.getUser().getFirstName() + " " + d.getUser().getLastName()).trim()
                                : "N/A")
                        .collect(Collectors.toList()));

                return map;
            }).collect(Collectors.toList());

            knowledge.put("cac_co_so_chi_nhanh_va_bac_si_dai_dien", branchData);
        }

        if ((msg.contains("lịch của tôi") || msg.contains("lịch hẹn") || msg.contains("kiểm tra lịch")
                || msg.contains("đã đặt"))
                && userId != null && userId > 0) {
            List<Booking> bookings = bookingRepository.findUpcomingBookings(userId, LocalDate.now());
            knowledge.put("lich_su_dat_hen_cua_benh_nhan_nay", bookings.stream().map(b -> {
                Map<String, Object> map = new HashMap<>();
                map.put("ma_phieu_kham", b.getId());
                map.put("ngay_hen_kham", b.getBookingDate());
                map.put("khung_gio",
                        b.getSchedule() != null ? b.getSchedule().getTimeStart() + " - " + b.getSchedule().getTimeEnd()
                                : "N/A");
                map.put("trang_thai_phieu", b.getStatus());
                return map;
            }).collect(Collectors.toList()));
        }

        try {
            return objectMapper.writeValueAsString(knowledge);
        } catch (Exception e) {
            log.error("❌ Lỗi chuyển đổi cấu trúc SQL sang chuỗi JSON: ", e);
            return "{}";
        }
    }

    // ===================== PHƯƠNG THỨC BỔ TRỢ PHÂN TÍCH DỮ LIỆU
    // =====================

    private String extractName(String msg) {
        if (msg == null)
            return null;
        // Chuyển chuỗi đầu vào về dạng viết thường và loại bỏ tạp từ trước khi .trim()
        // phá khoảng trắng thừa
        String cleaned = msg.toLowerCase()
                .replace("bác sĩ", "").replace("bs", "").replace("doctor", "")
                .replace("lịch trống", "").replace("lịch rảnh", "").replace("lịch", "")
                .replace("làm việc", "").replace("tìm", "").replace("xem", "")
                .replace("khoa", "").replace("phòng", "").replace("hỏi", "").replace("cho", "")
                .trim();

        return cleaned.isEmpty() ? null : cleaned;
    }

    private String formatDate(LocalDate date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy (EEEE)", new Locale("vi"));
        return date.format(formatter);
    }

    // ===================== QUẢN LÝ LỊCH SỬ ĐỆM TRÊN RAM =====================

    private void saveMessage(Long userId, String role, String content) {
        if (userId == null)
            return;
        Map<String, String> msgNode = new HashMap<>();
        msgNode.put("role", role);
        msgNode.put("content", content);

        List<Map<String, String>> userHistory = history.computeIfAbsent(userId, k -> new ArrayList<>());
        userHistory.add(msgNode);

        // Tránh quá tải RAM khi người dùng trò chuyện quá lâu (Giữ lại 20 dòng gần
        // nhất)
        if (userHistory.size() > 20) {
            userHistory.remove(0);
        }
    }

    private String formatHistory(Long userId) {
        if (userId == null || !history.containsKey(userId))
            return "";
        return history.get(userId).stream()
                .map(m -> m.get("role").toUpperCase() + ": " + m.get("content"))
                .collect(Collectors.joining("\n"));
    }

    @Override
    public void resetConversation(Long userId) {
        if (userId != null) {
            history.remove(userId);
            log.info("[Chatbot] Đã làm mới hoàn toàn phiên trò chuyện tạm thời của user: {}", userId);
        }
    }

    @Override
    public List<String> getHistory(Long userId) {
        if (userId == null || !history.containsKey(userId)) {
            return new ArrayList<>();
        }
        return history.get(userId).stream()
                .map(m -> m.get("content"))
                .collect(Collectors.toList());
    }

    @Override
    public void clearHistory(Long userId) {
        if (userId != null) {
            history.remove(userId);
            log.info("[Chatbot] Đã xóa vĩnh viễn bộ nhớ lịch sử của user: {}", userId);
        }
    }
}