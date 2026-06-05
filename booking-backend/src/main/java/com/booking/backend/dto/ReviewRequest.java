package com.booking.backend.dto;
import lombok.Data;
@Data
public class ReviewRequest {
       private Long userId;
    private Long doctorId;
    private Integer rating;
    private String comment;
}
