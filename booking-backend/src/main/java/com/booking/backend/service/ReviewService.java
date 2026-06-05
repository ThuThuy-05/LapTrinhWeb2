package com.booking.backend.service;

import com.booking.backend.dto.ReviewRequest;
import com.booking.backend.dto.ReviewResponse;
import com.booking.backend.dto.UpdateReviewRequest;
import com.booking.backend.entity.Review;

import java.util.List;

public interface ReviewService {

        ReviewResponse createReview(ReviewRequest request);

        ReviewResponse updateReview(
                        Long reviewId,
                        Long userId,
                        UpdateReviewRequest request);

        void deleteReview(
                        Long reviewId,
                        Long userId);

        List<ReviewResponse> getReviewsByDoctor(Long doctorId);

        List<ReviewResponse> getReviewsByUser(Long userId);

        double getAverageRating(Long doctorId);

        // ReviewResponse mapToResponse(Review saved);
        ReviewResponse mapToResponse(Review review);

}