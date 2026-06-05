"use client";

import React, { useEffect, useState } from "react";
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
} from "lucide-react";

import { getProfile, logout } from "@/services/authService";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const navLinks = [
    { name: "TRANG CHỦ", href: "/" },
    { name: "BÁC SĨ", href: "/doctors" },
    { name: "CHUYÊN KHOA", href: "/specialties" },
    { name: "GIỚI THIỆU", href: "/about" },
    { name: "TIN TỨC", href: "/news" },
    { name: "LIÊN HỆ", href: "/contact" },
  ];

  // Load user profile
  // Load user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        queueMicrotask(() => {
          setUser(null);
          setLoading(false);
        });
        return;
      }

      try {
        const data = await getProfile();

        queueMicrotask(() => {
          setUser(data);
        });
      } catch (error) {
        console.log(error);

        // clear auth khi token sai
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("fullName");

        queueMicrotask(() => {
          setUser(null);
        });

        router.push("/login");
      } finally {
        queueMicrotask(() => {
          setLoading(false);
        });
      }
    };

    fetchProfile();
  }, [router]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openDropdown &&
        !(event.target as Element).closest(".user-dropdown")
      ) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openDropdown]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("fullName");

    setUser(null);

    router.push("/login");
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
                {/* BELL */}
                <button className="hidden md:flex p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
                  <Bell className="w-4 h-4 text-white" />
                </button>

                {/* USER DROPDOWN */}
                <div className="relative hidden md:block user-dropdown">
                  <button
                    onClick={() => setOpenDropdown(!openDropdown)}
                    className="flex items-center gap-3 px-3 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold">
                      {user?.firstName?.charAt(0) ||
                        user?.email?.charAt(0) ||
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
                        {user?.role || "PATIENT"}
                      </p>
                    </div>

                    <ChevronDown className="w-4 h-4 text-white" />
                  </button>

                  {/* DROPDOWN MENU */}
                  {openDropdown && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden z-50">
                      <div className="p-4 border-b">
                        <p className="font-semibold text-slate-800">
                          {user?.lastName || ""}{" "}
                          {user?.firstName ||
                            user?.email?.split("@")[0] ||
                            "User"}
                        </p>
                        <p className="text-sm text-slate-500">
                          {user?.phone || user?.email}
                        </p>
                      </div>

                      <div className="p-2">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 transition"
                          onClick={() => setOpenDropdown(false)}
                        >
                          <User className="w-4 h-4" />
                          Thông tin cá nhân
                        </Link>

                        <Link
                          href="/update-profile"
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 transition"
                          onClick={() => setOpenDropdown(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Cập nhật hồ sơ
                        </Link>

                        <Link
                          href="/appointments"
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 transition"
                          onClick={() => setOpenDropdown(false)}
                        >
                          <CalendarDays className="w-4 h-4" />
                          Lịch hẹn của tôi
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-500 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          Đăng xuất
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
              className="md:hidden p-2 rounded-lg bg-white/10"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="hidden md:flex items-center justify-center py-3">
          {" "}
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
          <div className="md:hidden py-4 border-t border-white/20">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 text-white/80 hover:bg-white/10 rounded-lg text-sm font-bold uppercase"
                >
                  {link.name}
                </Link>
              ))}

              {!user && !loading ? (
                <div className="pt-3 border-t border-white/20 mt-2 space-y-2">
                  <Link
                    href="/login"
                    className="block px-4 py-3 text-center text-white border border-white/30 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>

                  <Link
                    href="/register"
                    className="block px-4 py-3 text-center bg-blue-600 text-white rounded-lg"
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
                    className="block px-4 py-3 text-white rounded-lg hover:bg-white/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Thông tin cá nhân
                  </Link>

                  <Link
                    href="/appointments"
                    className="block px-4 py-3 text-white rounded-lg hover:bg-white/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Lịch hẹn của tôi
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-red-300 border border-red-300/30 rounded-lg hover:bg-red-500/10"
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
