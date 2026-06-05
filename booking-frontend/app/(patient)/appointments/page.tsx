"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  Loader2,
  FileText,
  XCircle,
  QrCode,
  CheckCircle2,
  X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  getMyBookings,
  cancelBooking,
  Booking,
} from "@/services/bookingService";

export default function AppointmentsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // =========================================
  // FETCH BOOKINGS
  // =========================================
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.warn("Không tìm thấy userId");
        setBookings([]);
        return;
      }

      const data = await getMyBookings(userId);

      const filteredBookings = Array.isArray(data)
        ? data.filter(
            (item) =>
              item.status === "CONFIRMED" || item.status === "COMPLETED",
          )
        : [];

      setBookings(filteredBookings);
    } catch (error) {
      console.error("Lỗi fetch bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  const loadBookings = async () => {
    await fetchBookings();
  };

  loadBookings();
}, []);

  // =========================================
  // CANCEL BOOKING
  // =========================================
  const handleCancelBooking = async (id: number) => {
    const confirmDelete = confirm("Bạn có chắc muốn hủy lịch hẹn này?");
    if (!confirmDelete) return;

    try {
      await cancelBooking(id);
      alert("Hủy lịch thành công");
      fetchBookings();
    } catch (error) {
      console.error("Lỗi hủy lịch:", error);
      alert("Hủy lịch thất bại");
    }
  };

  // =========================================
  // 🚀 ĐÃ THAY THẾ HÀM MỞ HỘP THOẠI QR CODE MỚI TẠI ĐÂY
  // =========================================
  const openQRModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsQRModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return {
          text: "Đã xác nhận",
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "COMPLETED":
        return {
          text: "Đã hoàn thành",
          className: "bg-blue-50 text-blue-700 border-blue-200",
        };
      default:
        return {
          text: status,
          className: "bg-gray-50 text-gray-600 border-gray-200",
        };
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 stroke-[2.5]" />
        <p className="mt-4 text-slate-600 font-semibold text-lg">
          Đang tải lịch hẹn của bạn...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Lịch hẹn của tôi
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Xem và quản lý các lịch khám bệnh đã đăng ký của bạn.
            </p>
          </div>
          <div className="bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100 flex items-center gap-2 text-blue-700 text-sm font-medium w-fit">
            <CheckCircle2 size={16} /> Tổng số: {bookings.length} lịch hẹn
          </div>
        </div>

        {/* EMPTY STATE */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-400">
              <Calendar size={36} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              Chưa có lịch hẹn nào
            </h2>
            <p className="text-slate-500 mt-3 max-w-sm mx-auto text-sm leading-relaxed">
              Bạn không có lịch hẹn khám nào đã xác nhận hoặc đã hoàn thành trên
              hệ thống.
            </p>
          </div>
        ) : (
          /* BOOKINGS LIST */
          <div className="space-y-6">
            {bookings.map((booking) => {
              const badge = getStatusBadge(booking.status);
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200/80 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 md:items-start">
                    {/* DOCTOR AVATAR */}
                    <div className="flex-shrink-0 mx-auto md:mx-0">
                      <img
                        src={
                          booking.schedule?.doctor?.user?.avatar ||
                          "https://via.placeholder.com/150"
                        }
                        alt="Doctor Avatar"
                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border border-slate-100 bg-slate-50"
                      />
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="flex-1 flex flex-col lg:flex-row justify-between gap-6 w-full">
                      {/* MEDICAL INFO */}
                      <div className="space-y-4 max-w-md">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
                              {booking.schedule?.doctor?.degree || "Bác sĩ"}
                            </span>
                            <span
                              className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${badge.className}`}
                            >
                              {badge.text}
                            </span>
                          </div>
                          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                            BS.{" "}
                            {booking.schedule?.doctor?.user?.fullName ||
                              "Chưa cập nhật"}
                          </h2>
                        </div>

                        <div className="space-y-2.5 text-sm font-medium text-slate-600">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                              <Stethoscope size={16} />
                            </div>
                            <span>
                              Chuyên khoa:{" "}
                              {booking.schedule?.doctor?.specialty?.name ||
                                "Chưa cập nhật"}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                              <MapPin size={16} />
                            </div>
                            <span className="text-slate-700">
                              {booking.schedule?.room?.name} —{" "}
                              <span className="text-slate-500 font-normal">
                                {booking.schedule?.room?.location}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* SYMPTOM BOX */}
                        <div className="pt-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                            Triệu chứng lâm sàng
                          </span>
                          <div className="text-sm text-slate-600 bg-slate-50/80 rounded-2xl px-4 py-3 border border-slate-100/70 font-normal leading-relaxed">
                            {booking.symptom || "Không có mô tả triệu chứng"}
                          </div>
                        </div>
                      </div>

                      {/* TIME & CLICKABLE QR CODE COMPONENT */}
                      <div className="lg:w-64 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-6 space-y-4">
                        <div className="space-y-3">
                          <div className="bg-slate-50/80 border border-slate-100 p-3 rounded-2xl flex items-center gap-3">
                            <Calendar
                              className="text-blue-600 stroke-[2]"
                              size={20}
                            />
                            <div>
                              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                Ngày khám
                              </p>
                              <p className="text-sm font-bold text-slate-800">
                                {booking.schedule?.date
                                  ? booking.schedule.date
                                      .split("-")
                                      .reverse()
                                      .join("-")
                                  : "Chưa cập nhật"}
                              </p>
                            </div>
                          </div>

                          <div className="bg-slate-50/80 border border-slate-100 p-3 rounded-2xl flex items-center gap-3">
                            <Clock
                              className="text-indigo-600 stroke-[2]"
                              size={20}
                            />
                            <div>
                              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                Giờ khám
                              </p>
                              <p className="text-sm font-bold text-slate-800">
                                {booking.schedule?.timeStart?.substring(0, 5)} -{" "}
                                {booking.schedule?.timeEnd?.substring(0, 5)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div
                          onClick={() => openQRModal(booking)}
                          className="bg-blue-50/60 hover:bg-blue-50 border border-blue-100 rounded-2xl p-3 flex items-center gap-2.5 cursor-pointer transition active:scale-[0.98] group"
                          title="Bấm để xem mã QR quét thông tin"
                        >
                          <QrCode
                            size={20}
                            className="text-blue-600 flex-shrink-0 group-hover:scale-110 transition duration-200"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider flex justify-between items-center">
                              <span>Mã cuộc hẹn (Bấm xem QR)</span>
                            </p>
                            <p className="text-xs font-mono font-bold text-slate-700 truncate">
                              {booking.qrCode}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ACTION FOOTER */}
                  <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex justify-between items-center flex-wrap gap-3">
                    <span className="text-xs font-medium text-slate-400">
                      {/* ID Lịch hẹn: #{booking.id} */}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openQRModal(booking)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition"
                      >
                        <FileText size={16} />
                        Chi tiết mã khám
                      </button>

                      {booking.status === "CONFIRMED" && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-red-600 bg-red-50 hover:bg-red-100/80 transition"
                        >
                          <XCircle size={16} />
                          Hủy lịch hẹn
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL POP-UP HIỂN THỊ QR CODE BỰ KHI BẤM VÀO MÃ HẸN */}
        {/* ======================================================== */}
        {isQRModalOpen && selectedBooking && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative p-6 text-center">
              {/* Nút đóng Modal */}
              <button
                onClick={() => setIsQRModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
              >
                <X size={20} />
              </button>

              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900">
                  Mã QR Cuộc Hẹn
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Trình mã này cho nhân viên y tế tại quầy tiếp đón
                </p>
              </div>

              {/* KHU VỰC VẼ QR CODE ĐẦY ĐỦ THÔNG TIN */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 w-fit mx-auto my-4 flex items-center justify-center shadow-inner">
                <QRCodeSVG
                  value={
                    `===== MÃ ĐẶT LỊCH HẸN =====\n` +
                    `Mã số: ${selectedBooking.qrCode}\n\n` +
                    `--- THÔNG TIN BỆNH NHÂN ---\n` +
                    `Họ và tên: ${selectedBooking.user?.fullName || "Chưa cập nhật"}\n` +
                    `Ngày sinh: ${selectedBooking.user?.dateOfBirth ? selectedBooking.user.dateOfBirth.split("-").reverse().join("-") : "Chưa cập nhật"}\n` +
                    `Giới tính: ${selectedBooking.user?.gender === "MALE" ? "Nam" : "Nữ"}\n` +
                    `Điện thoại: ${selectedBooking.user?.phone || "Chưa cập nhật"}\n` +
                    `Email: ${selectedBooking.user?.email || "Chưa cập nhật"}\n` +
                    `Quê quán: ${selectedBooking.user?.address || "Chưa cập nhật"}\n\n` +
                    `--- THÔNG TIN LỊCH KHÁM ---\n` +
                    `Bác sĩ: BS. ${selectedBooking.schedule?.doctor?.user?.fullName || "Chưa cập nhật"}\n` +
                    `Chuyên khoa: ${selectedBooking.schedule?.doctor?.specialty?.name || "Chưa cập nhật"}\n` +
                    `Phòng khám: ${selectedBooking.schedule?.room?.name || "Chưa cập nhật"}\n` +
                    `Vị trí: ${selectedBooking.schedule?.room?.location || "Chưa cập nhật"}\n` +
                    `Ngày khám: ${selectedBooking.schedule?.date?.split("-").reverse().join("-") || "Chưa cập nhật"}\n` +
                    `Khung giờ: ${selectedBooking.schedule?.timeStart?.substring(0, 5)} - ${selectedBooking.schedule?.timeEnd?.substring(0, 5)}\n` +
                    `Triệu chứng: ${selectedBooking.symptom || "Không có"}`
                  }
                  size={240}
                  level={"H"}
                  includeMargin={true}
                />
              </div>

              <div className="text-sm font-mono font-bold text-slate-700 bg-slate-100 py-1.5 px-4 rounded-xl w-fit mx-auto mb-4">
                {selectedBooking.qrCode}
              </div>

              {/* TÓM TẮT THÔNG TIN PHÍA DƯỚI QR */}
              <div className="text-left bg-slate-50/50 rounded-2xl p-4 border border-slate-100 text-sm space-y-2 max-h-52 overflow-y-auto standard-scrollbar">
                <p className="text-slate-700 border-b border-slate-200/60 pb-1.5">
                  {/* 🚀 ĐÃ SỬA: Lấy từ selectedBooking.user.fullName */}
                  <strong>Bệnh nhân:</strong>{" "}
                  <span className="font-semibold text-slate-900">
                    {selectedBooking.user?.fullName || "Chưa cập nhật"}
                  </span>
                </p>
                <p className="text-slate-700">
                  <strong>Bác sĩ khám:</strong> BS.{" "}
                  {selectedBooking.schedule?.doctor?.user?.fullName}
                </p>
                <p className="text-slate-700">
                  <strong>Khoa/Phòng:</strong>{" "}
                  {selectedBooking.schedule?.doctor?.specialty?.name} —{" "}
                  {selectedBooking.schedule?.room?.name}
                </p>
                <p className="text-slate-700">
                  <strong>Thời gian:</strong>{" "}
                  <span className="text-blue-600 font-semibold">
                    {selectedBooking.schedule?.timeStart?.substring(0, 5)} -{" "}
                    {selectedBooking.schedule?.timeEnd?.substring(0, 5)}
                  </span>{" "}
                  ngày{" "}
                  {selectedBooking.schedule?.date
                    ?.split("-")
                    .reverse()
                    .join("-")}
                </p>
              </div>

              <button
                onClick={() => setIsQRModalOpen(false)}
                className="mt-5 w-full bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-slate-800 transition active:scale-[0.99]"
              >
                Đóng lại
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
