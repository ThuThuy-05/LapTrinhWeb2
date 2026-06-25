"use client";

import {
  Filter,
  Search,
  Sun,
  Cloud,
  Calendar,
  CalendarDays,
  X,
} from "lucide-react";
import { useState } from "react";

type StatusFilter = "ALL" | "COMPLETED" | "CANCELLED";
type DateFilter = "ALL" | "TODAY" | "TOMORROW" | "THIS_WEEK" | "NEXT_WEEK";

interface PatientFiltersProps {
  statusFilter: StatusFilter;
  dateFilter: DateFilter;
  searchTerm: string;
  selectedDate: Date | null;
  onStatusFilterChange: (status: StatusFilter) => void;
  onDateFilterChange: (filter: DateFilter) => void;
  onSearchTermChange: (term: string) => void;
  onDateSelect: (date: Date) => void;
  onClearDate: () => void;
  getStatusCount: (status: StatusFilter) => number;
  getDateFilterCount: (filter: DateFilter) => number;
  showCalendar: boolean;
  onToggleCalendar: () => void;
  currentMonth: Date;
  onChangeMonth: (inc: number) => void;
  getDaysInMonth: (date: Date) => Date[];
  getBookingsForDate: (date: Date) => any[];
}

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

export default function PatientFilters({
  statusFilter,
  dateFilter,
  searchTerm,
  selectedDate,
  onStatusFilterChange,
  onDateFilterChange,
  onSearchTermChange,
  onDateSelect,
  onClearDate,
  getStatusCount,
  getDateFilterCount,
  showCalendar,
  onToggleCalendar,
  currentMonth,
  onChangeMonth,
  getDaysInMonth,
  getBookingsForDate,
}: PatientFiltersProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-8 overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-600" />
          <span className="font-semibold text-slate-700">Bộ lọc</span>
        </div>
      </div>
      <div className="p-5">
        {/* Lọc theo ngày */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
            Lọc theo ngày
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => onDateFilterChange("ALL")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                dateFilter === "ALL" && !selectedDate
                  ? "bg-cyan-500 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Tất cả ({getDateFilterCount("ALL")})
            </button>
            <button
              onClick={() => onDateFilterChange("TODAY")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1 ${
                dateFilter === "TODAY"
                  ? "bg-amber-500 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Sun className="w-3.5 h-3.5" /> Hôm nay (
              {getDateFilterCount("TODAY")})
            </button>
            <button
              onClick={() => onDateFilterChange("TOMORROW")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1 ${
                dateFilter === "TOMORROW"
                  ? "bg-sky-500 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Cloud className="w-3.5 h-3.5" /> Ngày mai (
              {getDateFilterCount("TOMORROW")})
            </button>
            <button
              onClick={() => onDateFilterChange("THIS_WEEK")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1 ${
                dateFilter === "THIS_WEEK"
                  ? "bg-emerald-500 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Tuần này (
              {getDateFilterCount("THIS_WEEK")})
            </button>
            <button
              onClick={() => onDateFilterChange("NEXT_WEEK")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1 ${
                dateFilter === "NEXT_WEEK"
                  ? "bg-purple-500 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" /> Tuần tới (
              {getDateFilterCount("NEXT_WEEK")})
            </button>
            <button
              onClick={onToggleCalendar}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1 ${
                showCalendar || selectedDate
                  ? "bg-indigo-500 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" /> Chọn ngày
            </button>
          </div>

          {/* Hiển thị ngày đã chọn */}
          {selectedDate && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(selectedDate.toISOString())}
              <button onClick={onClearDate} className="ml-1 hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Calendar Modal */}
        {showCalendar && (
          <div className="mb-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-indigo-700 flex items-center gap-2 text-sm">
                <CalendarDays className="w-4 h-4" />
                Lịch khám bệnh
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => onChangeMonth(-1)}
                  className="p-1.5 hover:bg-indigo-100 rounded-lg"
                >
                  <ChevronLeft className="w-4 h-4 text-indigo-600" />
                </button>
                <span className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-indigo-700">
                  {monthNames[currentMonth.getMonth()]}{" "}
                  {currentMonth.getFullYear()}
                </span>
                <button
                  onClick={() => onChangeMonth(1)}
                  className="p-1.5 hover:bg-indigo-100 rounded-lg"
                >
                  <ChevronRight className="w-4 h-4 text-indigo-600" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-[10px] font-medium text-indigo-600 py-1"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentMonth).map((date, idx) => {
                const isCurrentMonth =
                  date.getMonth() === currentMonth.getMonth();
                const bookingsOnDate = getBookingsForDate(date);
                const hasBookings = bookingsOnDate.length > 0;
                const isSelected =
                  selectedDate &&
                  date.toDateString() === selectedDate.toDateString();
                const isToday =
                  date.toDateString() === new Date().toDateString();

                return (
                  <button
                    key={idx}
                    onClick={() => onDateSelect(date)}
                    disabled={!isCurrentMonth}
                    className={`
                      relative p-1.5 rounded-lg text-xs transition-all
                      ${!isCurrentMonth ? "text-slate-300" : "text-slate-700"}
                      ${isSelected ? "bg-indigo-500 text-white shadow-md" : ""}
                      ${isToday && !isSelected ? "bg-indigo-100 border border-indigo-300" : ""}
                      ${hasBookings && !isSelected ? "hover:bg-indigo-100" : "hover:bg-slate-100"}
                      ${!isCurrentMonth ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                    `}
                  >
                    <div className="text-center font-medium text-xs">
                      {date.getDate()}
                    </div>
                    {hasBookings && (
                      <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2">
                        <div
                          className={`w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-indigo-500"}`}
                        ></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Lọc theo trạng thái - chỉ còn Đã khám và Đã hủy */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
            Lọc theo trạng thái
          </label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => onStatusFilterChange("ALL")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                statusFilter === "ALL"
                  ? "bg-cyan-500 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Tất cả ({getStatusCount("ALL")})
            </button>
            <button
              onClick={() => onStatusFilterChange("COMPLETED")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                statusFilter === "COMPLETED"
                  ? "bg-green-500 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Đã khám ({getStatusCount("COMPLETED")})
            </button>
            <button
              onClick={() => onStatusFilterChange("CANCELLED")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                statusFilter === "CANCELLED"
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Đã hủy ({getStatusCount("CANCELLED")})
            </button>
          </div>
        </div>

        {/* Tìm kiếm */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
            Tìm kiếm
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, số điện thoại..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 bg-slate-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Import thêm icon
import { ChevronLeft, ChevronRight } from "lucide-react";
