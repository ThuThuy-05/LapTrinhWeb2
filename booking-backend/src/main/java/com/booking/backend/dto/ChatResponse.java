package com.booking.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {

    private String message;

    private String sender;

    private String timestamp;

    private boolean success;

    private String error;

    private String sessionId;

    private List<String> quickReplies;

    private String responseType;

    private Object data;

    private String intent;

    private Double confidence;
}