package com.booking.backend.service;

import com.booking.backend.entity.Banner;

import java.util.List;

public interface BannerService {

    List<Banner> getAllBanners();

    Banner createBanner(Banner banner);

    Banner updateBanner(Long id, Banner banner);

    void deleteBanner(Long id);

    Banner findById(Long id); 
}
