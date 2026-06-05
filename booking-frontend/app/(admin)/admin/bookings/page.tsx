"use client";

import { useEffect, useState } from "react";
import {
  getAllBookings,
  getBookingById,
  Booking,
} from "@/services/bookingService";
import Pagination from "@/components/Pagination";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Activity,
  Building2,
  DoorOpen,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  X,
  Loader2,
  Eye,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  Sparkles,
  CheckCircle,
  Clock8,
  DollarSign,
  GraduationCap,
  Briefcase,
  FileText,
  QrCode,
  Maximize2,
} from "lucide-react";

// Font style đồng bộ
const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800;14..32,900&display=swap');
  .booking-page * {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
`;

// const [filterDate, setFilterDate] = useState<string>("");

// Hàm format ngày
const formatDate = (dateString: string) => {
  if (!dateString) return "---";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Hàm format giờ
const formatTime = (timeString: string) => {
  if (!timeString) return "---";
  return timeString.substring(0, 5);
};

// Hàm format datetime đầy đủ
const formatDateTime = (dateString: string) => {
  if (!dateString) return "---";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
// Thêm vào phần state

// Format giá tiền
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price || 0);
};

// Component hiển thị chi tiết
function DetailBlock({ label, value, icon, fullWidth = false }: any) {
  return (
    <div
      className={`group p-4 bg-gradient-to-br from-white to-[#F0F9FF] rounded-2xl border border-[#D0F0FD] hover:border-[#2DD4BF] hover:shadow-md transition-all duration-300 ${fullWidth ? "col-span-2" : ""}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[#14B8A6] group-hover:scale-110 transition-transform duration-200">
          {icon}
        </span>
        <p className="text-[11px] font-black text-[#5B8C9E] uppercase tracking-wider">
          {label}
        </p>
      </div>
      <p className="text-sm font-semibold text-[#1F4A5C] break-words">
        {value || "---"}
      </p>
    </div>
  );
}

