// app/admin/rooms/components/RoomFilters.tsx
"use client";

import { Search, RefreshCw, Filter } from "lucide-react";

interface RoomFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  onReset: () => void;
}

export default function RoomFilters({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  onReset,
}: RoomFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm phòng khám..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-400 focus:ring-2 focus:ring-teal-200 outline-none transition text-sm"
            />
          </div>
        </div>

        <div className="w-44">
          <select
            value={filterStatus}
            onChange={(e) => onFilterStatusChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-400 focus:ring-2 focus:ring-teal-200 outline-none transition text-sm text-slate-700"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Ngừng hoạt động</option>
          </select>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm">Làm mới</span>
        </button>
      </div>
    </div>
  );
}
