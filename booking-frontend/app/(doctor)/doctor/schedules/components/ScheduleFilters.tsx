"use client";

import {
  Filter,
  Sun,
  Cloud,
  Calendar,
  CalendarDays,
  Search,
  X,
} from "lucide-react";

type StatusFilter = "ALL" | "AVAILABLE" | "BOOKED" | "CANCELLED";

interface ScheduleFiltersProps {
  quickFilter: string;
  statusFilter: StatusFilter;
  searchTerm: string;
  selectedDate: Date | null;
  onQuickFilterChange: (filter: string) => void;
  onStatusFilterChange: (status: StatusFilter) => void;
  onSearchTermChange: (term: string) => void;
  onOpenCalendar: () => void;
  onClearDate: () => void;
  onClearStatus: () => void;
  onClearSearch: () => void;
  getQuickFilterCount: (filter: string) => number;
}

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

export default function ScheduleFilters({
  quickFilter,
  statusFilter,
  searchTerm,
  selectedDate,
  onQuickFilterChange,
  onStatusFilterChange,
  onSearchTermChange,
  onOpenCalendar,
  onClearDate,
  onClearStatus,
  onClearSearch,
  getQuickFilterCount,
}: ScheduleFiltersProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-cyan-600" />
          <h2 className="text-lg font-semibold text-slate-800">
            Bộ lọc nâng cao
          </h2>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => onQuickFilterChange("today")}
              className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-between ${quickFilter === "today" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                <span>Hôm nay</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${quickFilter === "today" ? "bg-white/20" : "bg-slate-200"}`}
              >
                {getQuickFilterCount("today")}
              </span>
            </button>
            <button
              onClick={() => onQuickFilterChange("tomorrow")}
              className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-between ${quickFilter === "tomorrow" ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Ngày mai</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${quickFilter === "tomorrow" ? "bg-white/20" : "bg-slate-200"}`}
              >
                {getQuickFilterCount("tomorrow")}
              </span>
            </button>
            <button
              onClick={() => onQuickFilterChange("thisweek")}
              className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-between ${quickFilter === "thisweek" ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                <span>Tuần này</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${quickFilter === "thisweek" ? "bg-white/20" : "bg-slate-200"}`}
              >
                {getQuickFilterCount("thisweek")}
              </span>
            </button>
            <button
              onClick={() => onQuickFilterChange("nextweek")}
              className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-between ${quickFilter === "nextweek" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                <span>Tuần tới</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${quickFilter === "nextweek" ? "bg-white/20" : "bg-slate-200"}`}
              >
                {getQuickFilterCount("nextweek")}
              </span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-slate-600 font-medium">
              Trạng thái:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onStatusFilterChange("ALL")}
                className={`px-3 py-1.5 rounded-lg text-sm ${statusFilter === "ALL" ? "bg-cyan-500 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                Tất cả
              </button>
              <button
                onClick={() => onStatusFilterChange("AVAILABLE")}
                className={`px-3 py-1.5 rounded-lg text-sm ${statusFilter === "AVAILABLE" ? "bg-green-500 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                Còn trống
              </button>
              <button
                onClick={() => onStatusFilterChange("BOOKED")}
                className={`px-3 py-1.5 rounded-lg text-sm ${statusFilter === "BOOKED" ? "bg-blue-500 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                Đã đặt
              </button>
              <button
                onClick={() => onStatusFilterChange("CANCELLED")}
                className={`px-3 py-1.5 rounded-lg text-sm ${statusFilter === "CANCELLED" ? "bg-red-500 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                Đã hủy
              </button>
            </div>
          </div>
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm phòng khám..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 w-full bg-slate-50"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onOpenCalendar}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${selectedDate ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            <Calendar className="w-4 h-4" />
            {selectedDate ? formatDateSafe(selectedDate) : "Chọn ngày"}
          </button>
        </div>

        {(selectedDate ||
          quickFilter !== "all" ||
          statusFilter !== "ALL" ||
          searchTerm) && (
          <div className="mt-4 p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200">
            <p className="text-xs font-medium text-cyan-800 mb-2">
              Bộ lọc đang áp dụng:
            </p>
            <div className="flex flex-wrap gap-2">
              {quickFilter !== "all" && (
                <span className="px-2 py-1 bg-white rounded-lg text-xs text-cyan-700">
                  {quickFilter === "today"
                    ? "Hôm nay"
                    : quickFilter === "tomorrow"
                      ? "Ngày mai"
                      : quickFilter === "thisweek"
                        ? "Tuần này"
                        : "Tuần tới"}
                </span>
              )}
              {selectedDate && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs text-cyan-700">
                  Ngày: {formatDateSafe(selectedDate)}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                    onClick={onClearDate}
                  />
                </span>
              )}
              {statusFilter !== "ALL" && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs text-cyan-700">
                  {statusFilter === "AVAILABLE"
                    ? "Còn trống"
                    : statusFilter === "BOOKED"
                      ? "Đã đặt"
                      : "Đã hủy"}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                    onClick={onClearStatus}
                  />
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs text-cyan-700">
                  Tìm: {searchTerm}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                    onClick={onClearSearch}
                  />
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
