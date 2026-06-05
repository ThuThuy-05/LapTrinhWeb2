package com.booking.backend.service.impl;

import com.booking.backend.dto.DoctorRequest;
import com.booking.backend.entity.*;
import com.booking.backend.enums.Role;
import com.booking.backend.repository.*;
import com.booking.backend.service.DoctorService;
import com.booking.backend.service.DoctorExportService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final SpecialtyRepository specialtyRepository;
    private final BranchRepository branchRepository;
    private final PasswordEncoder passwordEncoder;
    private final DoctorExportService doctorExportService;

    public DoctorServiceImpl(
            DoctorRepository doctorRepository,
            UserRepository userRepository,
            SpecialtyRepository specialtyRepository,
            BranchRepository branchRepository,
            PasswordEncoder passwordEncoder,
            DoctorExportService doctorExportService) {
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.specialtyRepository = specialtyRepository;
        this.branchRepository = branchRepository;
        this.passwordEncoder = passwordEncoder;
        this.doctorExportService = doctorExportService;
    }

    // =========================
    // CREATE
    // =========================
    @Override
    public Doctor createDoctor(DoctorRequest request) {

        // =========================
        // 1. CHECK EMAIL TRÙNG
        // =========================
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        // =========================
        // 2. CHECK PHONE TRÙNG
        // =========================
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Số điện thoại đã tồn tại");
        }

        // =========================
        // 3. CHECK USER ĐÃ LÀ BÁC SĨ CHƯA
        // =========================
        User existingUser = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (existingUser != null) {
            boolean alreadyDoctor = doctorRepository.existsByUser(existingUser);

            if (alreadyDoctor) {
                throw new RuntimeException("Người dùng này đã là bác sĩ");
            }
        }

        // =========================
        // 4. LẤY SPECIALTY
        // =========================
        Specialty specialty = specialtyRepository.findById(request.getSpecialtyId())
                .orElseThrow(() -> new RuntimeException("Specialty not found"));

        // =========================
        // 5. LẤY BRANCH
        // =========================
        Branch branch = null;
        if (request.getBranchId() != null) {
            branch = branchRepository.findById(request.getBranchId())
                    .orElseThrow(() -> new RuntimeException("Branch not found"));
        }

        // =========================
        // 6. TẠO USER
        // =========================
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setGender(request.getGender());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setRole(Role.DOCTOR);
        user.setAddress(request.getAddress());
        user.setAvatar(request.getAvatar());

        userRepository.save(user);

        // =========================
        // 7. TẠO DOCTOR
        // =========================
        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setSpecialty(specialty);
        doctor.setBranch(branch);
        doctor.setDegree(request.getDegree());
        doctor.setExperience(request.getExperience());
        doctor.setDescription(request.getDescription());

        return doctorRepository.save(doctor);
    }

    // =========================
    // UPDATE
    // =========================

    @Override
    public Doctor updateDoctor(Long id, DoctorRequest request) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        User user = doctor.getUser();

        // =========================
        // CHECK EMAIL TRÙNG
        // =========================
        if (userRepository.existsByEmailAndIdNot(
                request.getEmail(),
                user.getId())) {

            throw new RuntimeException("Email đã tồn tại");
        }

        // =========================
        // CHECK PHONE TRÙNG
        // =========================
        if (userRepository.existsByPhoneAndIdNot(
                request.getPhone(),
                user.getId())) {

            throw new RuntimeException("Số điện thoại đã tồn tại");
        }

        Specialty specialty = specialtyRepository
                .findById(request.getSpecialtyId())
                .orElseThrow(() -> new RuntimeException("Specialty not found"));

        Branch branch = null;
        if (request.getBranchId() != null) {
            branch = branchRepository.findById(request.getBranchId())
                    .orElseThrow(() -> new RuntimeException("Branch not found"));
        }

        // UPDATE USER
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setGender(request.getGender());
        user.setDateOfBirth(request.getDateOfBirth());

        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }

        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }

        // UPDATE PASSWORD
        if (request.getPassword() != null &&
                !request.getPassword().isBlank()) {

            user.setPassword(
                    passwordEncoder.encode(request.getPassword()));
        }

        userRepository.save(user);

        // UPDATE DOCTOR
        doctor.setSpecialty(specialty);
        doctor.setBranch(branch);
        doctor.setDegree(request.getDegree());
        doctor.setExperience(request.getExperience());
        doctor.setDescription(request.getDescription());

        return doctorRepository.save(doctor);
    }

    // =========================
    // GET ALL
    // =========================

    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // =========================
    // GET BY ID
    // =========================

    @Override
    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    // =========================
    // DELETE
    // =========================

    @Override
    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }

    // =========================
    // EXPORT TO EXCEL
    // =========================

    @Override
    public byte[] exportToExcel(List<Doctor> doctors) {
        return doctorExportService.exportToExcel(doctors);
    }

    // =========================
    // IMPORT FROM EXCEL
    // =========================

    @Override
    public Map<String, Object> importFromExcel(MultipartFile file) {
        return doctorExportService.importFromExcel(file);
    }

    @Override
    public int importDoctors(List<DoctorRequest> doctorRequests) {
        int count = 0;
        for (DoctorRequest request : doctorRequests) {
            try {
                createDoctor(request);
                count++;
            } catch (Exception e) {
                System.err.println("Import doctor failed: " + e.getMessage());
            }
        }
        return count;
    }
}