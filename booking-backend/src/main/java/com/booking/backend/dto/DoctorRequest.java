package com.booking.backend.dto;

import com.booking.backend.enums.Gender;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
public class DoctorRequest {

    // USER

    @NotBlank(message = "Họ không được để trống")
    private String firstName;

    @NotBlank(message = "Tên không được để trống")
    private String lastName;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^0\\d{9}$", message = "Số điện thoại phải bắt đầu bằng 0 và gồm 10 số")
    private String phone;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, max = 50, message = "Mật khẩu phải từ 6 đến 50 ký tự")
    private String password;

    @NotNull(message = "Giới tính không được để trống")
    private Gender gender;

    @NotNull(message = "Ngày sinh không được để trống")
    private LocalDate dateOfBirth;

    private String avatar;

    private Boolean active;

    @NotBlank(message = "Địa chỉ không được để trống")
    @Size(max = 255, message = "Địa chỉ không được vượt quá 255 ký tự")
    private String address;

    // DOCTOR

    @NotNull(message = "Vui lòng chọn chuyên khoa")
    private Long specialtyId;

    @NotNull(message = "Vui lòng chọn chi nhánh")
    private Long branchId;

    @NotBlank(message = "Học vị không được để trống")
    private String degree;

    @NotNull(message = "Kinh nghiệm không được để trống")
    @Min(value = 0, message = "Kinh nghiệm phải lớn hơn hoặc bằng 0")
    @Max(value = 60, message = "Kinh nghiệm không hợp lệ")
    private Integer experience;

    @NotBlank(message = "Mô tả không được để trống")
    @Size(min = 20, max = 5000, message = "Mô tả phải từ 20 đến 5000 ký tự")
    private String description;

    private MultipartFile file;
}