package com.booking.backend.service;

import com.booking.backend.dto.DoctorProfileRequest;
import com.booking.backend.dto.DoctorRequest;
import com.booking.backend.entity.Doctor;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface DoctorService {

    Doctor createDoctor(DoctorRequest request);

    Doctor updateDoctor(Long id, DoctorRequest request);

    List<Doctor> getAllDoctors();

    Doctor getDoctorById(Long id);

    void deleteDoctor(Long id);

    // =========================
    // EXPORT & IMPORT
    // =========================

    byte[] exportToExcel(List<Doctor> doctors);

    Map<String, Object> importFromExcel(MultipartFile file);

    int importDoctors(List<DoctorRequest> doctorRequests);

    Doctor updateMyProfile(
            String phone,
            DoctorProfileRequest request);

    List<Doctor> getDoctorsByBranch(Long branchId);

}