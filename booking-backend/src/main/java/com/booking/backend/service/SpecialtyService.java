package com.booking.backend.service;

import com.booking.backend.dto.SpecialtyResponse;
import com.booking.backend.entity.Specialty;

import java.util.List;

public interface SpecialtyService {

    SpecialtyResponse createSpecialty(Specialty specialty);

    SpecialtyResponse updateSpecialty(Long id, Specialty specialty);

    SpecialtyResponse getById(Long id);

    List<SpecialtyResponse> getAll();

    Specialty getEntityById(Long id);

    void delete(Long id);
}