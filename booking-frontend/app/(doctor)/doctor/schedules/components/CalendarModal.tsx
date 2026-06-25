"use client";

import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Schedule } from "@/services/scheduleService";

interface CalendarModalProps {
  isOpen: boolean;
  currentMonth: Date;
  selectedDate: Date | null;
  schedules: Schedule[];
  onClose: () => void;
  onDateSelect: (date: Date) => void;
  onChangeMonth: (increment: number) => void;
  onClear: () => void;
  onToday: () => void;
}

const monthNames = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];
const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear(),
    month = date.getMonth();
  const firstDay = new Date(year, month, 1),
    lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate(),
    startDayOfWeek = firstDay.getDay();
  const days = [];
  for (let i = 0; i < startDayOfWeek; i++)
    days.unshift(new Date(year, month, -i));
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
  for (let i = days.length; i < 42; i++)
    days.push(new Date(year, month + 1, i - days.length + 1));
  return days;
};

export default function CalendarModal({
  isOpen,
  currentMonth,
  selectedDate,
  schedules,
  onClose,
  onDateSelect,
  onChangeMonth,
  onClear,
  onToday,
}: CalendarModalProps) {
  if (!isOpen) return null;

  const getDatesWithSchedules = () => {
    const dates = new Set();
    schedules.forEach((schedule) =>
      dates.add(new Date(schedule.date).toDateString()),
    );
    return dates;
  };

  const getDateScheduleStatus = (date: Date) => {
    const dateStr = date.toDateString();
    const schedulesOnDate = schedules.filter(
      (s) => new Date(s.date).toDateString() === dateStr,
    );
    if (schedulesOnDate.length === 0) return null;
    const hasAvailable = schedulesOnDate.some((s) => s.status === "AVAILABLE");
    const hasBooked = schedulesOnDate.some((s) => s.status === "BOOKED");
    if (hasAvailable && hasBooked) return "mixed";
    if (hasAvailable) return "available";
    if (hasBooked) return "booked";
    return "cancelled";
  };

  const getDateStatusColor = (status: string | null) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "booked":
        return "bg-blue-500";
      case "cancelled":
        return "bg-red-500";
      case "mixed":
        return "bg-gradient-to-r from-green-500 to-blue-500";
      default:
        return "bg-gray-300";
    }
  };

  const datesWithSchedules = getDatesWithSchedules();

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-[450px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">Chọn ngày</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => onChangeMonth(-1)}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-base font-semibold">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              onClick={() => onChangeMonth(1)}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2 text-center text-sm font-medium text-slate-500">
            {weekDays.map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((date, idx) => {
              const isCurrentMonth =
                date.getMonth() === currentMonth.getMonth();
              const hasSchedule = datesWithSchedules.has(date.toDateString());
              const status = getDateScheduleStatus(date);
              const isTodayDate =
                date.toDateString() === new Date().toDateString();
              const isSelectedDate =
                selectedDate &&
                date.toDateString() === selectedDate.toDateString();

              return (
                <button
                  key={idx}
                  onClick={() => onDateSelect(date)}
                  disabled={!isCurrentMonth}
                  className={`aspect-square p-2 rounded-lg text-center transition-all ${!isCurrentMonth ? "text-slate-300" : "text-slate-700"} hover:bg-purple-50 hover:scale-105 ${isSelectedDate ? "bg-purple-100 ring-2 ring-purple-500" : ""} ${isTodayDate ? "font-bold text-purple-600" : ""}`}
                >
                  <div className="flex flex-col items-center">
                    <span>{date.getDate()}</span>
                    {hasSchedule && (
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${getDateStatusColor(status)}`}
                      ></div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t flex flex-wrap justify-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Có lịch</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Đã đặt</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Đã hủy</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <span>Không có</span>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={onClear}
              className="flex-1 py-2 bg-slate-100 rounded-lg text-sm"
            >
              Clear
            </button>
            <button
              onClick={onToday}
              className="flex-1 py-2 bg-purple-500 text-white rounded-lg text-sm shadow-lg"
            >
              Today
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-slate-100 rounded-lg text-sm"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
