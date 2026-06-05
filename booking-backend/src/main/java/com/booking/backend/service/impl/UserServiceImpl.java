package com.booking.backend.service.impl;

import com.booking.backend.dto.*;
import com.booking.backend.entity.User;
import com.booking.backend.enums.Role;
import com.booking.backend.repository.UserRepository;
import com.booking.backend.security.JwtService;
import com.booking.backend.service.UserService;
import com.cloudinary.Cloudinary;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public RegisterResponse register(RegisterRequest request) {

        if (userRepository.findByPhone(request.getPhone()).isPresent()) {
            throw new RuntimeException("Số điện thoại đã tồn tại");
        }

        // if (request.getEmail() != null &&
        // userRepository.findByEmail(request.getEmail()).isPresent()) {
        // throw new RuntimeException("Email đã tồn tại");
        // }

        User user = new User();

        // 🔑 account
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // 👤 info
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setGender(request.getGender());

        user.setAddress(request.getAddress());

        // 📷 avatar (nếu null thì để default)
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }

        // 🔐 role default
        user.setRole(Role.PATIENT);

        User saved = userRepository.save(user);

        // response
        RegisterResponse res = new RegisterResponse();
        res.setId(saved.getId());
        res.setName(saved.getFullName());
        res.setPhone(saved.getPhone());
        res.setEmail(saved.getEmail());
        res.setRole(saved.getRole().name());
        res.setAddress(saved.getAddress());

        return res;
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new RuntimeException("Không tồn tại tài khoản"));

        // Kiểm tra trạng thái khóa
        if (!user.isActive()) {
            throw new RuntimeException("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin.");
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Sai mật khẩu");
        }

        // 🚫 CHECK ACTIVE (CHỖ BẠN HỎI)
        if (!user.isActive()) {
            throw new RuntimeException("Tài khoản bị khóa");
        }
        // 🔥 tạo token (có role trong JWT)
        String token = jwtService.generateToken(
                user.getPhone(),
                user.getRole().name());

        // 🔥 response đầy đủ
        return new LoginResponse(
                user.getId(),
                token,
                user.getRole().name(),
                user.getFullName(),
                user.getPhone());
    }

    @Override
    public UpdateUserResponse updateProfile(UpdateUserRequest request, MultipartFile avatar) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String phone = auth.getName();

        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        // =========================
        // UPDATE INFO
        // =========================

        if (request.getFirstName() != null)
            user.setFirstName(request.getFirstName());

        if (request.getLastName() != null)
            user.setLastName(request.getLastName());

        if (request.getEmail() != null)
            user.setEmail(request.getEmail());

        if (request.getDateOfBirth() != null)
            user.setDateOfBirth(request.getDateOfBirth());

        if (request.getGender() != null)
            user.setGender(request.getGender());

        if (request.getAddress() != null)
            user.setAddress(request.getAddress());

        // =========================
        // UPLOAD AVATAR (GIỐNG BANNER)
        // =========================

        if (avatar != null && !avatar.isEmpty()) {

            try {

                Map<?, ?> uploadResult = cloudinary.uploader().upload(
                        avatar.getBytes(),
                        Map.of("folder", "users"));

                String url = uploadResult.get("secure_url").toString();

                user.setAvatar(url);

            } catch (Exception e) {
                throw new RuntimeException("Upload avatar lỗi: " + e.getMessage());
            }
        }

        // =========================
        // SAVE
        // =========================

        User saved = userRepository.save(user);

        UpdateUserResponse res = new UpdateUserResponse();
        res.setId(saved.getId());
        res.setName(saved.getFullName());
        res.setPhone(saved.getPhone());
        res.setEmail(saved.getEmail());
        res.setAvatar(saved.getAvatar());
        res.setRole(saved.getRole().name());
        res.setAddress(saved.getAddress());

        return res;
    }

    // 🔥 lấy thông tin user đang login
    @Override
    public User getCurrentUser() {

        // 🔥 lấy user đang login từ JWT
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String phone = auth.getName();

        return userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
    }

    // 🔥 admin xem danh sách user
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 🔥 đổi mật khẩu
    @Override
    public void changePassword(ChangePasswordRequest request) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String phone = auth.getName();

        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không đúng");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
    }

    // 🔥 admin thay đổi trạng thái user (active/inactive)
    @Override
    public User changeUserStatus(Long id, boolean active) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        user.setActive(active);

        return userRepository.save(user);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
    }

 
}
