// BannerServiceImpl.java

package com.booking.backend.service.impl;

import com.booking.backend.entity.Banner;
import com.booking.backend.repository.BannerRepository;
import com.booking.backend.service.BannerService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BannerServiceImpl implements BannerService {

    private final BannerRepository bannerRepository;

    public BannerServiceImpl(BannerRepository bannerRepository) {
        this.bannerRepository = bannerRepository;
    }

    // =========================
    // USER XEM BANNER
    // =========================
    @Override
    public List<Banner> getAllBanners() {
        return bannerRepository.findAll();
    }

    // =========================
    // ADMIN THÊM BANNER
    // =========================
    @Override
    public Banner createBanner(Banner banner) {

        banner.setActive(true);

        return bannerRepository.save(banner);
    }

    @Override
    public Banner updateBanner(Long id, Banner banner) {

        Banner oldBanner = bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banner not found"));

        oldBanner.setTitle(banner.getTitle());
        oldBanner.setDescription(banner.getDescription());
        oldBanner.setImageUrl(banner.getImageUrl());
        oldBanner.setActive(banner.getActive());

        return bannerRepository.save(oldBanner);
    }

    @Override
    public Banner findById(Long id) {
        return bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banner not found"));
    }

    // =========================
    // ADMIN XÓA BANNER
    // =========================
    @Override
    public void deleteBanner(Long id) {
        bannerRepository.deleteById(id);
    }
}