// Component QR Code với chức năng phóng to
// Component QR Code với chức năng phóng to và dữ liệu đầy đủ
function QRCodeBlock({ booking }: { booking: Booking }) {
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const { qrCode, user, schedule, symptom, id } = booking;

  if (!qrCode || qrCode === "---") {
    return (
      <div className="p-4 bg-gradient-to-br from-white to-[#F0F9FF] rounded-2xl border border-[#D0F0FD]">
        <div className="flex items-center gap-2 mb-2">
          <QrCode size={16} className="text-[#5B8C9E]" />
          <p className="text-[11px] font-black text-[#5B8C9E] uppercase tracking-wider">
            Mã QR
          </p>
        </div>
        <p className="text-sm font-semibold text-[#1F4A5C]">---</p>
      </div>
    );
  }

  // Tạo dữ liệu cho QR Code - Định dạng JSON đẹp
  // Tạo dữ liệu cho QR Code - Định dạng JSON đẹp
  const qrData = {
    "Mã Đặt Lịch": qrCode,
    "Họ tên BN": user?.fullName || "---",
    "Ngày sinh BN": formatDate(user?.dateOfBirth),
    "Giới tính BN": user?.gender === "MALE" ? "Nam" : "Nữ",
    "SĐT BN": user?.phone || "---",
    "Email BN": user?.email || "---",
    "Quê quán BN": user?.address || "---",
    "Bác sĩ": schedule?.doctor?.user?.fullName || "---",
    "Chuyên khoa": schedule?.doctor?.specialty?.name || "---",
    "Phòng khám": schedule?.room?.name || "---",
    "Vị trí phòng": schedule?.room?.location || "---",
    "Ngày khám": formatDate(schedule?.date),
    "Khung giờ": `${formatTime(schedule?.timeStart)} - ${formatTime(schedule?.timeEnd)}`,
    "Triệu chứng":
      symptom && symptom.trim() !== "" ? symptom : "Không có triệu chứng", // 👈 SỬA LỖI TRIỆU CHỨNG
  };

  // Log để kiểm tra dữ liệu (xóa sau khi chạy ổn)
  console.log("QR Data for booking", id, ":", qrData);
  // Chuyển đối tượng thành chuỗi JSON để nhúng vào QR
  const qrDataString = JSON.stringify(qrData, null, 2);

  // Tạo URL cho QR Code từ dữ liệu JSON (mã hóa URL)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrDataString)}`;
  const qrCodeLargeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(qrDataString)}`;

  // Format thông tin để hiển thị trong modal preview
  // Format thông tin để hiển thị trong modal preview
  const formatQRDataForDisplay = () => {
    // Lấy triệu chứng - kiểm tra kỹ
    const symptomText =
      symptom && symptom.trim() !== "" ? symptom : "Không có triệu chứng";

    return (
      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-2 p-3 bg-[#F0FDFA] rounded-xl">
          <span className="font-semibold text-[#1F4A5C]">Mã Đặt Lịch:</span>
          <span className="text-[#2DD4BF] font-mono text-xs break-all">
            {qrData["Mã Đặt Lịch"]}
          </span>

          <span className="font-semibold text-[#1F4A5C]">Họ tên BN:</span>
          <span>{qrData["Họ tên BN"]}</span>

          <span className="font-semibold text-[#1F4A5C]">Ngày sinh:</span>
          <span>{qrData["Ngày sinh BN"]}</span>

          <span className="font-semibold text-[#1F4A5C]">Giới tính:</span>
          <span>{qrData["Giới tính BN"]}</span>

          <span className="font-semibold text-[#1F4A5C]">SĐT:</span>
          <span>{qrData["SĐT BN"]}</span>

          <span className="font-semibold text-[#1F4A5C]">Email:</span>
          <span className="break-all">{qrData["Email BN"]}</span>

          <span className="font-semibold text-[#1F4A5C]">Quê quán:</span>
          <span>{qrData["Quê quán BN"]}</span>

          <span className="font-semibold text-[#1F4A5C]">Bác sĩ:</span>
          <span>{qrData["Bác sĩ"]}</span>

          <span className="font-semibold text-[#1F4A5C]">Chuyên khoa:</span>
          <span>{qrData["Chuyên khoa"]}</span>

          <span className="font-semibold text-[#1F4A5C]">Phòng khám:</span>
          <span>{qrData["Phòng khám"]}</span>

          <span className="font-semibold text-[#1F4A5C]">Vị trí:</span>
          <span>{qrData["Vị trí phòng"]}</span>

          <span className="font-semibold text-[#1F4A5C]">Ngày khám:</span>
          <span>{qrData["Ngày khám"]}</span>

          <span className="font-semibold text-[#1F4A5C]">Khung giờ:</span>
          <span>{qrData["Khung giờ"]}</span>

          {/* 👇 DÒNG TRIỆU CHỨNG - ĐẢM BẢO HIỂN THỊ */}
          <span className="font-semibold text-[#1F4A5C]">Triệu chứng:</span>
          <span className="text-[#D97706] font-medium">{symptomText}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className="group p-4 bg-gradient-to-br from-white to-[#F0F9FF] rounded-2xl border border-[#D0F0FD] hover:border-[#2DD4BF] hover:shadow-md transition-all duration-300 cursor-pointer"
        onClick={() => setIsQrModalOpen(true)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <QrCode
              size={16}
              className="text-[#14B8A6] group-hover:scale-110 transition-transform duration-200"
            />
            <p className="text-[11px] font-black text-[#5B8C9E] uppercase tracking-wider">
              Mã QR
            </p>
          </div>
          <Maximize2
            size={14}
            className="text-[#5B8C9E] group-hover:text-[#2DD4BF] transition-colors"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-white rounded-xl shadow-sm overflow-hidden flex-shrink-0">
            <img
              src={qrCodeUrl}
              alt="QR Code"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-[#1F4A5C] break-all">
              {qrCode.substring(0, 20)}...
            </p>
            <p className="text-[10px] text-[#5B8C9E] mt-1 italic">
              Nhấn để xem QR và thông tin chi tiết
            </p>
          </div>
        </div>
      </div>

      {/* Modal phóng to QR Code + Hiển thị thông tin */}
      {isQrModalOpen && (
        <div
          className="fixed inset-0 bg-[#1F4A5C]/80 backdrop-blur-md flex items-center justify-center z-[60] p-4"
          onClick={() => setIsQrModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] px-6 py-4 sticky top-0 z-10 flex justify-between items-center">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <QrCode size={20} />
                Thông tin đặt lịch
              </h3>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* QR Code lớn */}
              <div className="text-center mb-6">
                <div className="bg-white p-4 rounded-2xl shadow-lg inline-block">
                  <img
                    src={qrCodeLargeUrl}
                    alt="QR Code Large"
                    className="w-64 h-64 object-contain"
                  />
                </div>
                <p className="text-xs text-[#5B8C9E] mt-3">
                  Quét mã QR này tại quầy tiếp nhận để xác nhận đặt lịch
                </p>
              </div>

              {/* Thông tin chi tiết */}
              <div className="border-t border-[#E6F7F5] pt-4">
                <h4 className="text-sm font-extrabold text-[#1F4A5C] mb-3 flex items-center gap-2">
                  <FileText size={14} className="text-[#2DD4BF]" />
                  Thông tin chi tiết
                </h4>
                <div className="bg-[#F0FDFA] rounded-2xl p-4">
                  {formatQRDataForDisplay()}
                </div>
              </div>
            </div>

            <div className="border-t border-[#E6F7F5] px-6 py-4 flex justify-end bg-[#F0FDFA]">
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white font-extrabold text-sm uppercase tracking-wider hover:shadow-md transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Get status badge
const getStatusBadge = (status: string) => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return {
        text: "Chờ xác nhận",
        className: "bg-amber-100 text-amber-700",
        icon: <Clock8 size={12} />,
      };
    case "CONFIRMED":
      return {
        text: "Đã xác nhận",
        className: "bg-blue-100 text-blue-700",
        icon: <CheckCircle size={12} />,
      };
    case "CANCELLED":
      return {
        text: "Đã hủy",
        className: "bg-red-100 text-red-700",
        icon: <XCircle size={12} />,
      };
    case "COMPLETED":
      return {
        text: "Hoàn thành",
        className: "bg-[#E6F7F5] text-[#2DD4BF]",
        icon: <CheckCircle size={12} />,
      };
    default:
      return {
        text: status || "Không xác định",
        className: "bg-slate-100 text-slate-500",
        icon: <AlertCircle size={12} />,
      };
  }
};

export default function BookingManagementPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filterDate, setFilterDate] = useState<string>(() => {
    // Lấy ngày hiện tại theo format YYYY-MM-DD
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  // Fetch all bookings
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAllBookings();
        setBookings(data || []);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        alert("Không thể tải danh sách đặt lịch");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Lọc dữ liệu
  // Lọc dữ liệu
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      searchTerm === "" ||
      booking.user?.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.user?.phone?.includes(searchTerm) ||
      booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.schedule?.doctor?.user?.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.symptom?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !selectedStatus || booking.status === selectedStatus;

    // 👇 THÊM LỌC THEO NGÀY
    const matchesDate = !filterDate || booking.schedule?.date === filterDate;

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Sắp xếp theo ngày đặt mới nhất
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = sortedBookings.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Xem chi tiết
  const handleView = async (id: number) => {
    try {
      const data = await getBookingById(id);
      setSelectedBooking(data);
      setIsViewModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("Không thể tải chi tiết đặt lịch");
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedStatus("");
    setFilterDate("");
    setCurrentPage(1);
  };

  if (loading)
    return (
      <div className="booking-page min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E6F7F5] via-[#F0FDFA] to-[#E6F7F5]">
        <style>{fontStyle}</style>
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#2DD4BF] animate-spin mx-auto mb-4" />
          <p className="text-[#14B8A6] font-extrabold tracking-wide">
            ĐANG TẢI DỮ LIỆU...
          </p>
        </div>
      </div>
    );

  return (
    <div className="booking-page min-h-screen bg-gradient-to-br from-[#E6F7F5] via-white to-[#F0FDFA] p-4 md:p-8">
      <style>{fontStyle}</style>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2DD4BF] to-[#0EA5E9] shadow-lg flex items-center justify-center">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1F4A5C]">
                  Quản lý <span className="text-[#2DD4BF]">Đặt lịch</span>
                </h1>
                <p className="text-[#5B8C9E] text-sm mt-0.5 flex items-center gap-2 font-medium">
                  <Activity size={12} className="text-[#2DD4BF]" />
                  Tổng số:{" "}
                  <span className="font-extrabold text-[#2DD4BF]">
                    {sortedBookings.length}
                  </span>{" "}
                  lượt đặt lịch
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bộ lọc - Hiển thị mặc định, không cần bấm nút */}
        {/* Bộ lọc - Hiển thị mặc định, không cần bấm nút */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg shadow-[#2DD4BF]/10 border border-white/50 p-5 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Ô tìm kiếm bên trái */}
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="h-5 w-5 text-[#B8D9E6] group-focus-within:text-[#2DD4BF] transition-colors duration-300" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, SĐT, email, bác sĩ, triệu chứng..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#F0FDFA] border border-[#D0F0FD] focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 text-sm outline-none transition-all text-[#1F4A5C] placeholder:text-[#B8D9E6] font-medium"
              />
            </div>

            {/* Lọc theo ngày khám */}
            <div className="relative w-full lg:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Calendar className="h-5 w-5 text-[#B8D9E6]" />
              </div>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => {
                  setFilterDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#F0FDFA] border border-[#D0F0FD] focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 text-sm outline-none transition-all text-[#1F4A5C] font-medium"
              />
            </div>

            {/* Bộ lọc trạng thái */}
            <div className="relative w-full lg:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Activity className="h-5 w-5 text-[#B8D9E6]" />
              </div>
              <select
                className="w-full pl-12 pr-10 py-3 rounded-2xl bg-[#F0FDFA] border border-[#D0F0FD] focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 text-sm outline-none transition-all font-medium appearance-none cursor-pointer text-[#1F4A5C]"
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">📋 Tất cả trạng thái</option>
                <option value="PENDING">⏳ Chờ xác nhận</option>
                <option value="CONFIRMED">✅ Đã xác nhận</option>
                <option value="CANCELLED">❌ Đã hủy</option>
                <option value="COMPLETED">🎉 Hoàn thành</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <ChevronDown size={16} className="text-[#2DD4BF]" />
              </div>
            </div>

            {/* Nút đặt lại bộ lọc */}
            <button
              onClick={resetFilters}
              className="px-5 py-3 rounded-2xl bg-[#F0FDFA] border border-[#D0F0FD] text-[#5B8C9E] hover:text-[#2DD4BF] hover:border-[#2DD4BF] transition-all font-semibold flex items-center gap-2 whitespace-nowrap"
            >
              <RefreshCw size={16} />
              Đặt lại
            </button>
          </div>

          {/* Quick date buttons */}
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[#D0F0FD]">
            <span className="text-xs text-[#5B8C9E] font-medium flex items-center gap-1">
              <Calendar size={12} />
              Nhanh:
            </span>
            <button
              onClick={() => {
                const today = new Date().toISOString().split("T")[0];
                setFilterDate(today);
                setCurrentPage(1);
              }}
              className="text-xs px-3 py-1.5 rounded-xl bg-[#E6F7F5] text-[#2DD4BF] hover:bg-[#2DD4BF] hover:text-white transition-all font-medium"
            >
              Hôm nay
            </button>
            <button
              onClick={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                setFilterDate(tomorrow.toISOString().split("T")[0]);
                setCurrentPage(1);
              }}
              className="text-xs px-3 py-1.5 rounded-xl bg-[#E6F7F5] text-[#2DD4BF] hover:bg-[#2DD4BF] hover:text-white transition-all font-medium"
            >
              Ngày mai
            </button>
            <button
              onClick={() => {
                const nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7);
                setFilterDate(nextWeek.toISOString().split("T")[0]);
                setCurrentPage(1);
              }}
              className="text-xs px-3 py-1.5 rounded-xl bg-[#E6F7F5] text-[#2DD4BF] hover:bg-[#2DD4BF] hover:text-white transition-all font-medium"
            >
              Tuần sau
            </button>
            {filterDate && (
              <button
                onClick={() => {
                  setFilterDate("");
                  setCurrentPage(1);
                }}
                className="text-xs px-3 py-1.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all font-medium"
              >
                Xóa lọc ngày
              </button>
            )}
          </div>

          {/* Active filters tags */}
          {(searchTerm || selectedStatus || filterDate) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#D0F0FD]">
              <span className="text-xs text-[#5B8C9E] font-medium flex items-center gap-1">
                <Filter size={12} />
                Đang lọc:
              </span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E6F7F5] text-[#2DD4BF] rounded-xl text-xs font-semibold">
                  🔍{" "}
                  {searchTerm.length > 40
                    ? searchTerm.substring(0, 40) + "..."
                    : searchTerm}
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:text-[#F43F5E] transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {filterDate && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E6F7F5] text-[#2DD4BF] rounded-xl text-xs font-semibold">
                  📅 {formatDate(filterDate)}
                  <button
                    onClick={() => setFilterDate("")}
                    className="ml-1 hover:text-[#F43F5E] transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedStatus && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E6F7F5] text-[#2DD4BF] rounded-xl text-xs font-semibold">
                  {selectedStatus === "PENDING" && "⏳ Chờ xác nhận"}
                  {selectedStatus === "CONFIRMED" && "✅ Đã xác nhận"}
                  {selectedStatus === "CANCELLED" && "❌ Đã hủy"}
                  {selectedStatus === "COMPLETED" && "🎉 Hoàn thành"}
                  <button
                    onClick={() => setSelectedStatus("")}
                    className="ml-1 hover:text-[#F43F5E] transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-[#2DD4BF]/10 border border-white/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#E6F7F5] to-[#F0FDFA] border-b border-[#D0F0FD]">
                  <th className="px-5 py-4 text-left text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                    Bệnh nhân
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                    Bác sĩ
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                    Chuyên khoa
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                    Ngày khám
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                    Giờ khám
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-5 py-4 text-right text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6F7F5]">
                {currentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-20 text-center">
                      <Calendar
                        size={56}
                        className="mx-auto mb-4 text-[#D0F0FD]"
                      />
                      <p className="text-[#5B8C9E] font-medium">
                        Không tìm thấy đặt lịch nào
                      </p>
                    </td>
                  </tr>
                ) : (
                  currentBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-[#2DD4BF]/5 transition-all duration-200 group"
                    >
                      <td className="px-5 py-3">
                        <span className="font-mono text-xs font-extrabold text-[#2DD4BF]">
                          #{booking.id}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E6F7F5] to-[#F0FDFA] flex items-center justify-center shadow-sm">
                            <User size={18} className="text-[#2DD4BF]" />
                          </div>
                          <div>
                            <p className="font-extrabold text-[#1F4A5C] text-sm">
                              {booking.user?.fullName || "---"}
                            </p>
                            <p className="text-xs text-[#5B8C9E] font-medium">
                              {booking.user?.phone || "---"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-semibold text-[#1F4A5C] text-sm flex items-center gap-1">
                          <Stethoscope size={12} className="text-[#2DD4BF]" />
                          {booking.schedule?.doctor?.user?.fullName || "---"}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#E6F7F5] text-[#2DD4BF] rounded-lg text-xs font-semibold">
                          {booking.schedule?.doctor?.specialty?.name || "---"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1 text-sm text-[#1F4A5C] font-medium">
                          <Calendar size={14} className="text-[#2DD4BF]" />
                          {formatDate(booking.schedule?.date)}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-semibold">
                          <Clock size={12} />
                          {formatTime(booking.schedule?.timeStart)} -{" "}
                          {formatTime(booking.schedule?.timeEnd)}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold ${getStatusBadge(booking.status).className}`}
                        >
                          {getStatusBadge(booking.status).icon}
                          {getStatusBadge(booking.status).text}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => handleView(booking.id)}
                          className="p-1.5 text-[#5B8C9E] hover:text-[#2DD4BF] hover:bg-[#E6F7F5] rounded-lg transition-all"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
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
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        )}

        {/* View Detail Modal */}
        {isViewModalOpen && selectedBooking && (
          <div className="fixed inset-0 bg-[#1F4A5C]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-y-auto animate-in fade-in zoom-in duration-300">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] px-6 py-5 sticky top-0 z-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                    <Calendar size={20} />
                    Chi tiết đặt lịch #{selectedBooking.id}
                  </h2>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Thông tin bệnh nhân */}
                <div className="mb-8">
                  <h3 className="text-[11px] font-extrabold text-[#2DD4BF] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User size={14} /> Thông tin bệnh nhân
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailBlock
                      label="Họ tên"
                      value={selectedBooking.user?.fullName}
                      icon={<User size={16} />}
                    />
                    <DetailBlock
                      label="Số điện thoại"
                      value={selectedBooking.user?.phone}
                      icon={<Phone size={16} />}
                    />
                    <DetailBlock
                      label="Email"
                      value={selectedBooking.user?.email}
                      icon={<Mail size={16} />}
                    />
                    <DetailBlock
                      label="Địa chỉ"
                      value={selectedBooking.user?.address}
                      icon={<MapPin size={16} />}
                    />
                    <DetailBlock
                      label="Giới tính"
                      value={
                        selectedBooking.user?.gender === "MALE" ? "Nam" : "Nữ"
                      }
                      icon={<User size={16} />}
                    />
                    <DetailBlock
                      label="Ngày sinh"
                      value={formatDate(selectedBooking.user?.dateOfBirth)}
                      icon={<CalendarDays size={16} />}
                    />
                  </div>
                </div>

                {/* Thông tin lịch khám */}
                <div className="mb-8">
                  <h3 className="text-[11px] font-extrabold text-[#2DD4BF] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Stethoscope size={14} /> Thông tin lịch khám
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailBlock
                      label="Bác sĩ"
                      value={selectedBooking.schedule?.doctor?.user?.fullName}
                      icon={<User size={16} />}
                    />
                    <DetailBlock
                      label="Chuyên khoa"
                      value={selectedBooking.schedule?.doctor?.specialty?.name}
                      icon={<Stethoscope size={16} />}
                    />
                    <DetailBlock
                      label="Học vị/Bằng cấp"
                      value={selectedBooking.schedule?.doctor?.degree}
                      icon={<GraduationCap size={16} />}
                    />
                    <DetailBlock
                      label="Kinh nghiệm"
                      value={`${selectedBooking.schedule?.doctor?.experience || 0} năm`}
                      icon={<Briefcase size={16} />}
                    />
                    <DetailBlock
                      label="Giá khám"
                      value={formatPrice(
                        selectedBooking.schedule?.doctor?.specialty?.price,
                      )}
                      icon={<DollarSign size={16} />}
                    />
                    <DetailBlock
                      label="Ngày khám"
                      value={formatDate(selectedBooking.schedule?.date)}
                      icon={<Calendar size={16} />}
                    />
                    <DetailBlock
                      label="Giờ khám"
                      value={`${formatTime(selectedBooking.schedule?.timeStart)} - ${formatTime(selectedBooking.schedule?.timeEnd)}`}
                      icon={<Clock size={16} />}
                    />
                    <DetailBlock
                      label="Phòng khám"
                      value={
                        selectedBooking.schedule?.room?.name
                          ? `${selectedBooking.schedule.room.name} (${selectedBooking.schedule.room.location})`
                          : "---"
                      }
                      icon={<DoorOpen size={16} />}
                    />
                  </div>
                </div>

                {/* Thông tin đặt lịch - Có QR Code có thể phóng to */}
                {/* Thông tin đặt lịch - QR Code với đầy đủ thông tin */}
                <div className="mb-8">
                  <h3 className="text-[11px] font-extrabold text-[#2DD4BF] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FileText size={14} /> Thông tin đặt lịch
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <DetailBlock
                      label="Ngày đặt"
                      value={formatDateTime(selectedBooking.createdAt)}
                      icon={<Calendar size={16} />}
                    />
                    <DetailBlock
                      label="Triệu chứng"
                      value={selectedBooking.symptom || "Không có triệu chứng"}
                      icon={<FileText size={16} />}
                    />
                    {/* QR Code với đầy đủ thông tin */}
                    <QRCodeBlock booking={selectedBooking} />
                  </div>
                </div>

                {/* Trạng thái hiện tại */}
                <div className="border-t border-[#E6F7F5] pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[#5B8C9E] font-semibold">
                      Trạng thái hiện tại:
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold ${getStatusBadge(selectedBooking.status).className}`}
                    >
                      {getStatusBadge(selectedBooking.status).icon}
                      {getStatusBadge(selectedBooking.status).text}
                    </span>
                  </div>
                </div>

                {/* Nút đóng */}
                <div className="mt-6 pt-4">
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="w-full py-3 bg-[#F0FDFA] hover:bg-[#E6F7F5] text-[#5B8C9E] font-extrabold rounded-2xl text-sm transition-all uppercase tracking-wider"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
