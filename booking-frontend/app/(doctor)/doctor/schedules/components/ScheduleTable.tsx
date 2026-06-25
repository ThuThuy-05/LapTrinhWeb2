"use client";

import {
  Clock,
  Eye,
  Stethoscope,
  Calendar,
  CheckCircle2,
  Activity,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Schedule, formatTime } from "@/services/scheduleService";

const formatDateSafe = (
  dateInput: Date | string | null | undefined,
): string => {
  if (!dateInput) return "N/A";
  try {
    let date: Date;
    if (typeof dateInput === "string") date = new Date(dateInput);
    else if (dateInput instanceof Date) date = dateInput;
    else return "N/A";
    if (isNaN(date.getTime())) return "N/A";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "N/A";
  }
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "AVAILABLE":
      return {
        label: "Còn trống",
        color:
          "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200",
        icon: <CheckCircle2 className="w-4 h-4" />,
      };
    case "BOOKED":
      return {
        label: "Đã đặt lịch",
        color:
          "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200",
        icon: <Activity className="w-4 h-4" />,
      };
    case "CANCELLED":
      return {
        label: "Đã hủy",
        color:
          "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200",
        icon: <XCircle className="w-4 h-4" />,
      };
    default:
      return {
        label: "Không xác định",
        color: "bg-gray-50 text-gray-700 border-gray-200",
        icon: <AlertCircle className="w-4 h-4" />,
      };
  }
};

interface ScheduleTableProps {
  schedules: Schedule[];
  totalSchedules: number;
}

export default function ScheduleTable({
  schedules,
  totalSchedules,
}: ScheduleTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-cyan-600" />
            <h2 className="text-lg font-semibold text-slate-800">
              Danh sách lịch làm việc
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Eye className="w-4 h-4 text-slate-400" />
            <span className="text-slate-500">
              Hiển thị {schedules.length} / {totalSchedules} lịch
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Ngày trực
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Thời gian
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Phòng khám
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody>
            {schedules.length > 0 ? (
              schedules.map((schedule, index) => {
                const statusConfig = getStatusConfig(schedule.status);
                return (
                  <tr
                    key={schedule.id}
                    className={`border-b border-slate-100 hover:bg-slate-50 ${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">
                        {formatDateSafe(schedule.date)}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {new Date(schedule.date).toLocaleDateString("vi-VN", {
                          weekday: "long",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700 font-medium">
                          {formatTime(schedule.timeStart)} -{" "}
                          {formatTime(schedule.timeEnd)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700">
                        {schedule.room?.name || "Chưa phân phòng"}
                      </div>
                      {schedule.room?.location && (
                        <div className="text-xs text-slate-400 mt-0.5">
                          📍 {schedule.room.location}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${statusConfig.color} shadow-sm`}
                      >
                        {statusConfig.icon}
                        <span className="text-sm font-medium">
                          {statusConfig.label}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-slate-100 rounded-full">
                      <Calendar className="w-12 h-12 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-slate-600 font-medium text-lg">
                        Không có lịch trực
                      </p>
                      <p className="text-slate-400 text-sm mt-1">
                        Hiện tại chưa có lịch trực nào
                      </p>
                    </div>
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
