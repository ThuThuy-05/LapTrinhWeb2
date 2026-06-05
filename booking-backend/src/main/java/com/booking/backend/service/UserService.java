package com.booking.backend.service;

import com.booking.backend.entity.User;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.booking.backend.dto.*;

public interface UserService {

    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    UpdateUserResponse updateProfile(
            UpdateUserRequest request,
            MultipartFile avatar);

    // 🔥 sửa thành không có String email
    User getCurrentUser();

    List<User> getAllUsers();

    void changePassword(ChangePasswordRequest request);

    User changeUserStatus(Long id, boolean active);

    User getUserById(Long id);
}