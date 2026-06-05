package com.booking.backend.dto;

import lombok.Data;

@Data
public class PostRequest {

    private String title;

    private String slug;

    private String thumbnail;

    private String content;
}