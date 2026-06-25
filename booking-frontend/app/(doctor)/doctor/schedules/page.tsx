"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Stethoscope, Calendar } from "lucide-react";
import { Schedule, getSchedulesByDoctor } from "@/services/scheduleService";

import ScheduleStats from "./components/ScheduleStats";
import ScheduleFilters from "./components/ScheduleFilters";
import ScheduleTable from "./components/ScheduleTable";
import CalendarModal from "./components/CalendarModal";
import Pagination from "@/components/Pagination";

type StatusFilter = "ALL" | "AVAILABLE" | "BOOKED" | "CANCELLED";

export default function DoctorSchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [quickFilter, setQuickFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1); // 👈 thêm
  const itemsPerPage = 2; // 👈 10 items mỗi trang
  const isFirstRender = useRef(true);

  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    booked: 0,
    cancelled: 0,
  });

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) throw new Error("Không tìm thấy user");
        const user = JSON.parse(userStr);
        if (!user.doctorId) throw new Error("Không có doctorId");
        const data = await getSchedulesByDoctor(user.doctorId);
        setSchedules(data);
        setStats({
          total: data.length,
          available: data.filter((s: Schedule) => s.status === "AVAILABLE")
            .length,
          booked: data.filter((s: Schedule) => s.status === "BOOKED").length,
          cancelled: data.filter((s: Schedule) => s.status === "CANCELLED")
            .length,
        });
      } catch (error: any) {
        console.error(error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  useEffect(() => {
    if (showCalendar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showCalendar]);

  // 👈 Reset về trang 1 khi filter thay đổi (trừ lần đầu)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setCurrentPage(1);
  }, [quickFilter, selectedDate, statusFilter, searchTerm]);

  const applyQuickFilter = (filter: string) => {
    setQuickFilter(filter);
    setSelectedDate(null);
  };

  const filteredSchedules = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    const startOfNextWeek = new Date(endOfWeek);
    startOfNextWeek.setDate(endOfWeek.getDate() + 1);
    startOfNextWeek.setHours(0, 0, 0, 0);
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
    endOfNextWeek.setHours(23, 59, 59, 999);

    let filtered = schedules;

    if (quickFilter !== "all") {
      filtered = schedules.filter((schedule) => {
        const d = new Date(schedule.date);
        d.setHours(0, 0, 0, 0);
        switch (quickFilter) {
          case "today":
            return d.getTime() === today.getTime();
          case "tomorrow":
            return d.getTime() === tomorrow.getTime();
          case "thisweek":
            return d >= startOfWeek && d <= endOfWeek;
          case "nextweek":
            return d >= startOfNextWeek && d <= endOfNextWeek;
          default:
            return true;
        }
      });
    }
    if (selectedDate) {
      filtered = filtered.filter(
        (s) => new Date(s.date).toDateString() === selectedDate.toDateString(),
      );
    }
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (s) =>
          s.room?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.room?.location?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [schedules, quickFilter, selectedDate, statusFilter, searchTerm]);

  // 👈 Phân trang
  const paginatedSchedules = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSchedules.slice(startIndex, endIndex);
  }, [filteredSchedules, currentPage]);

  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);

  const getQuickFilterCount = (filter: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    const startOfNextWeek = new Date(endOfWeek);
    startOfNextWeek.setDate(endOfWeek.getDate() + 1);
    startOfNextWeek.setHours(0, 0, 0, 0);
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
    endOfNextWeek.setHours(23, 59, 59, 999);

    return schedules.filter((schedule) => {
      const d = new Date(schedule.date);
      d.setHours(0, 0, 0, 0);
      switch (filter) {
        case "today":
          return d.getTime() === today.getTime();
        case "tomorrow":
          return d.getTime() === tomorrow.getTime();
        case "thisweek":
          return d >= startOfWeek && d <= endOfWeek;
        case "nextweek":
          return d >= startOfNextWeek && d <= endOfNextWeek;
        default:
          return true;
      }
    }).length;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setQuickFilter("all");
    setShowCalendar(false);
  };

  const clearDateFilter = () => setSelectedDate(null);
  const changeMonth = (inc: number) =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + inc, 1),
    );
  const handleToday = () => {
    setSelectedDate(new Date());
    setQuickFilter("all");
    setShowCalendar(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent"></div>
          <p className="mt-4 text-slate-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="relative overflow-hidden bg-white border-b border-slate-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl shadow-lg">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  Lịch trực cá nhân
                </h1>
                <p className="text-slate-500 mt-1">
                  Quản lý lịch làm việc và theo dõi lịch khám bệnh
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
              <Calendar className="w-5 h-5 text-cyan-500" />
              <div className="text-right">
                <div className="text-sm font-medium text-slate-700">
                  {new Date().toLocaleDateString("vi-VN", { weekday: "long" })}
                </div>
                <div className="text-xs text-slate-400">
                  {new Date().toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <ScheduleStats stats={stats} />

        <ScheduleFilters
          quickFilter={quickFilter}
          statusFilter={statusFilter}
          searchTerm={searchTerm}
          selectedDate={selectedDate}
          onQuickFilterChange={applyQuickFilter}
          onStatusFilterChange={setStatusFilter}
          onSearchTermChange={setSearchTerm}
          onOpenCalendar={() => setShowCalendar(true)}
          onClearDate={clearDateFilter}
          onClearStatus={() => setStatusFilter("ALL")}
          onClearSearch={() => setSearchTerm("")}
          getQuickFilterCount={getQuickFilterCount}
        />

        {/* 👈 Truyền dữ liệu đã phân trang */}
        <ScheduleTable
          schedules={paginatedSchedules}
          totalSchedules={filteredSchedules.length}
        />

        {/* 👈 Thêm Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        <CalendarModal
          isOpen={showCalendar}
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          schedules={schedules}
          onClose={() => setShowCalendar(false)}
          onDateSelect={handleDateSelect}
          onChangeMonth={changeMonth}
          onClear={() => {
            setSelectedDate(null);
            setShowCalendar(false);
          }}
          onToday={handleToday}
        />
      </div>
    </div>
  );
}
