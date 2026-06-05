package com.booking.backend.dto;

import lombok.Data;

@Data
public class RoomRequest {

    // Tên phòng
    private String name;

    // Vị trí
    private String location;

    // Trạng thái
    private Boolean active;
}