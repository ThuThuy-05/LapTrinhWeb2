// ===============================
// BranchServiceImpl.java
// ===============================

package com.booking.backend.service.impl;

import com.booking.backend.dto.BranchRequest;
import com.booking.backend.entity.Branch;
import com.booking.backend.repository.BranchRepository;
import com.booking.backend.service.BranchService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BranchServiceImpl
                implements BranchService {

        private final BranchRepository branchRepository;

        public BranchServiceImpl(
                        BranchRepository branchRepository) {
                this.branchRepository = branchRepository;
        }

        // =========================
        // GET ALL
        // =========================

        @Override
        public List<Branch> getAllBranches() {

                return branchRepository.findAll();
        }

        // =========================
        // GET BY ID
        // =========================

        @Override
        public Branch getBranchById(Long id) {

                return branchRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Branch not found"));
        }

        // =========================
        // CREATE
        // =========================

        @Override
        public Branch createBranch(
                        BranchRequest request) {

                if (branchRepository.existsByName(
                                request.getName())) {

                        throw new RuntimeException(
                                        "Tên chi nhánh đã tồn tại");
                }

                Branch branch = new Branch();

                branch.setName(request.getName());

                branch.setAddress(request.getAddress());

                branch.setActive(
                                request.getActive() != null
                                                ? request.getActive()
                                                : true);

                return branchRepository.save(branch);
        }

        // =========================
        // UPDATE
        // =========================

        @Override
        public Branch updateBranch(
                        Long id,
                        BranchRequest request) {

                Branch branch = getBranchById(id);

                branchRepository.findByName(request.getName())
                                .ifPresent(existing -> {
                                        if (!existing.getId().equals(id)) {
                                                throw new RuntimeException("Tên chi nhánh đã tồn tại");
                                        }
                                });

                branch.setName(
                                request.getName());

                branch.setAddress(
                                request.getAddress());

                if (request.getActive() != null) {

                        branch.setActive(
                                        request.getActive());
                }

                return branchRepository.save(branch);
        }

        // =========================
        // DELETE
        // =========================

        @Override
        public void deleteBranch(Long id) {

                branchRepository.deleteById(id);
        }
}