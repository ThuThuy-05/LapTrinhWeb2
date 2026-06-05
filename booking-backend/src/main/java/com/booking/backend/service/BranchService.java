// ===============================
// BranchService.java
// ===============================

package com.booking.backend.service;

import com.booking.backend.dto.BranchRequest;
import com.booking.backend.entity.Branch;

import java.util.List;

public interface BranchService {

    List<Branch> getAllBranches();

    Branch getBranchById(Long id);

    Branch createBranch(BranchRequest request);

    Branch updateBranch(Long id, BranchRequest request);

    void deleteBranch(Long id);
}