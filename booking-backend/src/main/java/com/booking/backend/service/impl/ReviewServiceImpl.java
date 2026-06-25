package com.booking.backend.service.impl;

import com.booking.backend.dto.ReviewRequest;
import com.booking.backend.dto.ReviewResponse;
import com.booking.backend.dto.UpdateReviewRequest;
import com.booking.backend.entity.Doctor;
import com.booking.backend.entity.Review;
import com.booking.backend.entity.User;
import com.booking.backend.enums.BookingStatus;
import com.booking.backend.repository.ReviewRepository;
import com.booking.backend.repository.UserRepository;
import com.booking.backend.repository.DoctorRepository;
import com.booking.backend.service.ReviewService;
import com.booking.backend.repository.BookingRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final BookingRepository bookingRepository;

    public ReviewServiceImpl(
            ReviewRepository reviewRepository,
            UserRepository userRepository,
            DoctorRepository doctorRepository,
            BookingRepository bookingRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public ReviewResponse createReview(ReviewRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // 🔥 1. CHECK ĐÃ KHÁM XONG CHƯA (QUAN TRỌNG NHẤT)
        boolean hasCompletedBooking = bookingRepository.existsByUser_IdAndSchedule_Doctor_IdAndStatus(
                user.getId(),
                doctor.getId(),
                BookingStatus.COMPLETED);

        if (!hasCompletedBooking) {
            throw new RuntimeException("Bạn chỉ có thể đánh giá sau khi đã khám bác sĩ này");
        }

        // 🔥 2. CHECK TRÁNH REVIEW 2 LẦN
        boolean alreadyReviewed = reviewRepository.existsByUser_IdAndDoctor_Id(user.getId(), doctor.getId());

        if (alreadyReviewed) {
            throw new RuntimeException("Bạn đã đánh giá bác sĩ này rồi");
        }

        // 🔥 3. SAVE REVIEW
        Review review = new Review();
        review.setUser(user);
        review.setDoctor(doctor);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review saved = reviewRepository.save(review);

        return mapToResponse(saved);
    }

    @Override
    public ReviewResponse updateReview(
            Long reviewId,
            Long userId,
            UpdateReviewRequest request) {

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // chỉ chủ review được sửa
        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền sửa đánh giá này");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review updated = reviewRepository.save(review);

        return mapToResponse(updated);
    }

    @Override
    public void deleteReview(
            Long reviewId,
            Long userId) {

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền xóa đánh giá này");
        }

        reviewRepository.delete(review);
    }

    @Override
    public List<ReviewResponse> getReviewsByDoctor(Long doctorId) {
        return reviewRepository.findByDoctorIdAndIsHiddenFalse(doctorId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewResponse> getReviewsByUser(Long userId) {
        return reviewRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public double getAverageRating(Long doctorId) {
        List<Review> reviews = reviewRepository.findByDoctorId(doctorId);

        if (reviews.isEmpty())
            return 0.0;

        double sum = reviews.stream()
                .mapToInt(Review::getRating)
                .sum();

        return sum / reviews.size();
    }

    @Override
    public ReviewResponse mapToResponse(Review review) {
        ReviewResponse res = new ReviewResponse();

        res.setId(review.getId());

        res.setUserId(review.getUser().getId());

        if (review.getDoctor() != null) {
            res.setDoctorId(review.getDoctor().getId());
        }

        res.setUserName(
                review.getUser().getLastName()
                        + " "
                        + review.getUser().getFirstName());

        if (review.getDoctor() != null &&
                review.getDoctor().getUser() != null) {

            res.setDoctorName(
                    review.getDoctor().getUser().getLastName()
                            + " "
                            + review.getDoctor().getUser().getFirstName());
        }

        res.setRating(review.getRating());
        res.setComment(review.getComment());
        res.setCreatedAt(review.getCreatedAt());
        res.setIsHidden(review.getIsHidden());

        return res;
    }

    @Override
    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}