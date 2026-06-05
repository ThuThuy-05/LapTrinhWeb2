// ===============================
// BranchController.java
// ===============================

package com.booking.backend.controller;

import com.booking.backend.dto.BranchRequest;
import com.booking.backend.entity.Branch;
import com.booking.backend.service.BranchService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class BranchController {

    private final BranchService branchService;

    public BranchController(
            BranchService branchService) {
        this.branchService = branchService;
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
}