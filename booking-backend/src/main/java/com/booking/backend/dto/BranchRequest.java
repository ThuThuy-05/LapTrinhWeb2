// ===============================
// BrandRequest.java
// ===============================

package com.booking.backend.dto;

import lombok.Data;

@Data
public class BranchRequest {

    private String name;

    private String address;

    private Boolean active;
}