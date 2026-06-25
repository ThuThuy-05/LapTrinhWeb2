"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Stethoscope, User, RefreshCw } from "lucide-react";
import {
  getPatientsByDoctor,
  // getPatientBookings,
} from "@/services/bookingService";
import Pagination from "@/components/Pagination";

import PatientStats from "./components/PatientStats";
import PatientFilters from "./components/PatientFilters";
import PatientTable from "./components/PatientTable";
import PatientDetailModal from "./components/PatientDetailModal";

type StatusFilter = "ALL" | "COMPLETED" | "CANCELLED";
type DateFilterType = "ALL" | "TODAY" | "TOMORROW" | "THIS_WEEK" | "NEXT_WEEK";

// Type cho bệnh nhân đã gộp
interface GroupedPatient {
  userId: number;
  fullName: string;
  phone: string;
  email: string;
  gender: string;
  address: string;
  dateOfBirth?: string;
  latestBookingDate: string;
  latestStatus: string;
  latestSymptom: string;
  allBookings: any[];
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [dateFilter, setDateFilter] = useState<DateFilterType>("ALL");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  const [selectedPatient, setSelectedPatient] = useState<GroupedPatient | null>(
    null,
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const itemsPerPage = 10;

  const didLoad = useRef(false);

  // useEffect(() => {
  //   loadData();
  // }, []);

  // const loadData = async () => {
  //   try {
  //     setLoading(true);
  //     const userStr = localStorage.getItem("user");
  //     if (!userStr) throw new Error("Không tìm thấy thông tin đăng nhập");
  //     const user = JSON.parse(userStr);
  //     if (!user.doctorId) throw new Error("Không tìm thấy thông tin bác sĩ");
  //     setDoctorInfo(user);
  //     const data = await getPatientsByDoctor(user.doctorId);
  //     setPatients(data);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadData = async () => {
    try {
      setLoading(true);

      const userStr = localStorage.getItem("user");
      if (!userStr) throw new Error("Không tìm thấy thông tin đăng nhập");

      const user = JSON.parse(userStr);

      if (!user.doctorId) throw new Error("Không tìm thấy thông tin bác sĩ");

      setDoctorInfo(user);

      const data = await getPatientsByDoctor(user.doctorId);

      setPatients(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (didLoad.current) return;
    didLoad.current = true;

    loadData();
  }, []);

  // Gộp bệnh nhân: mỗi người 1 dòng
  const groupedPatients = useMemo(() => {
    const userMap = new Map<number, GroupedPatient>();

    patients.forEach((booking) => {
      const userId = booking.user?.id;
      if (!userId) return;

      if (!userMap.has(userId)) {
        userMap.set(userId, {
          userId: userId,
          fullName: booking.user?.fullName || "N/A",
          phone: booking.user?.phone || "N/A",
          email: booking.user?.email || "N/A",
          gender: booking.user?.gender || "OTHER",
          address: booking.user?.address || "N/A",
          dateOfBirth: booking.user?.dateOfBirth,
          latestBookingDate: booking.bookingDate,
          latestStatus: booking.status,
          latestSymptom: booking.symptom,
          allBookings: [booking],
        });
      } else {
        const existing = userMap.get(userId)!;
        existing.allBookings.push(booking);
        if (
          new Date(booking.bookingDate) > new Date(existing.latestBookingDate)
        ) {
          existing.latestBookingDate = booking.bookingDate;
          existing.latestStatus = booking.status;
          existing.latestSymptom = booking.symptom;
        }
      }
    });

    return Array.from(userMap.values()).sort(
      (a, b) =>
        new Date(b.latestBookingDate).getTime() -
        new Date(a.latestBookingDate).getTime(),
    );
  }, [patients]);

  // Lọc theo ngày
  const filterByDate = (bookings: any[]) => {
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

    if (selectedDate) {
      const targetDate = new Date(selectedDate);
      targetDate.setHours(0, 0, 0, 0);
      return bookings.filter((booking) => {
        const bookingDate = new Date(booking.latestBookingDate);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate.getTime() === targetDate.getTime();
      });
    }

    switch (dateFilter) {
      case "TODAY":
        return bookings.filter((p) => {
          const d = new Date(p.latestBookingDate);
          d.setHours(0, 0, 0, 0);
          return d.getTime() === today.getTime();
        });
      case "TOMORROW":
        return bookings.filter((p) => {
          const d = new Date(p.latestBookingDate);
          d.setHours(0, 0, 0, 0);
          return d.getTime() === tomorrow.getTime();
        });
      case "THIS_WEEK":
        return bookings.filter((p) => {
          const d = new Date(p.latestBookingDate);
          d.setHours(0, 0, 0, 0);
          return d >= startOfWeek && d <= endOfWeek;
        });
      case "NEXT_WEEK":
        return bookings.filter((p) => {
          const d = new Date(p.latestBookingDate);
          d.setHours(0, 0, 0, 0);
          return d >= startOfNextWeek && d <= endOfNextWeek;
        });
      default:
        return bookings;
    }
  };

  // Lọc theo status và search
  const filteredPatients = useMemo(() => {
    let filtered = [...groupedPatients];

    // Lọc theo trạng thái
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(
        (p) => p.latestStatus?.toUpperCase() === statusFilter,
      );
    }

    // Lọc theo ngày
    filtered = filterByDate(filtered);

    // Lọc theo search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.fullName.toLowerCase().includes(term) || p.phone.includes(term),
      );
    }

