package com.booking.backend.controller;

import com.booking.backend.dto.DoctorRequest;
import com.booking.backend.entity.Doctor;
import com.booking.backend.enums.Gender;
import com.booking.backend.service.DoctorService;
import com.cloudinary.Cloudinary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class DoctorController {

        @Autowired
        private DoctorService doctorService;

        @Autowired
        private Cloudinary cloudinary;

        // =========================
        // UPLOAD CLOUDINARY
        // =========================

        private String uploadToCloudinary(MultipartFile file) {

                if (file == null || file.isEmpty()) {
                        return null;
                }

                try {

                        Map<?, ?> uploadResult = cloudinary.uploader().upload(
                                        file.getBytes(),
                                        Map.of(
                                                        "folder",
                                                        "doctors"));

                        return uploadResult
                                        .get("secure_url")
                                        .toString();

                } catch (Exception e) {

                        throw new RuntimeException(
                                        "Upload Cloudinary lỗi: "
                                                        + e.getMessage());
                }
        }

        // =========================
        // CREATE DOCTOR
        // =========================

        @PostMapping(value = "/admin/doctors", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public Doctor createDoctor(

                        @RequestParam(value = "file", required = false) MultipartFile file,

                        @RequestParam String firstName,
                        @RequestParam String lastName,
                        @RequestParam String email,
                        @RequestParam String phone,
                        @RequestParam String password,
                        @RequestParam String gender,
                        @RequestParam String dateOfBirth,
                        @RequestParam String address,

                        @RequestParam Long specialtyId,
                        @RequestParam Long branchId,

                        @RequestParam String degree,

                        @RequestParam Integer experience,

                        @RequestParam String description

        ) {

                DoctorRequest request = new DoctorRequest();

                request.setFirstName(firstName);

                request.setLastName(lastName);

                request.setEmail(email);

                request.setPhone(phone);

                request.setPassword(password);

                request.setGender(
                                Gender.valueOf(gender));

                request.setDateOfBirth(
                                LocalDate.parse(dateOfBirth));

                request.setAddress(address);

                request.setSpecialtyId(
                                specialtyId);

                request.setBranchId(
                                branchId);

                request.setDegree(
                                degree);

                request.setExperience(
                                experience);

                request.setDescription(
                                description);

                // =========================
                // AVATAR
                // =========================

                String avatar = uploadToCloudinary(file);

                request.setAvatar(avatar);

                return doctorService.createDoctor(request);
        }

        // =========================
        // UPDATE DOCTOR
        // =========================

        @PutMapping(value = "/admin/doctors/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public Doctor updateDoctor(

                        @PathVariable Long id,

                        @RequestParam(value = "file", required = false) MultipartFile file,

                        // USER
                        @RequestParam String firstName,
                        @RequestParam String lastName,
                        @RequestParam String email,
                        @RequestParam String phone,

                        @RequestParam(required = false) String password,

                        @RequestParam String gender,

                        @RequestParam String dateOfBirth,
                        @RequestParam String address,

                        // DOCTOR
                        @RequestParam Long specialtyId,

                        @RequestParam Long branchId,

                        @RequestParam String degree,

                        @RequestParam Integer experience,

                        @RequestParam String description

        ) {

                DoctorRequest request = new DoctorRequest();

                // USER

                request.setFirstName(firstName);

                request.setLastName(lastName);

                request.setEmail(email);

                request.setPhone(phone);

                request.setPassword(password);

                request.setGender(
                                Gender.valueOf(gender));

                request.setDateOfBirth(
                                LocalDate.parse(dateOfBirth));
                // request.setDateOfBirth(
                // LocalDate.parse(dateOfBirth));
                request.setAddress(address);

                // DOCTOR

                request.setSpecialtyId(
                                specialtyId);

                request.setBranchId(
                                branchId);

                request.setDegree(
                                degree);

                request.setExperience(
                                experience);

                request.setDescription(
                                description);

                // AVATAR
                // =========================
                // AVATAR
                // =========================

                if (file != null && !file.isEmpty()) {

                        String avatar = uploadToCloudinary(file);

                        request.setAvatar(avatar);
                }

                return doctorService
                                .updateDoctor(id, request);
        }

        // =========================
        // GET ALL DOCTORS
        // =========================

        @GetMapping("/doctors")
        public List<Doctor> getAllDoctors() {

                return doctorService
                                .getAllDoctors();
        }

        // =========================
        // GET DOCTOR BY ID
        // =========================

        @GetMapping("/doctors/{id}")
        public Doctor getDoctorById(
                        @PathVariable Long id) {

                return doctorService
                                .getDoctorById(id);
        }

        // =========================
        // DELETE DOCTOR
        // =========================

        @DeleteMapping("/admin/doctors/{id}")
        public String deleteDoctor(
                        @PathVariable Long id) {

                doctorService.deleteDoctor(id);

                return "Delete doctor successfully";
        }

        // =========================
        // EXPORT TO EXCEL
        // =========================

        @GetMapping("/admin/doctors/export")
        public ResponseEntity<byte[]> exportDoctorsToExcel() {
                try {
                        List<Doctor> doctors = doctorService.getAllDoctors();
                        byte[] excelData = doctorService.exportToExcel(doctors);

                        HttpHeaders headers = new HttpHeaders();
                        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                        headers.setContentDispositionFormData("attachment", "danh_sach_bac_si.xlsx");

                        return new ResponseEntity<>(excelData, headers, HttpStatus.OK);
                } catch (Exception e) {
                        throw new RuntimeException("Export failed: " + e.getMessage());
                }
        }

        // =========================
        // IMPORT FROM EXCEL - TRẢ VỀ CHI TIẾT LỖI
        // =========================

        @PostMapping(value = "/admin/doctors/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<?> importDoctorsFromExcel(
                        @RequestParam("file") MultipartFile file) {
                try {
                        Map<String, Object> result = doctorService.importFromExcel(file);

                        @SuppressWarnings("unchecked")
                        List<DoctorRequest> doctors = (List<DoctorRequest>) result.get("doctors");

                        int imported = doctorService.importDoctors(doctors);

                        Map<String, Object> response = new HashMap<>();
                        response.put("success", imported);
                        response.put("total", result.get("total"));
                        response.put("errors", result.get("errors"));

                        if (imported == 0) {
                                response.put("message", "Import thất bại! Không có bác sĩ nào được thêm.");
                        } else if (imported < (int) result.get("total")) {
                                response.put("message", "Import thành công " + imported + "/" + result.get("total")
                                                + " bác sĩ. Có " + ((List<?>) result.get("errors")).size() + " lỗi.");
                        } else {
                                response.put("message", "Import thành công " + imported + " bác sĩ!");
                        }

                        return ResponseEntity.ok(response);

                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(Map.of("error", e.getMessage()));
                }
        }
}