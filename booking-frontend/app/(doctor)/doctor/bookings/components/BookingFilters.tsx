"use client";

import { useState } from "react";
import {
  Filter,
  Search,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Booking } from "@/services/bookingService";

type FilterType = "ALL" | "TODAY" | "TOMORROW" | "THIS_WEEK" | "NEXT_WEEK";
type StatusFilter = "ALL" | "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

interface BookingFiltersProps {
  bookings: Booking[];
  filterType: FilterType;
  statusFilter: StatusFilter;
  searchTerm: string;
  selectedDate: Date | null;
  showCalendar: boolean;
  currentMonth: Date;
  onFilterTypeChange: (filter: FilterType) => void;
  onStatusFilterChange: (status: StatusFilter) => void;
  onSearchTermChange: (term: string) => void;
  onDateSelect: (date: Date) => void;
  onClearDateFilter: () => void;
  onToggleCalendar: () => void;
  onChangeMonth: (increment: number) => void;
  getFilterCount: (filter: FilterType) => number;
  getStatusCount: (status: StatusFilter) => number;
  getDaysInMonth: (date: Date) => Date[];
  getBookingsForDate: (date: Date) => Booking[];
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

export default function BookingFilters({
  bookings,
  filterType,
  statusFilter,
  searchTerm,
  selectedDate,
  showCalendar,
  currentMonth,
  onFilterTypeChange,
  onStatusFilterChange,
  onSearchTermChange,
  onDateSelect,
  onClearDateFilter,
  onToggleCalendar,
  onChangeMonth,
  getFilterCount,
  getStatusCount,
  getDaysInMonth,
  getBookingsForDate,
}: BookingFiltersProps) {
  return (
    <>
      {/* Selected Date Indicator */}
      {selectedDate && (
        <div className="mb-4 flex items-center justify-between bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-3 border border-cyan-200">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-cyan-600" />
            <span className="text-sm font-medium text-cyan-700">
              Đang xem lịch ngày: {formatDate(selectedDate.toISOString())}
            </span>
          </div>
          <button
            onClick={onClearDateFilter}
            className="px-3 py-1 text-sm text-cyan-600 hover:bg-cyan-100 rounded-lg transition-colors"
          >
            Xóa lọc
          </button>
        </div>
      )}

      {/* Filters Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-8 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyan-600" />
            <span className="font-semibold text-slate-700">
              Bộ lọc nâng cao
            </span>
          </div>
        </div>
        <div className="p-5">
          <div className="mb-5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
              Lọc theo ngày
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "ALL", label: "Tất cả" },
                { value: "TODAY", label: "Hôm nay" },
                { value: "TOMORROW", label: "Ngày mai" },
                { value: "THIS_WEEK", label: "Tuần này" },
                { value: "NEXT_WEEK", label: "Tuần tới" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => {
                    onFilterTypeChange(filter.value as FilterType);
                    onClearDateFilter();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    filterType === filter.value && !selectedDate
                      ? "bg-cyan-500 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {filter.label}
                  <span className="ml-1 text-xs opacity-80">
                    ({getFilterCount(filter.value as FilterType)})
                  </span>
                </button>
              ))}
              <button
                onClick={onToggleCalendar}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  showCalendar || selectedDate
                    ? "bg-purple-500 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <CalendarDays className="w-4 h-4 inline mr-1" />
                Lịch tháng
              </button>
            </div>
          </div>

          {showCalendar && (
            <div className="mb-5 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-purple-700 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" />
                  Lịch khám bệnh theo tháng
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => onChangeMonth(-1)}
                    className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-purple-600" />
                  </button>
                  <span className="px-3 py-1 bg-white rounded-lg text-sm font-medium text-purple-700">
                    {currentMonth.toLocaleDateString("vi-VN", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    onClick={() => onChangeMonth(1)}
                    className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-purple-600" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-purple-600 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentMonth).map((date, index) => {
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
                      key={index}
                      onClick={() => onDateSelect(date)}
                      disabled={!isCurrentMonth}
                      className={`
                        relative p-2 rounded-lg text-sm transition-all
                        ${!isCurrentMonth ? "text-slate-300" : "text-slate-700"}
                        ${isSelected ? "bg-purple-500 text-white shadow-md" : ""}
                        ${isToday && !isSelected ? "bg-purple-100 border-2 border-purple-300" : ""}
                        ${hasBookings && !isSelected ? "hover:bg-purple-100" : "hover:bg-slate-100"}
                        ${!isCurrentMonth ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                      `}
                    >
                      <div className="text-center font-medium">
                        {date.getDate()}
                      </div>
                      {hasBookings && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-purple-500"}`}
                          ></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mb-5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
              Lọc theo trạng thái
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "ALL", label: "Tất cả" },
                { value: "PENDING", label: "Chờ xác nhận" },
                { value: "CONFIRMED", label: "Đã xác nhận" },
                { value: "COMPLETED", label: "Đã khám" },
                { value: "CANCELLED", label: "Đã hủy" },
              ].map((status) => (
                <button
                  key={status.value}
                  onClick={() =>
                    onStatusFilterChange(status.value as StatusFilter)
                  }
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    statusFilter === status.value
                      ? "bg-cyan-500 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {status.label}
                  <span className="ml-1 text-xs opacity-80">
                    ({getStatusCount(status.value as StatusFilter)})
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
              Tìm kiếm
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, số điện thoại, triệu chứng..."
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 bg-slate-50"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
