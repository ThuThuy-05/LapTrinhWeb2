package com.booking.backend.service;

import com.booking.backend.dto.DoctorRequest;
import com.booking.backend.entity.*;
import com.booking.backend.enums.Gender;
import com.booking.backend.repository.BranchRepository;
import com.booking.backend.repository.SpecialtyRepository;
import com.booking.backend.repository.UserRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class DoctorExportService {

    @Autowired
    private SpecialtyRepository specialtyRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private UserRepository userRepository;

    // =========================
    // EXPORT TO EXCEL - CÓ CỘT ẢNH
    // =========================
    public byte[] exportToExcel(List<Doctor> doctors) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Danh sách bác sĩ");

            Row headerRow = sheet.createRow(0);
            String[] headers = {
                    "STT", "Họ và tên đệm", "Tên", "Email", "Số điện thoại",
                    "Giới tính", "Ngày sinh", "Địa chỉ", "Chuyên khoa",
                    "Chi nhánh", "Bằng cấp", "Kinh nghiệm (năm)", "Mô tả", "URL ảnh"
            };

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
                sheet.setColumnWidth(i, i == 13 ? 8000 : 5000);
            }

            int rowNum = 1;
            for (int i = 0; i < doctors.size(); i++) {
                Doctor doctor = doctors.get(i);
                User user = doctor.getUser();
                Row row = sheet.createRow(rowNum++);

                row.createCell(0).setCellValue(i + 1);
                row.createCell(1).setCellValue(getValueOrEmpty(user.getLastName()));
                row.createCell(2).setCellValue(getValueOrEmpty(user.getFirstName()));
                row.createCell(3).setCellValue(getValueOrEmpty(user.getEmail()));
                row.createCell(4).setCellValue(getValueOrEmpty(user.getPhone()));
                row.createCell(5).setCellValue(user.getGender() != null ? user.getGender().toString() : "");
                row.createCell(6).setCellValue(user.getDateOfBirth() != null ? user.getDateOfBirth().toString() : "");
                row.createCell(7).setCellValue(getValueOrEmpty(user.getAddress()));
                row.createCell(8).setCellValue(doctor.getSpecialty() != null ? doctor.getSpecialty().getName() : "");
                row.createCell(9).setCellValue(doctor.getBranch() != null ? doctor.getBranch().getName() : "");
                row.createCell(10).setCellValue(getValueOrEmpty(doctor.getDegree()));
                row.createCell(11).setCellValue(doctor.getExperience() != null ? doctor.getExperience() : 0);
                row.createCell(12).setCellValue(getValueOrEmpty(doctor.getDescription()));
                row.createCell(13).setCellValue(getValueOrEmpty(user.getAvatar()));
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Lỗi xuất Excel: " + e.getMessage());
        }
    }

    // =========================
    // IMPORT FROM EXCEL - BÁO LỖI CHI TIẾT
    // =========================
    public Map<String, Object> importFromExcel(MultipartFile file) {
        List<DoctorRequest> doctorRequests = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        int successCount = 0;

        try (InputStream inputStream = file.getInputStream();
                Workbook workbook = new XSSFWorkbook(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);
            if (sheet == null) {
                throw new RuntimeException("Không tìm thấy sheet trong file Excel");
            }

            Row headerRow = sheet.getRow(0);
            if (headerRow == null) {
                throw new RuntimeException("File Excel không có header row");
            }

            // Map tên cột sang index - ĐỌC LINH HOẠT THEO TÊN CỘT
            Map<String, Integer> columnIndex = new HashMap<>();
            for (Cell cell : headerRow) {
                String cellValue = getCellValue(cell);
                columnIndex.put(cellValue, cell.getColumnIndex());
            }

            // Kiểm tra các cột bắt buộc
            String[] requiredColumns = { "Email", "Số điện thoại", "Chuyên khoa" };
            for (String col : requiredColumns) {
                if (!columnIndex.containsKey(col)) {
                    throw new RuntimeException("Thiếu cột bắt buộc: '" + col + "' trong file Excel");
                }
            }

            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            DateTimeFormatter dateFormatter2 = DateTimeFormatter.ofPattern("dd/MM/yyyy");

            for (int rowNum = 1; rowNum <= sheet.getLastRowNum(); rowNum++) {
                Row row = sheet.getRow(rowNum);
                if (row == null)
                    continue;

                int currentRow = rowNum + 1;
                List<String> rowErrors = new ArrayList<>();

                try {
                    // Đọc dữ liệu theo tên cột (linh hoạt)
                    String lastName = getCellValue(row.getCell(columnIndex.getOrDefault("Họ và tên đệm", 1)));
                    String firstName = getCellValue(row.getCell(columnIndex.getOrDefault("Tên", 2)));
                    String email = getCellValue(row.getCell(columnIndex.getOrDefault("Email", 3)));
                    String phone = getCellValue(row.getCell(columnIndex.getOrDefault("Số điện thoại", 4)));
                    String gender = getCellValue(row.getCell(columnIndex.getOrDefault("Giới tính", 5)));
                    String dateOfBirth = getCellValue(row.getCell(columnIndex.getOrDefault("Ngày sinh", 6)));
                    String address = getCellValue(row.getCell(columnIndex.getOrDefault("Địa chỉ", 7)));
                    String specialtyName = getCellValue(row.getCell(columnIndex.getOrDefault("Chuyên khoa", 8)));
                    String branchName = getCellValue(row.getCell(columnIndex.getOrDefault("Chi nhánh", 9)));
                    String degree = getCellValue(row.getCell(columnIndex.getOrDefault("Bằng cấp", 10)));
                    String experienceStr = getCellValue(row.getCell(columnIndex.getOrDefault("Kinh nghiệm (năm)", 11)));
                    String description = getCellValue(row.getCell(columnIndex.getOrDefault("Mô tả", 12)));
                    String avatarUrl = getCellValue(row.getCell(columnIndex.getOrDefault("URL ảnh", 13)));

                    // Nếu email trống thì bỏ qua dòng (có thể dòng trống)
                    if (email.isEmpty()) {
                        continue;
                    }

                    // 1. Kiểm tra họ và tên
                    if (lastName.isEmpty()) {
                        rowErrors.add("Thiếu họ");
                    }
                    if (firstName.isEmpty()) {
                        rowErrors.add("Thiếu tên");
                    }

                    // 2. Kiểm tra email
                    if (email.isEmpty()) {
                        rowErrors.add("Thiếu email");
                    } else if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                        rowErrors.add("Email không hợp lệ: '" + email + "'");
                    } else if (userRepository.existsByEmail(email)) {
                        rowErrors.add("Email '" + email + "' đã tồn tại");
                    }

                    // 3. Kiểm tra số điện thoại
                    String originalPhone = phone;
                    if (phone.isEmpty()) {
                        rowErrors.add("Thiếu số điện thoại");
                    } else {
                        // Xử lý số điện thoại
                        phone = phone.replaceAll("[^0-9]", ""); // Chỉ giữ số
                        if (phone.length() == 9) {
                            phone = "0" + phone;
                        }
                        if (phone.length() != 10) {
                            rowErrors.add("Số điện thoại không hợp lệ (phải 10 số): '" + originalPhone + "'");
                        } else if (userRepository.existsByPhone(phone)) {
                            rowErrors.add("Số điện thoại '" + phone + "' đã tồn tại");
                        }
                    }

                    // 4. Kiểm tra giới tính
                    Gender genderEnum = null;
                    if (gender.isEmpty()) {
                        rowErrors.add("Thiếu giới tính (MALE/FEMALE)");
                    } else {
                        try {
                            genderEnum = Gender.valueOf(gender.toUpperCase());
                        } catch (Exception e) {
                            rowErrors.add("Giới tính không hợp lệ (phải là MALE hoặc FEMALE)");
                        }
                    }

                    // 5. Kiểm tra ngày sinh
                    LocalDate dob = null;
                    if (dateOfBirth.isEmpty()) {
                        rowErrors.add("Thiếu ngày sinh");
                    } else {
                        try {
                            dob = LocalDate.parse(dateOfBirth, dateFormatter);
                        } catch (DateTimeParseException e1) {
                            try {
                                dob = LocalDate.parse(dateOfBirth, dateFormatter2);
                            } catch (DateTimeParseException e2) {
                                rowErrors.add("Ngày sinh không hợp lệ (định dạng yyyy-MM-dd hoặc dd/MM/yyyy): '"
                                        + dateOfBirth + "'");
                            }
                        }
                    }

                    // 6. Kiểm tra chuyên khoa
                    Specialty specialty = null;
                    if (specialtyName.isEmpty()) {
                        rowErrors.add("Thiếu tên chuyên khoa");
                    } else {
                        Optional<Specialty> specialtyOpt = specialtyRepository.findByName(specialtyName);
                        if (specialtyOpt.isEmpty()) {
                            rowErrors.add("Không tìm thấy chuyên khoa '" + specialtyName + "'");
                        } else {
                            specialty = specialtyOpt.get();
                        }
                    }

                    // 7. Kiểm tra chi nhánh (không bắt buộc)
                    Branch branch = null;
                    if (!branchName.isEmpty()) {
                        Optional<Branch> branchOpt = branchRepository.findByName(branchName);
                        if (branchOpt.isEmpty()) {
                            rowErrors.add("Không tìm thấy chi nhánh '" + branchName + "'");
                        } else {
                            branch = branchOpt.get();
                        }
                    }

                    // 8. Kiểm tra bằng cấp
                    if (degree.isEmpty()) {
                        rowErrors.add("Thiếu bằng cấp");
                    }

                    // 9. Kiểm tra kinh nghiệm
                    int experience = 0;
                    if (experienceStr.isEmpty()) {
                        rowErrors.add("Thiếu kinh nghiệm");
                    } else {
                        try {
                            experience = Integer.parseInt(experienceStr);
                        } catch (Exception e) {
                            rowErrors.add("Kinh nghiệm phải là số");
                        }
                    }

                    // Nếu có lỗi thì ghi lại và bỏ qua
                    if (!rowErrors.isEmpty()) {
                        errors.add("Dòng " + currentRow + ": " + String.join(", ", rowErrors));
                        continue;
                    }

                    // Tạo DoctorRequest
                    DoctorRequest request = new DoctorRequest();
                    request.setLastName(lastName);
                    request.setFirstName(firstName);
                    request.setEmail(email);
                    request.setPhone(phone);
                    request.setPassword("123456");
                    request.setGender(genderEnum);
                    request.setDateOfBirth(dob);
                    request.setAddress(address);
                    request.setSpecialtyId(specialty.getId());
                    request.setBranchId(branch != null ? branch.getId() : null);
                    request.setDegree(degree);
                    request.setExperience(experience);
                    request.setDescription(description);
                    request.setAvatar(avatarUrl.isEmpty() ? null : avatarUrl);

                    doctorRequests.add(request);
                    successCount++;

                } catch (Exception e) {
                    errors.add("Dòng " + currentRow + ": Lỗi - " + e.getMessage());
                }
            }

            Map<String, Object> result = new HashMap<>();
            result.put("success", successCount);
            result.put("total", successCount + errors.size());
            result.put("errors", errors);
            result.put("doctors", doctorRequests);

            return result;

        } catch (Exception e) {
            throw new RuntimeException("Lỗi đọc file Excel: " + e.getMessage());
        }
    }

    // Helper methods
    private String getCellValue(Cell cell) {
        if (cell == null)
            return "";
        switch (cell.getCellType()) {
            case STRING:
                String value = cell.getStringCellValue();
                return value != null ? value.trim() : "";
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getLocalDateTimeCellValue().toLocalDate().toString();
                }
                double numValue = cell.getNumericCellValue();
                if (numValue == (long) numValue) {
                    return String.format("%.0f", numValue);
                }
                return String.valueOf(numValue);
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                try {
                    return String.valueOf(cell.getNumericCellValue());
                } catch (Exception e) {
                    return cell.getStringCellValue();
                }
            default:
                return "";
        }
    }

    private String getValueOrEmpty(String value) {
        return value != null ? value : "";
    }
}