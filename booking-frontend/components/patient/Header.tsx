"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Search,
  LogIn,
  UserPlus,
  Menu,
  X,
  Stethoscope,
  Bell,
  User,
  Settings,
  CalendarDays,
  LogOut,
  ChevronDown,
  CheckCheck,
  Mail,
  MailOpen,
} from "lucide-react";

import { getProfile, logout } from "@/services/authService";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type Notification,
} from "@/services/notificationService";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);

  // Refs for closing dropdowns
  const notificationRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: "TRANG CHỦ", href: "/" },
    { name: "BÁC SĨ", href: "/doctors" },
    { name: "CHUYÊN KHOA", href: "/specialties" },
    { name: "GIỚI THIỆU", href: "/about" },
    { name: "TIN TỨC", href: "/news" },
    { name: "LIÊN HỆ", href: "/contact" },
  ];

  // Load user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const data = await getProfile();
        setUser(data);
      } catch (error) {
        console.log("Profile fetch error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("fullName");
        setUser(null);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // Load notifications when user is logged in
  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) return;

      setNotificationLoading(true);
      try {
        const userId = Number(localStorage.getItem("userId"));
        if (userId) {
          const data = await getNotifications(userId);
          setNotifications(data);
        }
      } catch (error) {
        console.error("Failed to load notifications:", error);
      } finally {
        setNotificationLoading(false);
      }
    };

    loadNotifications();
  }, [user]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openDropdown &&
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Element)
      ) {
        setOpenDropdown(false);
      }

      if (
        showNotification &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Element)
      ) {
        setShowNotification(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openDropdown, showNotification]);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      localStorage.removeItem("fullName");
      setUser(null);
      router.push("/login");
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notificationId ? { ...item, isRead: true } : item,
        ),
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const userId = Number(localStorage.getItem("userId"));
      await markAllNotificationsAsRead(userId);
      setNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true })),
      );
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  // Điều hướng đến trang chi tiết thông báo
  const handleNotificationClick = (notification: Notification) => {
    setShowNotification(false);
    // Đánh dấu đã đọc nếu chưa
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    // Điều hướng đến trang chi tiết với ID thông báo
    router.push(`/notifications/${notification.id}`);
  };

  // Điều hướng đến trang danh sách tất cả thông báo
  const handleViewAll = () => {
    setShowNotification(false);
    router.push("/notifications");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <header className="bg-gradient-to-r from-blue-500 to-cyan-500 sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-6">
        {/* TOP */}
        <div className="flex items-center justify-between py-4 border-b border-white/20">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-52 h-14 flex items-center justify-center group-hover:scale-105 transition">
              {!imgError ? (
                <img
                  src="/logo.png"
                  alt="MedBooking Logo"
                  className="w-full h-full object-contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <Stethoscope className="w-8 h-8 text-white" />
              )}
            </div>
          </Link>

          {/* SEARCH */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm bác sĩ, chuyên khoa..."
                className="w-full px-5 py-2.5 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 transition"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* CHƯA LOGIN */}
            {!user && !loading ? (
              <>
                <Link
                  href="/login"
                  className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/30 rounded-full text-white text-sm font-semibold hover:bg-white/20 transition"
                >
                  <LogIn className="w-4 h-4" />
                  Đăng nhập
                </Link>

                <Link
                  href="/register"
                  className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-full text-white text-sm font-semibold hover:scale-105 transition"
                >
                  <UserPlus className="w-4 h-4" />
                  Đăng ký
                </Link>
              </>
            ) : user ? (
              <>
                {/* BELL NOTIFICATION */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotification(!showNotification)}
                    className="relative p-2 hover:bg-white/10 rounded-full transition group"
                  >
                    <div className="relative">
                      <Bell
                        size={22}
                        className="text-white group-hover:scale-110 transition-transform"
                      />
                      {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 font-bold shadow-lg animate-bounce">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* NOTIFICATION DROPDOWN */}
                  {showNotification && (
                    <div className="absolute right-0 mt-3 w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                      {/* Header */}
                      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-cyan-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-blue-600" />
                            <h3 className="font-semibold text-gray-800">
                              Thông báo
                            </h3>
                          </div>
                          {unreadCount > 0 && (
                            <button
                              onClick={handleMarkAllAsRead}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                              <CheckCheck className="w-3 h-3" />
                              Đánh dấu đã đọc
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Content - List View */}
                      <div className="max-h-[500px] overflow-y-auto divide-y divide-gray-100">
                        {notificationLoading ? (
                          <div className="p-8 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="text-sm text-gray-500 mt-2">
                              Đang tải...
                            </p>
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Bell className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">
                              Chưa có thông báo
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Khi có thông báo mới, chúng sẽ hiển thị ở đây
                            </p>
                          </div>
                        ) : (
                          notifications.slice(0, 5).map((item) => (
                            <div
                              key={item.id}
                              onClick={() => handleNotificationClick(item)}
                              className={`p-4 hover:bg-gray-50 transition cursor-pointer ${
                                !item.isRead ? "bg-blue-50/30" : ""
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                  {!item.isRead ? (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 animate-pulse"></div>
                                  ) : (
                                    <Mail className="w-4 h-4 text-gray-400 mt-1" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`text-sm ${
                                      !item.isRead
                                        ? "font-semibold text-gray-800"
                                        : "text-gray-600"
                                    } line-clamp-2`}
                                  >
                                    {item.content}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs text-gray-400">
                                      {formatDate(item.createdAt)}
                                    </span>
                                    {!item.isRead && (
                                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                        Mới
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(item.id);
                                  }}
                                  className="text-gray-400 hover:text-blue-600 transition"
                                >
                                  <CheckCheck className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Footer - Xem tất cả */}
                      {notifications.length > 0 && (
                        <div className="p-3 border-t bg-gray-50">
                          <button
                            onClick={handleViewAll}
                            className="block w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Xem tất cả {notifications.length} thông báo
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* USER DROPDOWN */}
                <div className="relative hidden md:block" ref={userDropdownRef}>
                  <button
                    onClick={() => setOpenDropdown(!openDropdown)}
                    className="flex items-center gap-3 px-3 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold shadow-md">
                      {user?.firstName?.charAt(0)?.toUpperCase() ||
                        user?.email?.charAt(0)?.toUpperCase() ||
                        "U"}
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-semibold text-white">
                        {user?.lastName || ""}{" "}
                        {user?.firstName ||
                          user?.email?.split("@")[0] ||
                          "User"}
                      </p>
                      <p className="text-xs text-cyan-100">
                        {user?.role === "PATIENT"
                          ? "Bệnh nhân"
                          : user?.role === "DOCTOR"
                            ? "Bác sĩ"
                            : user?.role || "Khách hàng"}
                      </p>
                    </div>

                    <ChevronDown
                      className={`w-4 h-4 text-white transition-transform duration-200 ${
                        openDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* DROPDOWN MENU */}
                  {openDropdown && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-cyan-50">
                        <p className="font-semibold text-gray-800">
                          {user?.lastName || ""}{" "}
                          {user?.firstName ||
                            user?.email?.split("@")[0] ||
                            "User"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {user?.phone || user?.email}
                        </p>
                      </div>

                      <div className="p-2">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition"
                          onClick={() => setOpenDropdown(false)}
                        >
                          <User className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-700">
                            Thông tin cá nhân
                          </span>
                        </Link>

                        <Link
                          href="/update-profile"
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition"
                          onClick={() => setOpenDropdown(false)}
                        >
                          <Settings className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-700">
                            Cập nhật hồ sơ
                          </span>
                        </Link>

                        <Link
                          href="/appointments"
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition"
                          onClick={() => setOpenDropdown(false)}
                        >
                          <CalendarDays className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-700">
                            Lịch hẹn của tôi
                          </span>
                        </Link>

                        <div className="border-t my-2"></div>

                        <Link
                          href="/notifications"
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition"
                          onClick={() => setOpenDropdown(false)}
                        >
                          <Bell className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-700">
                            Thông báo của tôi
                          </span>
                          {unreadCount > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                              {unreadCount}
                            </span>
                          )}
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-500">
                            Đăng xuất
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : null}

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* NAVIGATION DESKTOP */}
        <div className="hidden md:flex items-center justify-center py-3">
          <nav className="flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider transition-all rounded-lg ${
                    isActive
                      ? "bg-white text-blue-700 shadow-lg"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 text-white/80 hover:bg-white/10 rounded-lg text-sm font-bold uppercase transition"
                >
                  {link.name}
                </Link>
              ))}

              {!user && !loading ? (
                <div className="pt-3 border-t border-white/20 mt-2 space-y-2">
                  <Link
                    href="/login"
                    className="block px-4 py-3 text-center text-white border border-white/30 rounded-lg hover:bg-white/10 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>

                  <Link
                    href="/register"
                    className="block px-4 py-3 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </div>
              ) : user ? (
                <div className="pt-3 border-t border-white/20 mt-2 space-y-2">
                  <div className="px-4 py-3 text-white rounded-lg bg-white/10">
                    <p className="font-semibold">
                      {user?.lastName} {user?.firstName}
                    </p>
                    <p className="text-xs text-cyan-200">
                      {user?.phone || user?.email}
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    className="block px-4 py-3 text-white rounded-lg hover:bg-white/10 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Thông tin cá nhân
                  </Link>

                  <Link
                    href="/appointments"
                    className="block px-4 py-3 text-white rounded-lg hover:bg-white/10 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Lịch hẹn của tôi
                  </Link>

                  <Link
                    href="/notifications"
                    className="block px-4 py-3 text-white rounded-lg hover:bg-white/10 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Thông báo
                    {unreadCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                        {unreadCount}
                      </span>
                    )}
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-red-300 border border-red-300/30 rounded-lg hover:bg-red-500/10 transition"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : null}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
