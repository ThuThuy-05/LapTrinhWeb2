package com.booking.backend.controller;

import com.booking.backend.dto.ChangePasswordRequest;
import com.booking.backend.dto.UpdateUserRequest;
import com.booking.backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("admin/users")
    public ResponseEntity<?> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers());
    }

    @GetMapping("admin/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // =========================
    // USER ĐỔI MẬT KHẨU
    // =========================
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }

    // =========================
    // USER CẬP NHẬT THÔNG TIN CÁ NHÂN
    // =========================
    @PutMapping(value = "patient", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateMe(

            @RequestPart("data") UpdateUserRequest request,

            @RequestPart(value = "avatar", required = false) MultipartFile avatar

    ) {
        return ResponseEntity.ok(userService.updateProfile(request, avatar));
    }

    // =========================
    // ADMIN THAY ĐỔI TRẠNG THÁI USER (ACTIVE/INACTIVE)
    // =========================
    @PutMapping("/admin/{id}/status")
    public ResponseEntity<?> changeStatus(
            @PathVariable Long id,
            @RequestParam boolean active) {
        return ResponseEntity.ok(userService.changeUserStatus(id, active));
    }
}