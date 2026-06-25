"use client";

import { useEffect, useState } from "react";
import { getProfile } from "@/services/authService";
import Link from "next/link";

import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  Camera,
  Award,
  Heart,
  Briefcase,
  ShieldCheck,
  Cake,
  Globe,
  Edit3,
} from "lucide-react";

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  avatar: string;
  address: string;
  role: string;
  active: boolean;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isHoverAvatar, setIsHoverAvatar] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (err: any) {
        setError("Không thể tải thông tin hồ sơ");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "string") return "Chưa cập nhật";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getGenderText = (gender: string) => {
    switch (gender) {
      case "MALE":
        return "Nam";
      case "FEMALE":
        return "Nữ";
      default:
        return "Khác";
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return {
          label: "Quản trị viên",
          color: "bg-gradient-to-r from-purple-600 to-indigo-600",
        };
      case "manager":
        return {
          label: "Quản lý",
          color: "bg-gradient-to-r from-blue-600 to-cyan-600",
        };
      default:
        return {
          label: "Thành viên",
          color: "bg-gradient-to-r from-emerald-600 to-teal-600",
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-xl"></div>
            <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-6 text-gray-500 font-medium text-lg">
            Đang tải hồ sơ...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 max-w-md text-center border border-white/50">
          <div className="bg-rose-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">😢</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Không thể tải hồ sơ
          </h3>
          <p className="text-gray-500 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-medium hover:scale-105"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const roleBadge = getRoleBadge(user.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-6 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm mb-4">
            <User className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-medium text-gray-600">
              Hồ sơ cá nhân
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-900 bg-clip-text text-transparent">
            Thông tin của tôi
          </h1>
          <p className="text-gray-500 mt-3 max-w-md mx-auto">
            Quản lý và cập nhật thông tin cá nhân của bạn
          </p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-4xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl border border-white/50">
          {/* Cover Background */}
          <div className="relative h-40 bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-800">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
          </div>

          {/* Avatar Section */}
          <div className="relative px-8 sm:px-12">
            <div
              className="relative -mt-20 inline-block"
              onMouseEnter={() => setIsHoverAvatar(true)}
              onMouseLeave={() => setIsHoverAvatar(false)}
            >
              <div className="relative cursor-pointer group">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-500 blur-md opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <img
                  src={
                    user.avatar && user.avatar !== "string"
                      ? user.avatar
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=4F46E5&color=fff&size=140&rounded=true&bold=true&length=2`
                  }
                  alt={user.fullName}
                  className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-white shadow-xl transition-all duration-300 group-hover:scale-105"
                />
                {isHoverAvatar && (
                  <div className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center transition-all duration-300 backdrop-blur-sm">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pb-8 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
                    {user.fullName}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <span
                      className={`px-4 py-1.5 ${roleBadge.color} text-white rounded-full text-sm font-medium shadow-md`}
                    >
                      {roleBadge.label}
                    </span>
                    {user.active && (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        Hoạt động
                      </span>
                    )}
                  </div>
                </div>
                <Link href="/update-profile">
                  <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm font-medium">
                    <Edit3 className="w-4 h-4" />
                    Chỉnh sửa hồ sơ
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className="p-8 sm:p-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Thông tin cá nhân
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="group flex items-start gap-5 p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-white hover:from-indigo-50 hover:to-white transition-all duration-300 border border-gray-100 hover:border-indigo-200 hover:shadow-lg">
                <div className="p-3 bg-white rounded-xl shadow-md group-hover:shadow-lg">
                  <Mail className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    Email
                  </p>
                  <p className="text-gray-800 font-medium mt-1.5 break-all">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="group flex items-start gap-5 p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-white hover:from-indigo-50 hover:to-white transition-all duration-300 border border-gray-100 hover:border-indigo-200 hover:shadow-lg">
                <div className="p-3 bg-white rounded-xl shadow-md group-hover:shadow-lg">
                  <Phone className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    Số điện thoại
                  </p>
                  <p className="text-gray-800 font-medium mt-1.5">
                    {user.phone || "Chưa cập nhật"}
                  </p>
                </div>
              </div>

              {/* Gender */}
              <div className="group flex items-start gap-5 p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-white hover:from-indigo-50 hover:to-white transition-all duration-300 border border-gray-100 hover:border-indigo-200 hover:shadow-lg">
                <div className="p-3 bg-white rounded-xl shadow-md group-hover:shadow-lg">
                  <Heart className="w-5 h-5 text-rose-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    Giới tính
                  </p>
                  <p className="text-gray-800 font-medium mt-1.5">
                    {getGenderText(user.gender)}
                  </p>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="group flex items-start gap-5 p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-white hover:from-indigo-50 hover:to-white transition-all duration-300 border border-gray-100 hover:border-indigo-200 hover:shadow-lg">
                <div className="p-3 bg-white rounded-xl shadow-md group-hover:shadow-lg">
                  <Cake className="w-5 h-5 text-amber-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    Ngày sinh
                  </p>
                  <p className="text-gray-800 font-medium mt-1.5">
                    {formatDate(user.dateOfBirth)}
                  </p>
                </div>
              </div>

              {/* Address - Full width */}
              <div className="md:col-span-2 group flex items-start gap-5 p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-white hover:from-indigo-50 hover:to-white transition-all duration-300 border border-gray-100 hover:border-indigo-200 hover:shadow-lg">
                <div className="p-3 bg-white rounded-xl shadow-md group-hover:shadow-lg">
                  <MapPin className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    Địa chỉ
                  </p>
                  <p className="text-gray-800 font-medium mt-1.5">
                    {user.address || "Chưa cập nhật"}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats / Quick Info */}
            <div className="mt-10 pt-8 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="text-center p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl hover:scale-105 transition-all duration-300">
                  <Briefcase className="w-7 h-7 text-indigo-600 mx-auto mb-3" />
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Vai trò
                  </p>
                  <p className="text-base font-bold text-gray-800 mt-1 capitalize">
                    {roleBadge.label}
                  </p>
                </div>
                <div className="text-center p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl hover:scale-105 transition-all duration-300">
                  <ShieldCheck className="w-7 h-7 text-indigo-600 mx-auto mb-3" />
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Trạng thái
                  </p>
                  <p className="text-base font-bold text-gray-800 mt-1">
                    {user.active ? "Đã xác thực" : "Chưa xác thực"}
                  </p>
                </div>
                <div className="text-center p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl hover:scale-105 transition-all duration-300">
                  <Globe className="w-7 h-7 text-indigo-600 mx-auto mb-3" />
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Tham gia từ
                  </p>
                  <p className="text-base font-bold text-gray-800 mt-1">2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Thông tin cá nhân được bảo mật và chỉ hiển thị với bạn
          </p>
        </div>
      </div>
    </div>
  );
}
