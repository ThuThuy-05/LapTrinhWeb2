"use client";

import { useEffect, useState } from "react";
import {
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  formatScheduleDate,
  formatTime,
  getCurrentDate,
  formatDateForInput,
} from "@/services/scheduleService";
import { getAllDoctors } from "@/services/doctorService";
import { getAllRooms } from "@/services/roomService";
import { getAllSpecialties } from "@/services/specialtyService";
import {
  PlusCircle,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  Calendar,
  Clock,
  User,
  Stethoscope,
  Activity,
  Building2,
  DoorOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import Pagination from "@/components/Pagination";

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter states
  const [filters, setFilters] = useState({
    doctorId: "",
    specialtyId: "",
    roomId: "",
    date: getCurrentDate(),

    status: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form errors
  const [errors, setErrors] = useState({
    doctorId: "",
    date: "",
    timeStart: "",
    timeEnd: "",
    roomId: "",
  });

  const [formData, setFormData] = useState({
    doctorId: "",
    roomId: "",
    date: "",
    timeStart: "",
    timeEnd: "",
    status: "AVAILABLE",
  });

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setFetching(true);
      const [schData, docData, roomData, specData] = await Promise.all([
        getAllSchedules(),
        getAllDoctors(),
        getAllRooms(),
        getAllSpecialties(),
      ]);
      setSchedules(schData || []);
      setDoctors(docData || []);
      setRooms(roomData || []);
      setSpecialties(specData || []);
    } catch (e) {
      console.error("Lỗi tải dữ liệu:", e);
      alert("Không thể tải dữ liệu từ server");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchAllData();
    };

    loadData();
  }, []);

  // Filter schedules
  const filteredSchedules = schedules.filter((s) => {
    // Lọc theo bác sĩ
    if (filters.doctorId && s.doctor?.id.toString() !== filters.doctorId) {
      return false;
    }

    // Lọc theo chuyên khoa
    if (
      filters.specialtyId &&
      s.doctor?.specialty?.id.toString() !== filters.specialtyId
    ) {
      return false;
    }

    // Lọc theo phòng
    if (filters.roomId && s.room?.id.toString() !== filters.roomId) {
      return false;
    }

    // Lọc theo ngày
    if (filters.date && s.date !== filters.date) {
      return false;
    }

    // Lọc theo trạng thái
    if (filters.status && s.status !== filters.status) {
      return false;
    }

    return true;
  });

  // Sort by date desc, then time asc
  const sortedSchedules = [...filteredSchedules].sort((a, b) => {
    if (a.date !== b.date) {
      return b.date.localeCompare(a.date); // Ngày mới hơn lên trước
    }
    return a.timeStart.localeCompare(b.timeStart); // Cùng ngày thì giờ sớm hơn lên trước
  });

  const totalPages = Math.ceil(sortedSchedules.length / itemsPerPage);
  const currentData = sortedSlices(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Helper function
  function sortedSlices(start: number, end: number) {
    return sortedSchedules.slice(start, end);
  }

  // Reset filters
  const resetFilters = () => {
    setFilters({
      doctorId: "",
      specialtyId: "",
      roomId: "",
      date: getCurrentDate(),
      status: "",
    });
    setCurrentPage(1);
  };

  // Quick date filter
  const applyQuickDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    setFilters({ ...filters, date: `${year}-${month}-${day}` });
    setCurrentPage(1);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      doctorId: "",
      roomId: "",
      date: "",
      timeStart: "",
      timeEnd: "",
      status: "AVAILABLE",
    });
    setErrors({
      doctorId: "",
      date: "",
      timeStart: "",
      timeEnd: "",
      roomId: "",
    });
    setEditingId(null);
  };

  const handleOpenModal = (sch?: any) => {
    resetForm();
    if (sch) {
      setEditingId(sch.id);
      setFormData({
        doctorId: sch.doctor?.id.toString() || "",
        roomId: sch.room?.id.toString() || "",
        date: sch.date,
        timeStart: sch.timeStart?.substring(0, 5) || "",
        timeEnd: sch.timeEnd?.substring(0, 5) || "",
        status: sch.status,
      });
    }
    setIsModalOpen(true);
  };

  const handleView = (sch: any) => {
    setSelectedSchedule(sch);
    setIsViewModalOpen(true);
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      doctorId: "",
      date: "",
      timeStart: "",
      timeEnd: "",
      roomId: "",
    };

    if (!formData.doctorId) {
      newErrors.doctorId = "Vui lòng chọn bác sĩ";
      isValid = false;
    }

    if (!formData.roomId) {
      newErrors.roomId = "Vui lòng chọn phòng khám";
      isValid = false;
    }

    if (!formData.date) {
      newErrors.date = "Vui lòng chọn ngày trực";
      isValid = false;
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "Không thể chọn ngày trong quá khứ";
        isValid = false;
      }
    }

    if (!formData.timeStart) {
      newErrors.timeStart = "Vui lòng chọn giờ bắt đầu";
      isValid = false;
    }

    if (!formData.timeEnd) {
      newErrors.timeEnd = "Vui lòng chọn giờ kết thúc";
      isValid = false;
    }

    if (formData.timeStart && formData.timeEnd) {
      if (formData.timeStart >= formData.timeEnd) {
        newErrors.timeEnd = "Giờ kết thúc phải sau giờ bắt đầu";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const payload = {
        doctorId: Number(formData.doctorId),
        roomId: formData.roomId ? Number(formData.roomId) : undefined,
        date: formData.date,
        timeStart:
          formData.timeStart.length === 5
            ? `${formData.timeStart}:00`
            : formData.timeStart,
        timeEnd:
          formData.timeEnd.length === 5
            ? `${formData.timeEnd}:00`
            : formData.timeEnd,
        status: formData.status,
      };

      if (editingId) {
        await updateSchedule(editingId, payload);
        alert("Cập nhật lịch trực thành công!");
      } else {
        await createSchedule(payload);
        alert("Thêm mới lịch trực thành công!");
      }

      await fetchAllData();
      setIsModalOpen(false);
      resetForm();
    } catch (e: any) {
      console.error("Lỗi:", e);
      const message = e?.response?.data?.message || e?.message || "";

      if (
        message.toLowerCase().includes("tồn tại") ||
        message.toLowerCase().includes("duplicate")
      ) {
        setErrors((prev) => ({
          ...prev,
          timeStart: "Lịch trực này đã tồn tại!",
        }));
      } else if (message.toLowerCase().includes("khung giờ")) {
        setErrors((prev) => ({
          ...prev,
          timeStart: "Bác sĩ đã có lịch trong khung giờ này!",
        }));
      } else {
        alert("Lỗi: " + message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa lịch trực này?")) {
      try {
        await deleteSchedule(id);
        await fetchAllData();
        alert("Xóa lịch trực thành công!");
      } catch (e: any) {
        const message = e?.response?.data?.message || e?.message || "";
        if (message.toLowerCase().includes("đã được đặt")) {
          alert("Không thể xóa lịch đã được đặt!");
        } else {
          alert("Không thể xóa lịch trực này");
        }
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return {
          text: "Còn trống",
          className: "bg-[#E6F7F5] text-[#2DD4BF]",
          icon: <CheckCircle size={12} />,
        };
      case "BOOKED":
        return {
          text: "Đã đặt",
          className: "bg-amber-100 text-amber-700",
          icon: <XCircle size={12} />,
        };
      default:
        return {
          text: "Không xác định",
          className: "bg-slate-100 text-slate-500",
          icon: <AlertCircle size={12} />,
        };
    }
  };

  // Get unique doctors for filter
  const uniqueDoctors = doctors;
  const uniqueRooms = rooms;
  const uniqueSpecialties = specialties;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6F7F5] via-white to-[#F0FDFA] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#2DD4BF] text-sm font-semibold mb-1">
              <Activity size={14} className="text-[#2DD4BF]" />
              <span className="w-1 h-4 bg-gradient-to-b from-[#2DD4BF] to-[#0EA5E9] rounded-full"></span>
              3TH HOSPITAL MANAGEMENT SYSTEM
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1F4A5C]">
              Quản lý <span className="text-[#2DD4BF]">Lịch trực</span>
            </h1>
            <p className="text-[#5B8C9E] mt-1 text-sm">
              Tổng số:{" "}
              <span className="font-semibold text-[#2DD4BF]">
                {sortedSchedules.length}
              </span>{" "}
              lịch trực
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all text-sm ${
                showFilters
                  ? "bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white shadow-md"
                  : "bg-white text-[#1F4A5C] border border-[#D0F0FD] hover:bg-[#F0FDFA]"
              }`}
            >
              <Filter size={16} />
              {showFilters ? "Ẩn lọc" : "Hiện lọc"}
              <ChevronDown
                size={14}
                className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white px-5 py-2 rounded-xl font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all text-sm"
            >
              <PlusCircle size={16} />
              Thêm lịch
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-lg border border-[#D0F0FD] p-5 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[#1F4A5C] flex items-center gap-2">
                <Filter size={16} className="text-[#2DD4BF]" />
                Bộ lọc nâng cao
              </h3>
              <button
                onClick={resetFilters}
                className="text-sm text-[#2DD4BF] hover:text-[#0EA5E9] flex items-center gap-1"
              >
                <RefreshCw size={14} />
                Đặt lại
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* Filter by Doctor */}
              <div>
                <label className="text-xs font-semibold text-[#1F4A5C] mb-1 block">
                  Bác sĩ
                </label>
                <select
                  className="w-full px-3 py-2 bg-[#F0FDFA] rounded-xl border border-[#D0F0FD] focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 text-sm outline-none"
                  value={filters.doctorId}
                  onChange={(e) => {
                    setFilters({ ...filters, doctorId: e.target.value });
                    setCurrentPage(1);
                  }}
                >
                  <option value="">-- Tất cả --</option>
                  {uniqueDoctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.user?.fullName} ({d.specialty?.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter by Specialty */}
              <div>
                <label className="text-xs font-semibold text-[#1F4A5C] mb-1 block">
                  Chuyên khoa
                </label>
                <select
                  className="w-full px-3 py-2 bg-[#F0FDFA] rounded-xl border border-[#D0F0FD] focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 text-sm outline-none"
                  value={filters.specialtyId}
                  onChange={(e) => {
                    setFilters({ ...filters, specialtyId: e.target.value });
                    setCurrentPage(1);
                  }}
                >
                  <option value="">-- Tất cả --</option>
                  {uniqueSpecialties.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter by Room */}
              <div>
                <label className="text-xs font-semibold text-[#1F4A5C] mb-1 block">
                  Phòng khám
                </label>
                <select
                  className="w-full px-3 py-2 bg-[#F0FDFA] rounded-xl border border-[#D0F0FD] focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 text-sm outline-none"
                  value={filters.roomId}
                  onChange={(e) => {
                    setFilters({ ...filters, roomId: e.target.value });
                    setCurrentPage(1);
                  }}
                >
                  <option value="">-- Tất cả --</option>
                  {uniqueRooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.location})
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter by Date */}
              <div>
                <label className="text-xs font-semibold text-[#1F4A5C] mb-1 block">
                  Ngày trực
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 bg-[#F0FDFA] rounded-xl border border-[#D0F0FD] focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 text-sm outline-none"
                  value={filters.date}
                  onChange={(e) => {
                    setFilters({ ...filters, date: e.target.value });
                    setCurrentPage(1);
                  }}
                />

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => applyQuickDate(0)}
                    className="text-xs px-2 py-1 bg-[#E6F7F5] text-[#2DD4BF] rounded-lg hover:bg-[#2DD4BF] hover:text-white transition-all"
                  >
                    Hôm nay
                  </button>
                  <button
                    onClick={() => applyQuickDate(1)}
                    className="text-xs px-2 py-1 bg-[#E6F7F5] text-[#2DD4BF] rounded-lg hover:bg-[#2DD4BF] hover:text-white transition-all"
                  >
                    Ngày mai
                  </button>
                  <button
                    onClick={() => applyQuickDate(7)}
                    className="text-xs px-2 py-1 bg-[#E6F7F5] text-[#2DD4BF] rounded-lg hover:bg-[#2DD4BF] hover:text-white transition-all"
                  >
                    Tuần sau
                  </button>
                </div>
              </div>

              {/* Filter by Status */}
              <div>
                <label className="text-xs font-semibold text-[#1F4A5C] mb-1 block">
                  Trạng thái
                </label>
                <select
                  className="w-full px-3 py-2 bg-[#F0FDFA] rounded-xl border border-[#D0F0FD] focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 text-sm outline-none"
                  value={filters.status}
                  onChange={(e) => {
                    setFilters({ ...filters, status: e.target.value });
                    setCurrentPage(1);
                  }}
                >
                  <option value="">-- Tất cả --</option>
                  <option value="AVAILABLE">Còn trống</option>
                  <option value="BOOKED">Đã đặt</option>
                </select>
              </div>
            </div>

            {/* Active filters display */}
            {(filters.doctorId ||
              filters.specialtyId ||
              filters.roomId ||
              filters.status ||
              filters.date !== new Date().toISOString().split("T")[0]) && (
              <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[#D0F0FD]">
                <span className="text-xs text-[#5B8C9E]">Đang lọc theo:</span>
                {filters.doctorId && (
                  <span className="text-xs bg-[#E6F7F5] text-[#2DD4BF] px-2 py-1 rounded-full">
                    Bác sĩ:{" "}
                    {
                      doctors.find((d) => d.id.toString() === filters.doctorId)
                        ?.user?.fullName
                    }
                  </span>
                )}
                {filters.specialtyId && (
                  <span className="text-xs bg-[#E6F7F5] text-[#2DD4BF] px-2 py-1 rounded-full">
                    Chuyên khoa:{" "}
                    {
                      specialties.find(
                        (s) => s.id.toString() === filters.specialtyId,
                      )?.name
                    }
                  </span>
                )}
                {filters.roomId && (
                  <span className="text-xs bg-[#E6F7F5] text-[#2DD4BF] px-2 py-1 rounded-full">
                    Phòng:{" "}
                    {
                      rooms.find((r) => r.id.toString() === filters.roomId)
                        ?.name
                    }
                  </span>
                )}
                {filters.date && (
                  <span className="text-xs bg-[#E6F7F5] text-[#2DD4BF] px-2 py-1 rounded-full">
                    Ngày: {formatScheduleDate(filters.date)}
                  </span>
                )}
                {filters.status && (
                  <span className="text-xs bg-[#E6F7F5] text-[#2DD4BF] px-2 py-1 rounded-full">
                    Trạng thái:{" "}
                    {filters.status === "AVAILABLE" ? "Còn trống" : "Đã đặt"}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#D0F0FD] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#E6F7F5] to-[#F0FDFA] border-b border-[#D0F0FD]">
                  <th className="px-5 py-4 text-left text-xs font-semibold text-[#1F4A5C] uppercase tracking-wider">
                    Bác sĩ
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-[#1F4A5C] uppercase tracking-wider">
                    Chuyên khoa
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-[#1F4A5C] uppercase tracking-wider">
                    Ngày trực
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-[#1F4A5C] uppercase tracking-wider">
                    Khung giờ
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-[#1F4A5C] uppercase tracking-wider">
                    Phòng
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-[#1F4A5C] uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-5 py-4 text-right text-xs font-semibold text-[#1F4A5C] uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6F7F5]">
                {fetching ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <Loader2
                        className="animate-spin mx-auto text-[#2DD4BF]"
                        size={32}
                      />
                      <p className="text-[#5B8C9E] text-sm mt-2">
                        Đang tải dữ liệu...
                      </p>
                    </td>
                  </tr>
                ) : currentData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-[#5B8C9E]"
                    >
                      <Calendar
                        size={40}
                        className="mx-auto mb-3 text-[#D0F0FD]"
                      />
                      Không tìm thấy lịch trực nào
                    </td>
                  </tr>
                ) : (
                  currentData.map((sch) => (
                    <tr
                      key={sch.id}
                      className="hover:bg-[#2DD4BF]/5 transition-all duration-200 group"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E6F7F5] to-[#F0FDFA] flex items-center justify-center shadow-inner">
                            {sch.doctor?.user?.avatar ? (
                              <img
                                src={sch.doctor.user.avatar}
                                className="w-full h-full object-cover rounded-xl"
                                alt=""
                              />
                            ) : (
                              <User size={18} className="text-[#2DD4BF]" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-[#1F4A5C] text-sm">
                              {sch.doctor?.user?.fullName || "---"}
                            </p>
                            <p className="text-xs text-[#5B8C9E]">
                              ID: {sch.doctor?.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#E6F7F5] text-[#2DD4BF] rounded-lg text-xs font-medium">
                          <Stethoscope size={12} />
                          {sch.doctor?.specialty?.name || "---"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1 text-sm text-[#1F4A5C]">
                          <Calendar size={14} className="text-[#2DD4BF]" />
                          {formatScheduleDate(sch.date)}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium">
                          <Clock size={12} />
                          {formatTime(sch.timeStart)} -{" "}
                          {formatTime(sch.timeEnd)}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        {sch.room ? (
                          <div className="flex items-center gap-1 text-sm text-[#1F4A5C]">
                            <DoorOpen size={14} className="text-[#2DD4BF]" />
                            <span>{sch.room.name}</span>
                            <span className="text-xs text-[#5B8C9E]">
                              ({sch.room.location})
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-[#5B8C9E]">---</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(sch.status).className}`}
                        >
                          {getStatusBadge(sch.status).icon}
                          {getStatusBadge(sch.status).text}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => handleView(sch)}
                            className="p-1.5 text-[#5B8C9E] hover:text-[#2DD4BF] hover:bg-[#E6F7F5] rounded-lg transition-all"
                            title="Xem chi tiết"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                          {sch.status === "AVAILABLE" && (
                            <>
                              <button
                                onClick={() => handleOpenModal(sch)}
                                className="p-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all"
                                title="Sửa"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(sch.id)}
                                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                                title="Xóa"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                          {sch.status === "BOOKED" && (
                            <span className="text-xs text-[#5B8C9E] px-2">
                              Không thể sửa/xóa
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

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

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-8">
              <div className="bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] px-6 py-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Calendar size={18} />
                  {editingId ? "✏️ Cập nhật" : "➕ Thêm mới"} Lịch trực
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {/* Bác sĩ */}
                  <div>
                    <label className="text-xs font-semibold text-[#1F4A5C] mb-1 block">
                      Bác sĩ <span className="text-red-500">*</span>
                    </label>
                    <select
                      className={`w-full px-4 py-2.5 bg-[#F0FDFA] rounded-xl border text-sm outline-none transition-all ${errors.doctorId ? "border-red-500" : "border-[#D0F0FD] focus:border-[#2DD4BF]"}`}
                      value={formData.doctorId}
                      onChange={(e) => {
                        setFormData({ ...formData, doctorId: e.target.value });
                        setErrors({ ...errors, doctorId: "" });
                      }}
                    >
                      <option value="">-- Chọn bác sĩ --</option>
                      {doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.user?.fullName} ({d.specialty?.name})
                        </option>
                      ))}
                    </select>
                    {errors.doctorId && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.doctorId}
                      </p>
                    )}
                  </div>

                  {/* Phòng khám - ĐÃ THÊM VALIDATION */}
                  <div>
                    <label className="text-xs font-semibold text-[#1F4A5C] mb-1 block">
                      Phòng khám <span className="text-red-500">*</span>
                    </label>
                    <select
                      className={`w-full px-4 py-2.5 bg-[#F0FDFA] rounded-xl border text-sm outline-none transition-all 
                ${errors.roomId ? "border-red-500 focus:ring-red-200" : "border-[#D0F0FD] focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20"}`}
                      value={formData.roomId}
                      onChange={(e) => {
                        setFormData({ ...formData, roomId: e.target.value });
                        setErrors({ ...errors, roomId: "" });
                      }}
                    >
                      <option value="">-- Chọn phòng khám --</option>
                      {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name} - {room.location} ({room.branch?.name})
                        </option>
                      ))}
                    </select>
                    {errors.roomId && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <XCircle size={12} />
                        {errors.roomId}
                      </p>
                    )}
                  </div>

                  {/* Ngày trực */}
                  <div>
                    <label className="text-xs font-semibold text-[#1F4A5C] mb-1 block">
                      Ngày trực <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className={`w-full px-4 py-2.5 bg-[#F0FDFA] rounded-xl border text-sm outline-none transition-all ${errors.date ? "border-red-500" : "border-[#D0F0FD] focus:border-[#2DD4BF]"}`}
                      value={formData.date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => {
                        setFormData({ ...formData, date: e.target.value });
                        setErrors({ ...errors, date: "" });
                      }}
                    />
                    {errors.date && (
                      <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                    )}
                  </div>

                  {/* Giờ bắt đầu + Giờ kết thúc */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#1F4A5C] mb-1 block">
                        Giờ bắt đầu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        className={`w-full px-4 py-2.5 bg-[#F0FDFA] rounded-xl border text-sm outline-none transition-all ${errors.timeStart ? "border-red-500" : "border-[#D0F0FD] focus:border-[#2DD4BF]"}`}
                        value={formData.timeStart}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            timeStart: e.target.value,
                          });
                          setErrors({ ...errors, timeStart: "", timeEnd: "" });
                        }}
                      />
                      {errors.timeStart && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.timeStart}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#1F4A5C] mb-1 block">
                        Giờ kết thúc <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        className={`w-full px-4 py-2.5 bg-[#F0FDFA] rounded-xl border text-sm outline-none transition-all ${errors.timeEnd ? "border-red-500" : "border-[#D0F0FD] focus:border-[#2DD4BF]"}`}
                        value={formData.timeEnd}
                        onChange={(e) => {
                          setFormData({ ...formData, timeEnd: e.target.value });
                          setErrors({ ...errors, timeEnd: "" });
                        }}
                      />
                      {errors.timeEnd && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.timeEnd}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Trạng thái */}
                  <div>
                    <label className="text-xs font-semibold text-[#1F4A5C] mb-1 block">
                      Trạng thái
                    </label>
                    <select
                      className="w-full px-4 py-2.5 bg-[#F0FDFA] rounded-xl border border-[#D0F0FD] focus:border-[#2DD4BF] text-sm outline-none transition-all"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      <option value="AVAILABLE">Còn trống</option>
                      <option value="BOOKED">Đã đặt</option>
                    </select>
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white font-semibold text-sm hover:from-[#14B8A6] hover:to-[#0284C7] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : editingId ? (
                      "Cập nhật"
                    ) : (
                      "Thêm mới"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Detail Modal */}
        {isViewModalOpen && selectedSchedule && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] px-6 py-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Calendar size={18} />
                  Chi tiết lịch trực
                </h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E6F7F5]">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E6F7F5] to-[#F0FDFA] flex items-center justify-center">
                    {selectedSchedule.doctor?.user?.avatar ? (
                      <img
                        src={selectedSchedule.doctor.user.avatar}
                        className="w-full h-full object-cover rounded-xl"
                        alt=""
                      />
                    ) : (
                      <User size={22} className="text-[#2DD4BF]" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1F4A5C]">
                      {selectedSchedule.doctor?.user?.fullName}
                    </h3>
                    <p className="text-xs text-[#2DD4BF]">
                      {selectedSchedule.doctor?.specialty?.name}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-[#E6F7F5]">
                    <span className="text-[#5B8C9E] flex items-center gap-1">
                      <Calendar size={14} className="text-[#2DD4BF]" /> Ngày
                      trực:
                    </span>
                    <span className="font-medium text-[#1F4A5C]">
                      {formatScheduleDate(selectedSchedule.date)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#E6F7F5]">
                    <span className="text-[#5B8C9E] flex items-center gap-1">
                      <Clock size={14} className="text-[#2DD4BF]" /> Khung giờ:
                    </span>
                    <span className="font-medium text-amber-700">
                      {formatTime(selectedSchedule.timeStart)} -{" "}
                      {formatTime(selectedSchedule.timeEnd)}
                    </span>
                  </div>
                  {selectedSchedule.room && (
                    <div className="flex justify-between items-center py-2 border-b border-[#E6F7F5]">
                      <span className="text-[#5B8C9E] flex items-center gap-1">
                        <DoorOpen size={14} className="text-[#2DD4BF]" /> Phòng:
                      </span>
                      <span className="font-medium text-[#1F4A5C]">
                        {selectedSchedule.room.name} (
                        {selectedSchedule.room.location})
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 border-b border-[#E6F7F5]">
                    <span className="text-[#5B8C9E] flex items-center gap-1">
                      <Building2 size={14} className="text-[#2DD4BF]" /> Chi
                      nhánh:
                    </span>
                    <span className="font-medium text-[#1F4A5C]">
                      {selectedSchedule.doctor?.branch?.name || "---"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[#5B8C9E]">Trạng thái:</span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedSchedule.status).className}`}
                    >
                      {getStatusBadge(selectedSchedule.status).icon}
                      {getStatusBadge(selectedSchedule.status).text}
                    </span>
                  </div>
                </div>
              </div>
              <div className="border-t border-[#E6F7F5] px-6 py-4 flex justify-end bg-[#F0FDFA]">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white text-sm font-medium hover:shadow-md transition-all"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
