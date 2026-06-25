package com.booking.backend.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class SecurityUtils {

    /**
     * Lấy userId hiện tại từ SecurityContext
     */
    public static Long getCurrentUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                return null;
            }

            Object principal = authentication.getPrincipal();

            if (principal instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) principal;
                // Giả sử username là email hoặc phone
                // Bạn có thể custom để lấy userId từ database
                String username = userDetails.getUsername();
                log.debug("Current user: {}", username);

                // TODO: Lấy userId từ database dựa trên username
                // return userService.findByEmail(username).getId();
                return 1L; // Tạm thời
            }

            return null;

        } catch (Exception e) {
            log.error("Error getting current user: ", e);
            return null;
        }
    }

    /**
     * Kiểm tra user đã đăng nhập chưa
     */
    public static boolean isAuthenticated() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            return authentication != null && authentication.isAuthenticated()
                    && !(authentication.getPrincipal() instanceof String);
        } catch (Exception e) {
            return false;
        }
    }
}