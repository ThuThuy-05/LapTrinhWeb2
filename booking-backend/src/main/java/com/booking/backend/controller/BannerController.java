package com.booking.backend.controller;

import com.booking.backend.entity.Banner;
import com.booking.backend.service.BannerService;
import com.cloudinary.Cloudinary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class BannerController {

    private final BannerService bannerService;

    public BannerController(BannerService bannerService) {
        this.bannerService = bannerService;
    }

    // =========================
    // USER / PATIENT XEM BANNER
    // =========================
    @GetMapping("/banners")
    public List<Banner> getAllBanners() {
        return bannerService.getAllBanners();
    }

    // =========================
    // ADMIN THÊM BANNER
    // =========================

    @Autowired
    private Cloudinary cloudinary;

    // =========================
    // UPLOAD CLOUDINARY
    // =========================

    private String uploadToCloudinary(
            MultipartFile file) {

        if (file == null || file.isEmpty()) {
            return null;
        }

        try {

            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    Map.of("folder", "banners"));

            return uploadResult
                    .get("secure_url")
                    .toString();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Upload Cloudinary lỗi: " + e.getMessage());
        }
    }

    // =========================
    // CREATE BANNER
    // =========================

    @PostMapping(value = "admin/banners/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Banner createBanner(

            @RequestParam("file") MultipartFile file,

            @RequestParam("title") String title,

            @RequestParam(value = "description", required = false) String description

    ) {

        if (file == null || file.isEmpty()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Vui lòng chọn ảnh banner");
        }

        Banner banner = new Banner();

        // IMAGE

        banner.setImageUrl(
                uploadToCloudinary(file));

        // TITLE

        banner.setTitle(title);

        // DESCRIPTION

        banner.setDescription(description);

        // ACTIVE

        banner.setActive(true);

        return bannerService.createBanner(banner);
    }

    // PUT MỚI CHỈ CÓ ADMIN MỚI ĐƯỢC SỬA BANNER
    // =========================
    // UPDATE BANNER
    // =========================

    @PutMapping(value = "admin/banners/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Banner updateBanner(

            @PathVariable Long id,

            @RequestParam(value = "file", required = false) MultipartFile file,

            @RequestParam("title") String title,

            @RequestParam(value = "description", required = false) String description,

            @RequestParam(value = "active", required = false) Boolean active

    ) {

        // TÌM BANNER CŨ

        Banner oldBanner = bannerService.findById(id);

        // UPDATE IMAGE

        if (file != null && !file.isEmpty()) {

            oldBanner.setImageUrl(
                    uploadToCloudinary(file));
        }

        // UPDATE TITLE

        oldBanner.setTitle(title);

        // UPDATE DESCRIPTION

        oldBanner.setDescription(description);

        // UPDATE ACTIVE

        if (active != null) {

            oldBanner.setActive(active);
        }

        // SAVE

        return bannerService.updateBanner(
                id,
                oldBanner);
    }

    // =========================
    // ADMIN XÓA BANNER
    // =========================
    @DeleteMapping("/admin/banners/{id}")
    public void deleteBanner(
            @PathVariable Long id) {
        bannerService.deleteBanner(id);
    }
}