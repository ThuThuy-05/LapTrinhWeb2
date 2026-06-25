"use client";

import {
  User,
  CheckCircle2,
  XCircle,
  Clock as ClockIcon,
  AlertCircle,
  Check,
} from "lucide-react";
import { Booking } from "@/services/bookingService";

const getStatusConfig = (status: string) => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return {
        label: "Chờ xác nhận",
        color: "bg-amber-50 text-amber-700 border-amber-200",
        icon: <ClockIcon className="w-4 h-4" />,
      };
    case "CONFIRMED":
      return {
        label: "Đã xác nhận",
        color: "bg-blue-50 text-blue-700 border-blue-200",
        icon: <CheckCircle2 className="w-4 h-4" />,
      };
    case "COMPLETED":
      return {
        label: "Đã khám",
        color: "bg-green-50 text-green-700 border-green-200",
        icon: <Check className="w-4 h-4" />,
      };
    case "CANCELLED":
      return {
        label: "Đã hủy",
        color: "bg-red-50 text-red-700 border-red-200",
        icon: <XCircle className="w-4 h-4" />,
      };
    default:
      return {
        label: status || "Không xác định",
        color: "bg-gray-50 text-gray-700 border-gray-200",
        icon: <AlertCircle className="w-4 h-4" />,
      };
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hôm nay";
  if (diffDays === 1) return "Ngày mai";
  if (diffDays === -1) return "Hôm qua";
  if (diffDays > 1) return `Còn ${diffDays} ngày`;
  return `Đã qua ${Math.abs(diffDays)} ngày`;
};

interface BookingTableProps {
  bookings: Booking[];
  onViewDetail: (booking: Booking) => void;
}

export default function BookingTable({
  bookings,
  onViewDetail,
}: BookingTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-600" />
            <h2 className="font-semibold text-slate-800">
              Danh sách bệnh nhân
            </h2>
          </div>
          <div className="text-sm text-slate-500">
            Hiển thị {bookings.length} bệnh nhân
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Bệnh nhân
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Liên hệ
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Ngày khám
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Triệu chứng
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => {
                const statusConfig = getStatusConfig(booking.status);
                const relativeTime = getRelativeTime(booking.bookingDate);
                return (
                  <tr
                    key={booking.id}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center">
                          <User className="w-5 h-5 text-cyan-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {booking.user?.fullName || "N/A"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {booking.user?.gender === "MALE"
                              ? "Nam"
                              : booking.user?.gender === "FEMALE"
                                ? "Nữ"
                                : "Khác"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700">
                        {booking.user?.phone || "N/A"}
                      </p>
                      <p className="text-xs text-slate-400 truncate max-w-[150px]">
                        {booking.user?.email || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        {formatDate(booking.bookingDate)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {booking.schedule?.timeStart?.substring(0, 5)} -{" "}
                        {booking.schedule?.timeEnd?.substring(0, 5)}
                      </p>
                      <span
                        className={`text-xs ${relativeTime === "Hôm nay" ? "text-amber-600 font-medium" : "text-slate-400"}`}
                      >
                        {relativeTime}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700 max-w-[200px] truncate">
                        {booking.symptom || "Không có"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                      >
                        {statusConfig.icon}
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => onViewDetail(booking)}
                        className="px-3 py-1.5 text-sm text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors font-medium"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <User className="w-12 h-12 text-slate-300" />
                    <p className="text-slate-500 font-medium">
                      Không có bệnh nhân
                    </p>
                    <p className="text-slate-400 text-sm">
                      Chưa có bệnh nhân nào đặt lịch khám
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
