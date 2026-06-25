// ===============================
// BranchController.java
// ===============================

package com.booking.backend.controller;

import com.booking.backend.dto.BranchRequest;
import com.booking.backend.entity.Branch;
import com.booking.backend.entity.Doctor;
import com.booking.backend.repository.DoctorRepository;
import com.booking.backend.service.BranchService;
import com.booking.backend.service.DoctorService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class BranchController {

    private final BranchService branchService;

    private final DoctorService doctorService;

    private final DoctorRepository doctorRepository;

    public BranchController(
            BranchService branchService,
            DoctorService doctorService,
            DoctorRepository doctorRepository) {
        this.branchService = branchService;
        this.doctorService = doctorService;
        this.doctorRepository = doctorRepository;
    }

    // =========================
    // GET ALL
    // =========================

    @GetMapping("/branches")
    public List<Branch> getAllBranches() {

        return branchService.getAllBranches();
    }

    // =========================
    // GET BY ID
    // =========================

    @GetMapping("/branches/{id}")
    public Branch getBranchById(
            @PathVariable Long id) {

        return branchService.getBranchById(id);
    }

    // =========================
    // CREATE
    // =========================

    @PostMapping("/admin/branches")
    public Branch createBranch(
            @RequestBody BranchRequest request) {

        return branchService.createBranch(request);
    }

    // =========================
    // UPDATE
    // =========================

    @PutMapping("/admin/branches/{id}")
    public Branch updateBranch(
            @PathVariable Long id,
            @RequestBody BranchRequest request) {

        return branchService.updateBranch(id, request);
    }

    // =========================
    // DELETE
    // =========================

    @DeleteMapping("/admin/branches/{id}")
    public void deleteBranch(
            @PathVariable Long id) {

        branchService.deleteBranch(id);
    }

    @GetMapping("/branches/{branchId}/doctors")
    public ResponseEntity<List<Doctor>> getDoctorsByBranch(
            @PathVariable Long branchId) {

        return ResponseEntity.ok(
                doctorService.getDoctorsByBranch(branchId));
    }

}