package com.booking.backend.controller;

import com.booking.backend.dto.ReviewRequest;
import com.booking.backend.dto.ReviewResponse;
import com.booking.backend.dto.UpdateReviewRequest;
import com.booking.backend.entity.Review;
import com.booking.backend.service.ReviewService;
import com.booking.backend.repository.ReviewRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final ReviewRepository reviewRepository;

    @PostMapping
    public ReviewResponse create(
            @RequestBody ReviewRequest request) {

        return reviewService.createReview(request);
    }

    @PutMapping("/{reviewId}")
    public ReviewResponse update(
            @PathVariable Long reviewId,
            @RequestParam Long userId,
            @RequestBody UpdateReviewRequest request) {

        return reviewService.updateReview(
                reviewId,
                userId,
                request);
    }

    @DeleteMapping("/{reviewId}")
    public String delete(
            @PathVariable Long reviewId,
            @RequestParam Long userId) {

        reviewService.deleteReview(
                reviewId,
                userId);

        return "Xóa đánh giá thành công";
    }

    @GetMapping("/doctor/{doctorId}")
    public List<ReviewResponse> getByDoctor(
            @PathVariable Long doctorId) {

        return reviewService.getReviewsByDoctor(doctorId);
    }

    @GetMapping("/user/{userId}")
    public List<ReviewResponse> getByUser(
            @PathVariable Long userId) {

        return reviewService.getReviewsByUser(userId);
    }

    @GetMapping("/doctor/{doctorId}/average")
    public double average(
            @PathVariable Long doctorId) {

        return reviewService.getAverageRating(doctorId);
    }

    @PutMapping("/admin/reviews/{id}/hide")
    public ReviewResponse hide(@PathVariable Long id) {
        Review r = reviewRepository.findById(id).orElseThrow();
        r.setIsHidden(true);
        Review saved = reviewRepository.save(r);
        return reviewService.mapToResponse(saved); // ✅ Giờ sẽ hoạt động
    }

    @PutMapping("/admin/reviews/{id}/show")
    public ReviewResponse show(@PathVariable Long id) {
        Review r = reviewRepository.findById(id).orElseThrow();
        r.setIsHidden(false);
        Review saved = reviewRepository.save(r);
        return reviewService.mapToResponse(saved); // ✅ Giờ sẽ hoạt động
    }
}