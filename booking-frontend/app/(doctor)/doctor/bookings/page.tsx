"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import {
  Stethoscope,
  AlertCircle,
  CheckCircle2,
  X,
  RefreshCw,
  UserCheck,
} from "lucide-react";

import {
  Booking,
  getBookingsByDoctor,
  updateBookingStatusByDoctor,
} from "@/services/bookingService";

import BookingStats from "./components/BookingStats";
import BookingFilters from "./components/BookingFilters";
import BookingTable from "./components/BookingTable";
import BookingDetailModal from "./components/BookingDetailModal";
import Pagination from "@/components/Pagination";

type FilterType = "ALL" | "TODAY" | "TOMORROW" | "THIS_WEEK" | "NEXT_WEEK";
type StatusFilter = "ALL" | "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export default function DoctorPatientsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [updating, setUpdating] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const hasFetched = useRef(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;

  // ✅ Định nghĩa fetchBookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const userStr = localStorage.getItem("user");
      if (!userStr) throw new Error("Không tìm thấy thông tin đăng nhập");
      const user = JSON.parse(userStr);
      if (!user.doctorId) throw new Error("Không tìm thấy thông tin bác sĩ");
      setDoctorInfo(user);
      const data = await getBookingsByDoctor(user.doctorId);
      setBookings(data);
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      setErrorMessage(
        error.response?.data?.message || error.message || "Lỗi khi tải dữ liệu",
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Gọi fetchBookings lần đầu
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchBookings();
    }
  }, []);

  // Auto hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Auto hide error message
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Filter logic
  const filteredBookings = useMemo(() => {
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

    let filtered = [...bookings];

    if (selectedDate) {
      const targetDate = new Date(selectedDate);
      targetDate.setHours(0, 0, 0, 0);
      filtered = bookings.filter((booking) => {
        const bookingDate = new Date(booking.bookingDate);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate.getTime() === targetDate.getTime();
      });
    } else if (filterType !== "ALL") {
      filtered = bookings.filter((booking) => {
        const bookingDate = new Date(booking.bookingDate);
        bookingDate.setHours(0, 0, 0, 0);
        switch (filterType) {
          case "TODAY":
            return bookingDate.getTime() === today.getTime();
          case "TOMORROW":
            return bookingDate.getTime() === tomorrow.getTime();
          case "THIS_WEEK":
            return bookingDate >= startOfWeek && bookingDate <= endOfWeek;
          case "NEXT_WEEK":
            return (
              bookingDate >= startOfNextWeek && bookingDate <= endOfNextWeek
            );
          default:
            return true;
        }
      });
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter(
        (booking) => booking.status?.toUpperCase() === statusFilter,
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.user?.fullName?.toLowerCase().includes(term) ||
          booking.user?.phone?.includes(term) ||
          booking.symptom?.toLowerCase().includes(term),
      );
    }

    return filtered.sort(
      (a, b) =>
        new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime(),
    );
  }, [bookings, filterType, statusFilter, searchTerm, selectedDate]);

  // Phân trang
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBookings.slice(startIndex, endIndex);
  }, [filteredBookings, currentPage]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  // Reset page khi filter thay đổi
  const handleFilterTypeChange = (type: FilterType) => {
    setFilterType(type);
    setSelectedDate(null);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (status: StatusFilter) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setFilterType("ALL");
    setShowCalendar(false);
    setCurrentPage(1);
  };

  const clearDateFilter = () => {
    setSelectedDate(null);
    setFilterType("ALL");
    setCurrentPage(1);
  };

  const getFilterCount = (filter: FilterType) => {
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

    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.bookingDate);
      bookingDate.setHours(0, 0, 0, 0);
      switch (filter) {
        case "TODAY":
          return bookingDate.getTime() === today.getTime();
        case "TOMORROW":
          return bookingDate.getTime() === tomorrow.getTime();
        case "THIS_WEEK":
          return bookingDate >= startOfWeek && bookingDate <= endOfWeek;
        case "NEXT_WEEK":
          return bookingDate >= startOfNextWeek && bookingDate <= endOfNextWeek;
        default:
          return true;
      }
    }).length;
  };

  const getStatusCount = (status: StatusFilter) => {
    if (status === "ALL") return bookings.length;
    return bookings.filter((b) => b.status?.toUpperCase() === status).length;
  };

  const handleUpdateStatus = async (bookingId: number, newStatus: string) => {
    try {
      setUpdating(true);
      const updateData: any = { status: newStatus };
      await updateBookingStatusByDoctor(bookingId, updateData);
      await fetchBookings();
      setSuccessMessage(
        newStatus === "COMPLETED"
          ? "Đã lưu hồ sơ bệnh án và hoàn thành khám!"
          : "Cập nhật trạng thái thành công!",
      );
      setShowDetailModal(false);
    } catch (error) {
      console.error(error);
      setErrorMessage("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setUpdating(false);
    }
  };

  const handleOpenModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const stats = useMemo(
    () => ({
      total: bookings.length,
      pending: bookings.filter((b) => b.status?.toUpperCase() === "PENDING")
        .length,
      confirmed: bookings.filter((b) => b.status?.toUpperCase() === "CONFIRMED")
        .length,
      completed: bookings.filter((b) => b.status?.toUpperCase() === "COMPLETED")
        .length,
      today: bookings.filter((b) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const bookingDate = new Date(b.bookingDate);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate.getTime() === today.getTime();
      }).length,
    }),
    [bookings],
  );

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    return days;
  };

  const getBookingsForDate = (date: Date) => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.bookingDate);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === targetDate.getTime();
    });
  };

  const changeMonth = (increment: number) => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + increment,
        1,
      ),
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-cyan-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-slate-600 font-medium">
            Đang tải danh sách bệnh nhân...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="relative overflow-hidden bg-white border-b border-slate-200 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-emerald-500/5"></div>
        <div className="max-w-7xl mx-auto px-6 py-6 relative">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl shadow-lg">
                <UserCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  Quản lý bệnh nhân
                </h1>
                <p className="text-slate-500 text-sm mt-0.5">
                  Danh sách bệnh nhân đã đặt lịch khám
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="fixed top-20 right-4 z-50 bg-red-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-right duration-300">
          <AlertCircle className="w-5 h-5" />
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="ml-2 hover:bg-red-600 rounded-lg p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {successMessage && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-right duration-300">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            className="ml-2 hover:bg-green-600 rounded-lg p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <BookingStats stats={stats} />

        {/* Filters */}
        <BookingFilters
          bookings={bookings}
          filterType={filterType}
          statusFilter={statusFilter}
          searchTerm={searchTerm}
          selectedDate={selectedDate}
          showCalendar={showCalendar}
          currentMonth={currentMonth}
          onFilterTypeChange={handleFilterTypeChange}
          onStatusFilterChange={handleStatusFilterChange}
          onSearchTermChange={handleSearchTermChange}
          onDateSelect={handleDateSelect}
          onClearDateFilter={clearDateFilter}
          onToggleCalendar={() => setShowCalendar(!showCalendar)}
          onChangeMonth={changeMonth}
          getFilterCount={getFilterCount}
          getStatusCount={getStatusCount}
          getDaysInMonth={getDaysInMonth}
          getBookingsForDate={getBookingsForDate}
        />

        {/* Patients Table */}
        <BookingTable
          bookings={paginatedBookings}
          onViewDetail={handleOpenModal}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          updating={updating}
          onClose={() => setShowDetailModal(false)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}
