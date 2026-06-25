"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  UserRound,
  Calendar,
  Building2,
  Stethoscope,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Trophy,
  TrendingUp,
  Activity,
  Sparkles,
  Shield,
  Heart,
  ChevronRight,
} from "lucide-react";

import {
  getAdminDashboard,
  AdminDashboard,
} from "@/services/adminDashboardService";

const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800;14..32,900&display=swap');
  .admin-dashboard * {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
`;

export default function AdminDashboardPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAdminDashboard();
        setDashboard(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDoctorClick = () => {
    router.push("/admin/doctors");
  };

  const handleSpecialtyClick = () => {
    router.push("/admin/specialties");
  };

  if (loading) {
    return (
      <div className="admin-dashboard min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 flex items-center justify-center">
        <style>{fontStyle}</style>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Đang tải dữ liệu...</p>
          <p className="text-slate-400 text-sm mt-1">Hệ thống đang khởi tạo</p>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Tổng bác sĩ",
      value: dashboard?.totalDoctors,
      icon: Users,
      gradient: "from-cyan-500 to-teal-500",
      bgLight: "bg-cyan-50",
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
      suffix: "bác sĩ",
      link: "/admin/doctors",
    },
    {
      title: "Tổng bệnh nhân",
      value: dashboard?.totalPatients,
      icon: UserRound,
      gradient: "from-emerald-500 to-teal-500",
      bgLight: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      suffix: "bệnh nhân",
      link: "/admin/users",
    },
    {
      title: "Tổng lịch hẹn",
      value: dashboard?.totalBookings,
      icon: Calendar,
      gradient: "from-blue-500 to-cyan-500",
      bgLight: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      suffix: "lịch hẹn",
      link: "/admin/bookings",
    },
    {
      title: "Chuyên khoa",
      value: dashboard?.totalSpecialties,
      icon: Stethoscope,
      gradient: "from-purple-500 to-pink-500",
      bgLight: "bg-purple-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      suffix: "chuyên khoa",
      link: "/admin/specialties",
    },
    {
      title: "Chi nhánh",
      value: dashboard?.totalBranches,
      icon: Building2,
      gradient: "from-orange-500 to-amber-500",
      bgLight: "bg-orange-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      suffix: "chi nhánh",
      link: "/admin/branches",
    },
    {
      title: "Đánh giá",
      value: dashboard?.totalReviews,
      icon: Star,
      gradient: "from-amber-500 to-yellow-500",
      bgLight: "bg-amber-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      suffix: "đánh giá",
      link: "/admin/reviews",
    },
  ];

  const bookingStatus = [
    {
      title: "Đã xác nhận",
      value: dashboard?.confirmedBookings,
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Đã khám",
      value: dashboard?.completedBookings,
      icon: CheckCircle,
      color: "from-emerald-500 to-emerald-600",
      bgLight: "bg-emerald-50",
      borderColor: "border-emerald-200",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Đã hủy",
      value: dashboard?.cancelledBookings,
      icon: XCircle,
      color: "from-rose-500 to-rose-600",
      bgLight: "bg-rose-50",
      borderColor: "border-rose-200",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
    },
  ];

  const todayStats = [
    {
      title: "Lịch hẹn hôm nay",
      value: dashboard?.todayBookings,
      icon: Calendar,
      color: "from-cyan-500 to-teal-500",
      bgLight: "bg-cyan-50",
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
    {
      title: "Đã khám hôm nay",
      value: dashboard?.todayCompletedBookings,
      icon: CheckCircle,
      color: "from-emerald-500 to-teal-500",
      bgLight: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Hủy hôm nay",
      value: dashboard?.todayCancelledBookings,
      icon: XCircle,
      color: "from-rose-500 to-rose-600",
      bgLight: "bg-rose-50",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
    },
  ];

  // Tính tỷ lệ hoàn thành
  const completionRate =
    dashboard?.totalBookings && dashboard?.totalBookings > 0
      ? Math.round(
          ((dashboard?.completedBookings || 0) / dashboard?.totalBookings) *
            100,
        )
      : 0;

  return (
    <div className="admin-dashboard min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
      <style>{fontStyle}</style>

      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-extrabold">Dashboard Admin</h1>
              </div>
              <p className="text-white/80 font-medium ml-16">
                Tổng quan hệ thống đặt lịch khám bệnh 3T Hospital
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-xl">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-semibold">Hoạt động tốt</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-xl">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  Hiệu suất {completionRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-cyan-50 via-teal-50 to-emerald-50 rounded-2xl p-6 border border-cyan-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Chào mừng đến với 3T Hospital
                </h2>
                <p className="text-slate-500 mt-1">
                  Hôm nay là một ngày tuyệt vời để quản lý hệ thống!
                </p>
              </div>
              <div className="ml-auto hidden md:block">
                <div className="text-right">
                  <p className="text-sm text-slate-400">Hôm nay</p>
                  <p className="text-2xl font-bold text-slate-700">
                    {new Date().toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                onClick={() => card.link && router.push(card.link)}
                className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <div
                  className={`h-1 w-full bg-gradient-to-r ${card.gradient}`}
                />
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">
                        {card.title}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-slate-800">
                          {card.value?.toLocaleString() || 0}
                        </span>
                        <span className="text-sm text-slate-400">
                          {card.suffix}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded-xl ${card.bgLight} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className={`w-6 h-6 ${card.iconColor}`} />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-end text-xs text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Xem chi tiết</span>
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Booking Status Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Trạng thái lịch hẹn
              </h3>
              <p className="text-sm text-slate-400">
                Thống kê chi tiết các trạng thái đặt lịch
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <TrendingUp className="w-4 h-4" />
              <span>Cập nhật mới nhất</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {bookingStatus.map((item, index) => {
              const Icon = item.icon;
              const total = dashboard?.totalBookings || 1;
              const percent = Math.round(((item.value || 0) / total) * 100);
              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-sm border ${item.borderColor} p-5 hover:shadow-md transition-all group`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`p-2 rounded-xl ${item.iconBg} group-hover:scale-110 transition`}
                    >
                      <Icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                    <span className="text-xs font-bold text-slate-400">
                      {percent}%
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-slate-500">
                    {item.title}
                  </h3>
                  <p className="text-2xl font-bold text-slate-800 mt-1">
                    {item.value || 0}
                  </p>
                  <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today Stats */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-cyan-500" />
            <h3 className="text-lg font-bold text-slate-800">
              Thống kê hôm nay
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {todayStats.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">
                        {item.title}
                      </p>
                      <p className="text-3xl font-bold text-slate-800">
                        {item.value || 0}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-xl ${item.bgLight} group-hover:scale-110 transition`}
                    >
                      <Icon className={`w-6 h-6 ${item.iconColor}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Performers */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Doctor - Clickable */}
          <div
            onClick={handleDoctorClick}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
          >
            <div className="bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-lg">
                    Bác sĩ nổi bật
                  </h3>
                </div>
                <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-white transition" />
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-md">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800">
                    {dashboard?.topDoctorName || "Chưa có dữ liệu"}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-slate-500">
                      {dashboard?.topDoctorBookings || 0} lượt khám
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Hiệu suất</span>
                  <span className="font-semibold text-cyan-600">Xuất sắc</span>
                </div>
                <div className="mt-2 h-2 bg-cyan-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
                    style={{ width: "85%" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Top Specialty - Clickable */}
          <div
            onClick={handleSpecialtyClick}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-lg">
                    Chuyên khoa nổi bật
                  </h3>
                </div>
                <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-white transition" />
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-md">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800">
                    {dashboard?.topSpecialtyName || "Chưa có dữ liệu"}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-slate-500">
                      {dashboard?.topSpecialtyBookings || 0} lượt đặt
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Độ phổ biến</span>
                  <span className="font-semibold text-purple-600">Rất cao</span>
                </div>
                <div className="mt-2 h-2 bg-purple-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{ width: "90%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-400 border-t border-slate-200 pt-6">
          <p>© 2024 3T Hospital - Hệ thống quản lý đặt lịch khám bệnh</p>
          <p className="mt-1">
            Cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}
          </p>
        </div>
      </div>
    </div>
  );
}