    return filtered;
  }, [groupedPatients, statusFilter, dateFilter, selectedDate, searchTerm]);

  // Phân trang
  const paginatedPatients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPatients.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPatients, currentPage]);

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  // Reset page khi filter thay đổi
  const handleStatusFilterChange = (status: StatusFilter) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleDateFilterChange = (filter: DateFilterType) => {
    setDateFilter(filter);
    setSelectedDate(null);
    setCurrentPage(1);
  };

  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setDateFilter("ALL");
    setShowCalendar(false);
    setCurrentPage(1);
  };

  const clearDateFilter = () => {
    setSelectedDate(null);
    setDateFilter("ALL");
    setCurrentPage(1);
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

  const getStatusCount = (status: StatusFilter) => {
    if (status === "ALL") return groupedPatients.length;
    return groupedPatients.filter(
      (p) => p.latestStatus?.toUpperCase() === status,
    ).length;
  };

  const getDateFilterCount = (filter: DateFilterType) => {
    if (filter === "ALL") return groupedPatients.length;
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

    return groupedPatients.filter((p) => {
      const d = new Date(p.latestBookingDate);
      d.setHours(0, 0, 0, 0);
      switch (filter) {
        case "TODAY":
          return d.getTime() === today.getTime();
        case "TOMORROW":
          return d.getTime() === tomorrow.getTime();
        case "THIS_WEEK":
          return d >= startOfWeek && d <= endOfWeek;
        case "NEXT_WEEK":
          return d >= startOfNextWeek && d <= endOfNextWeek;
        default:
          return true;
      }
    }).length;
  };

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
    return groupedPatients.filter((p) => {
      const bookingDate = new Date(p.latestBookingDate);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === targetDate.getTime();
    });
  };

  // const handleViewDetail = async (patient: GroupedPatient) => {
  //   setSelectedPatient(patient);
  //   setShowDetailModal(true);
  // };

  const handleViewDetail = (patient: GroupedPatient) => {
    setSelectedPatient(patient);
    setShowDetailModal(true);
  };

  const stats = useMemo(
    () => ({
      total: groupedPatients.length,
      completed: groupedPatients.filter(
        (p) => p.latestStatus?.toUpperCase() === "COMPLETED",
      ).length,
      cancelled: groupedPatients.filter(
        (p) => p.latestStatus?.toUpperCase() === "CANCELLED",
      ).length,
    }),
    [groupedPatients],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent"></div>
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
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl shadow-lg">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  Danh sách bệnh nhân
                </h1>
                <p className="text-slate-500 text-sm mt-0.5">
                  Quản lý thông tin bệnh nhân và lịch sử khám bệnh
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-700">
                  BS. {doctorInfo?.fullName || doctorInfo?.firstName || ""}
                </p>
                <p className="text-xs text-slate-400">Bác sĩ chuyên khoa</p>
              </div>
              <button
                onClick={loadData}
                className="p-2.5 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
              >
                <RefreshCw className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <PatientStats stats={stats} />

        <PatientFilters
          statusFilter={statusFilter}
          dateFilter={dateFilter}
          searchTerm={searchTerm}
          selectedDate={selectedDate}
          showCalendar={showCalendar}
          currentMonth={currentMonth}
          onStatusFilterChange={handleStatusFilterChange}
          onDateFilterChange={handleDateFilterChange}
          onSearchTermChange={handleSearchTermChange}
          onDateSelect={handleDateSelect}
          onClearDate={clearDateFilter}
          onToggleCalendar={() => setShowCalendar(!showCalendar)}
          onChangeMonth={changeMonth}
          getStatusCount={getStatusCount}
          getDateFilterCount={getDateFilterCount}
          getDaysInMonth={getDaysInMonth}
          getBookingsForDate={getBookingsForDate}
        />

        <PatientTable
          patients={paginatedPatients}
          totalPatients={filteredPatients.length}
          onViewDetail={handleViewDetail}
        />

        {showDetailModal && selectedPatient && (
          <PatientDetailModal
            patient={selectedPatient}
            onClose={() => setShowDetailModal(false)}
          />
        )}

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
    </div>
  );
}
