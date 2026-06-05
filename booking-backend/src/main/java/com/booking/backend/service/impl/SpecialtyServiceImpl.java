package com.booking.backend.service.impl;

import com.booking.backend.dto.SpecialtyResponse;
import com.booking.backend.entity.Specialty;
import com.booking.backend.repository.SpecialtyRepository;
import com.booking.backend.service.SpecialtyService;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SpecialtyServiceImpl implements SpecialtyService {

    private final SpecialtyRepository repository;

    public SpecialtyServiceImpl(SpecialtyRepository repository) {
        this.repository = repository;
    }

    // =========================
    // MAP ENTITY -> DTO
    // =========================
    private SpecialtyResponse map(Specialty s) {

        SpecialtyResponse r = new SpecialtyResponse();

        r.setId(s.getId());
        r.setName(s.getName());
        r.setDescription(s.getDescription());
        r.setPrice(s.getPrice());
        r.setImage(s.getImage());
        r.setActive(s.getActive());
        r.setCreatedAt(s.getCreatedAt());
        r.setUpdatedAt(s.getUpdatedAt());

        return r;
    }

    // =========================
    // CREATE
    // =========================
    @Override
    public SpecialtyResponse createSpecialty(Specialty specialty) {

        // CHECK NAME TRÙNG
        if (repository.existsByName(specialty.getName())) {
            throw new RuntimeException("Tên chuyên khoa đã tồn tại");
        }

        Specialty saved = repository.save(specialty);

        return map(saved);
    }

    // =========================
    // UPDATE
    // =========================
    @Override
    public SpecialtyResponse updateSpecialty(Long id, Specialty specialty) {

        Specialty old = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Specialty not found"));

        // CHECK TRÙNG TÊN
        if (repository.existsByNameAndIdNot(
                specialty.getName(),
                id)) {

            throw new RuntimeException("Tên chuyên khoa đã tồn tại");
        }

        old.setName(specialty.getName());
        old.setDescription(specialty.getDescription());
        old.setPrice(specialty.getPrice());
        old.setImage(specialty.getImage());
        old.setActive(specialty.getActive());

        return map(repository.save(old));
    }

    // =========================
    // GET BY ID
    // =========================
    @Override
    public SpecialtyResponse getById(Long id) {

        Specialty s = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Specialty not found"));

        return map(s);
    }

    // =========================
    // GET ALL
    // =========================
    @Override
    public List<SpecialtyResponse> getAll() {

        return repository.findAll()
                .stream()
                .map(this::map)
                .collect(Collectors.toList());
    }

    // =========================
    // GET ENTITY (internal)
    // =========================
    @Override
    public Specialty getEntityById(Long id) {

        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Specialty not found"));
    }

    // =========================
    // DELETE (HARD DELETE như bạn yêu cầu)
    // =========================
    @Override
    public void delete(Long id) {

        Specialty s = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Specialty not found"));

        repository.delete(s);
    }
}