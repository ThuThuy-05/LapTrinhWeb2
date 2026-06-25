"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity,
  Loader2,
  Stethoscope,
  CalendarDays,
  Hourglass,
  BarChart3,
  PieChart,
} from "lucide-react";

export default function DoctorDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    pendingAppointments: 0,
    totalPatients: 0,
  });

  // Dữ liệu cho biểu đồ theo ngày trong tuần
  const [weeklyData, setWeeklyData] = useState([
    { day: "Thứ 2", completed: 0, pending: 0, cancelled: 0, total: 0 },
    { day: "Thứ 3", completed: 0, pending: 0, cancelled: 0, total: 0 },
    { day: "Thứ 4", completed: 0, pending: 0, cancelled: 0, total: 0 },
    { day: "Thứ 5", completed: 0, pending: 0, cancelled: 0, total: 0 },
    { day: "Thứ 6", completed: 0, pending: 0, cancelled: 0, total: 0 },
    { day: "Thứ 7", completed: 0, pending: 0, cancelled: 0, total: 0 },
    { day: "CN", completed: 0, pending: 0, cancelled: 0, total: 0 },
  ]);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);

      // TODO: Gọi API thực tế
      // const data = await getDoctorDashboard(user.doctorId);
      // setDashboard(data);

      // Mock data tạm để test
      setDashboard({
        totalPatients: 1,
        totalAppointments: 2,
        todayAppointments: 0,
        completedAppointments: 2,
        cancelledAppointments: 0,
        pendingAppointments: 0,
      });

      // Mock weekly data
      setWeeklyData([
        { day: "Thứ 2", completed: 1, pending: 0, cancelled: 0, total: 1 },
        { day: "Thứ 3", completed: 1, pending: 0, cancelled: 0, total: 1 },
        { day: "Thứ 4", completed: 0, pending: 0, cancelled: 0, total: 0 },
        { day: "Thứ 5", completed: 0, pending: 0, cancelled: 0, total: 0 },
        { day: "Thứ 6", completed: 0, pending: 0, cancelled: 0, total: 0 },
        { day: "Thứ 7", completed: 0, pending: 0, cancelled: 0, total: 0 },
        { day: "CN", completed: 0, pending: 0, cancelled: 0, total: 0 },
      ]);
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadDashboard();
    };

    init();
  }, []);

  // Tính tỷ lệ phần trăm
  const completedPercent =
    dashboard.totalAppointments > 0
      ? Math.round(
          (dashboard.completedAppointments / dashboard.totalAppointments) * 100,
        )
      : 0;

  const pendingPercent =
    dashboard.totalAppointments > 0
      ? Math.round(
          (dashboard.pendingAppointments / dashboard.totalAppointments) * 100,
        )
      : 0;

  const cancelledPercent =
    dashboard.totalAppointments > 0
      ? Math.round(
          (dashboard.cancelledAppointments / dashboard.totalAppointments) * 100,
        )
      : 0;

  // Dữ liệu cho biểu đồ tròn (chỉ hiển thị những cái > 0)
  const pieData = [
    {
      name: "Đã khám",
      value: dashboard.completedAppointments,
      percent: completedPercent,
      color: "#10b981",
    },
    {
      name: "Chờ khám",
      value: dashboard.pendingAppointments,
      percent: pendingPercent,
      color: "#f59e0b",
    },
    {
      name: "Đã hủy",
      value: dashboard.cancelledAppointments,
      percent: cancelledPercent,
      color: "#ef4444",
    },
  ].filter((item) => item.value > 0); // Lọc bỏ những cái = 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tổng quan
          </h1>
          <p className="text-gray-500 mt-1">
            Chào mừng trở lại! Dưới đây là thống kê hoạt động của bạn
          </p>
        </div>

        {/* Stats Cards - Hàng 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Tổng bệnh nhân */}
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tổng bệnh nhân</p>
                <p className="text-3xl font-bold text-gray-800">
                  {dashboard.totalPatients}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">bệnh nhân</p>
          </div>

          {/* Tổng lịch khám */}
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tổng lịch khám</p>
                <p className="text-3xl font-bold text-gray-800">
                  {dashboard.totalAppointments}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Calendar className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">lịch hẹn</p>
          </div>

          {/* Lịch hôm nay */}
          <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Lịch hôm nay</p>
                <p className="text-3xl font-bold text-gray-800">
                  {dashboard.todayAppointments}
                </p>
              </div>
              <div className="p-3 bg-cyan-50 rounded-xl">
                <CalendarDays className="w-6 h-6 text-cyan-500" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">lịch hẹn</p>
          </div>
        </div>

        {/* Hàng 2: Biểu đồ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Biểu đồ cột */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Thống kê theo ngày
                </h3>
                <p className="text-xs text-gray-400">
                  Số lượng lịch khám trong tuần
                </p>
              </div>
              <div className="flex gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-gray-500">Đã khám</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span className="text-gray-500">Chờ</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-gray-500">Hủy</span>
                </div>
              </div>
            </div>

            {/* CSS Bar Chart thay vì recharts */}
            <div className="space-y-3 mt-4">
              {weeklyData.map((item, idx) => {
                const maxTotal = Math.max(...weeklyData.map((d) => d.total), 1);
                const completedWidth =
                  maxTotal > 0 ? (item.completed / maxTotal) * 100 : 0;
                const pendingWidth =
                  maxTotal > 0 ? (item.pending / maxTotal) * 100 : 0;
                const cancelledWidth =
                  maxTotal > 0 ? (item.cancelled / maxTotal) * 100 : 0;

                return (
                  <div key={idx}>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>{item.day}</span>
                      <span>{item.total} lịch</span>
                    </div>
                    <div className="flex h-7 rounded-lg overflow-hidden">
                      <div
                        className="bg-green-500 h-full transition-all duration-300 flex items-center justify-center text-white text-[10px]"
                        style={{ width: `${completedWidth}%` }}
                      >
                        {item.completed > 0 && item.completed}
                      </div>
                      <div
                        className="bg-yellow-500 h-full transition-all duration-300 flex items-center justify-center text-white text-[10px]"
                        style={{ width: `${pendingWidth}%` }}
                      >
                        {item.pending > 0 && item.pending}
                      </div>
                      <div
                        className="bg-red-500 h-full transition-all duration-300 flex items-center justify-center text-white text-[10px]"
                        style={{ width: `${cancelledWidth}%` }}
                      >
                        {item.cancelled > 0 && item.cancelled}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Biểu đồ tròn */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-500" />
                Phân bố lịch khám
              </h3>
              <p className="text-xs text-gray-400">
                Tỷ lệ các trạng thái lịch hẹn
              </p>
            </div>

            {dashboard.totalAppointments === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Chưa có dữ liệu lịch hẹn</p>
              </div>
            ) : (
              <>
                {/* Simple Pie Chart bằng CSS */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-48 h-48">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full -rotate-90"
                    >
                      {/* Đã khám */}
                      {completedPercent > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="20"
                          strokeDasharray={`${completedPercent * 2.513} 251.3`}
                          strokeLinecap="round"
                        />
                      )}
                      {/* Chờ khám */}
                      {pendingPercent > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="20"
                          strokeDasharray={`${pendingPercent * 2.513} 251.3`}
                          strokeLinecap="round"
                          strokeDashoffset={-(completedPercent * 2.513)}
                        />
                      )}
                      {/* Đã hủy */}
                      {cancelledPercent > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="20"
                          strokeDasharray={`${cancelledPercent * 2.513} 251.3`}
                          strokeLinecap="round"
                          strokeDashoffset={
                            -((completedPercent + pendingPercent) * 2.513)
                          }
                        />
                      )}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-700">
                        {dashboard.totalAppointments}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {/* Đã khám */}
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-xs text-gray-600">Đã khám</span>
                    </div>
                    <p className="text-xl font-bold text-green-600">
                      {dashboard.completedAppointments}
                    </p>
                    <p className="text-xs text-green-500">
                      {completedPercent}%
                    </p>
                  </div>

                  {/* Chờ khám */}
                  <div className="text-center p-3 bg-yellow-50 rounded-xl">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span className="text-xs text-gray-600">Chờ khám</span>
                    </div>
                    <p className="text-xl font-bold text-yellow-600">
                      {dashboard.pendingAppointments}
                    </p>
                    <p className="text-xs text-yellow-500">{pendingPercent}%</p>
                  </div>

                  {/* Đã hủy */}
                  <div className="text-center p-3 bg-red-50 rounded-xl">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="text-xs text-gray-600">Đã hủy</span>
                    </div>
                    <p className="text-xl font-bold text-red-600">
                      {dashboard.cancelledAppointments}
                    </p>
                    <p className="text-xs text-red-500">{cancelledPercent}%</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Hàng 3: Thống kê chi tiết */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Đã khám */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Đã khám</p>
                <p className="text-3xl font-bold text-green-700">
                  {dashboard.completedAppointments}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3">
              <div className="h-2 bg-green-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${completedPercent}%` }}
                />
              </div>
              <p className="text-xs text-green-600 mt-2">
                Chiếm {completedPercent}% tổng số
              </p>
            </div>
          </div>

          {/* Chờ khám */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Chờ khám</p>
                <p className="text-3xl font-bold text-yellow-700">
                  {dashboard.pendingAppointments}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Hourglass className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-3">
              <div className="h-2 bg-yellow-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${pendingPercent}%` }}
                />
              </div>
              <p className="text-xs text-yellow-600 mt-2">
                Chiếm {pendingPercent}% tổng số
              </p>
            </div>
          </div>

          {/* Đã hủy */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Đã hủy</p>
                <p className="text-3xl font-bold text-red-700">
                  {dashboard.cancelledAppointments}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="mt-3">
              <div className="h-2 bg-red-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${cancelledPercent}%` }}
                />
              </div>
              <p className="text-xs text-red-600 mt-2">
                Chiếm {cancelledPercent}% tổng số
              </p>
            </div>
          </div>

          {/* Hiệu suất */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Hiệu suất</p>
                <p className="text-3xl font-bold text-blue-700">
                  {completedPercent}%
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3">
              <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${completedPercent}%` }}
                />
              </div>
              <p className="text-xs text-blue-600 mt-2">
                {completedPercent >= 70
                  ? "🎉 Xuất sắc"
                  : completedPercent >= 50
                    ? "👍 Tốt"
                    : "📈 Cần cải thiện"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>Cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}</p>
        </div>
      </div>
    </div>
  );
}
