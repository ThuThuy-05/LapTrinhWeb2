package com.booking.backend.controller;

import com.booking.backend.dto.SpecialtyResponse;
import com.booking.backend.entity.Specialty;
import com.booking.backend.service.SpecialtyService;
import com.cloudinary.Cloudinary;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class SpecialtyController {

    private final SpecialtyService specialtyService;
    private final Cloudinary cloudinary;

    public SpecialtyController(
            SpecialtyService specialtyService,
            Cloudinary cloudinary) {

        this.specialtyService = specialtyService;
        this.cloudinary = cloudinary;
    }

    // =========================
    // UPLOAD
    // =========================
    private String uploadToCloudinary(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            return null;
        }

        try {

            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    Map.of("folder", "specialties"));

            return uploadResult.get("secure_url").toString();

        } catch (Exception e) {
            throw new RuntimeException("Upload lỗi: " + e.getMessage());
        }
    }

    // =========================
    // CREATE
    // =========================
    @PostMapping(value = "/admin/specialties", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public SpecialtyResponse create(

            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("price") Integer price) {

        Specialty s = new Specialty();

        s.setName(name);
        s.setDescription(description);
        s.setPrice(price);
        s.setImage(uploadToCloudinary(file));
        s.setActive(true);

        return specialtyService.createSpecialty(s);
    }

    // =========================
    // UPDATE
    // =========================
    @PutMapping(value = "/admin/specialties/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public SpecialtyResponse update(

            @PathVariable Long id,

            @RequestParam(value = "file", required = false) MultipartFile file,

            @RequestParam("name") String name,

            @RequestParam(value = "description", required = false) String description,

            @RequestParam("price") Integer price,

            @RequestParam(value = "active", required = false) Boolean active) {

        Specialty old = specialtyService.getEntityById(id);

        old.setName(name);
        old.setDescription(description);
        old.setPrice(price);

        if (file != null && !file.isEmpty()) {
            old.setImage(uploadToCloudinary(file));
        }

        if (active != null) {
            old.setActive(active);
        }

        return specialtyService.updateSpecialty(id, old);
    }

    // =========================
    // GET ALL
    // =========================
    @GetMapping("/specialties")
    public List<SpecialtyResponse> getAll() {
        return specialtyService.getAll();
    }

    // =========================
    // GET BY ID
    // =========================
    @GetMapping("/specialties/{id}")
    public SpecialtyResponse getById(@PathVariable Long id) {
        return specialtyService.getById(id);
    }

    // =========================
    // DELETE
    // =========================
    @DeleteMapping("/admin/specialties/{id}")
    public String delete(@PathVariable Long id) {

        specialtyService.delete(id);

        return "Deleted successfully";
    }
}