"use client";

import { useEffect, useState, useCallback } from "react";
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
  User,
  Phone,
  Mail,
  CalendarDays,
  Clock4,
  Activity,
  X,
  Download,
  Copy,
  Check,
  Building2,
  ClipboardList,
  Pill,
  AlertCircle,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useRouter } from "next/navigation";
import {
  getMyBookings,
  cancelBooking,
  Booking,
  cancelBookingByPatient,
} from "@/services/bookingService";

export default function AppointmentsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        const userId = user?.id;

        if (!userId) {
          setBookings([]);
          return;
        }

        const data = await getMyBookings(userId);

        const filtered = Array.isArray(data)
          ? data.filter((b) =>
              ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].includes(
                b.status?.toUpperCase(),
              ),
            )
          : [];

        const sorted = filtered.sort((a, b) => {
          return (
            new Date(b.bookingDate).getTime() -
            new Date(a.bookingDate).getTime()
          );
        });

        setBookings(sorted);
      } catch (error) {
        console.error(error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const handleCancelBooking = async (id: number) => {
    if (!confirm("Bạn có chắc muốn huỷ lịch này?")) return;

    try {
      await cancelBookingByPatient(id);

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id ? { ...booking, status: "CANCELLED" } : booking,
        ),
      );

      // nếu đang mở QR của lịch vừa hủy
      if (selectedBooking?.id === id) {
        setSelectedBooking({
          ...selectedBooking,
          status: "CANCELLED",
        });
      }

      alert("Huỷ lịch thành công");
    } catch (error) {
      console.error("Lỗi huỷ lịch:", error);
      alert("Huỷ lịch thất bại");
    }
  };

  const openQRModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsQRModalOpen(true);
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    const s = (status || "").trim().toUpperCase();
    switch (s) {
      case "PENDING":
        return {
          text: "Chờ thanh toán",
          className: "bg-yellow-50 text-yellow-700 border-yellow-200",
          icon: <Clock4 className="w-3.5 h-3.5" />,
        };
      case "CONFIRMED":
        return {
          text: "Đã xác nhận",
          className: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        };
      case "COMPLETED":
        return {
          text: "Hoàn thành",
          className: "bg-sky-50 text-sky-700 border-sky-200",
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        };
      case "CANCELLED":
        return {
          text: "Đã huỷ",
          className: "bg-red-50 text-red-700 border-red-200",
          icon: <XCircle className="w-3.5 h-3.5" />,
        };
      default:
        return {
          text: s,
          className: "bg-gray-50 text-gray-600 border-gray-200",
          icon: <Activity className="w-3.5 h-3.5" />,
        };
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "N/A";
    return timeString.slice(0, 5);
  };

  const getQRValue = (booking: Booking) => {
    return JSON.stringify({
      id: booking.id,
      patientName: booking.user?.fullName,
      doctorName: booking.schedule?.doctor?.user?.fullName,
      specialty: booking.schedule?.doctor?.specialty?.name,
      date: formatDate(booking.bookingDate),
      time: `${formatTime(booking.schedule?.timeStart)} - ${formatTime(booking.schedule?.timeEnd)}`,
      room: booking.schedule?.room?.name,
      symptom: booking.symptom,
      status: booking.status,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-slate-600 font-medium">
            Đang tải lịch hẹn...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-lg">
                <CalendarDays className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 bg-clip-text text-transparent">
                  Lịch hẹn của tôi
                </h1>
                <p className="text-slate-500 text-sm mt-0.5">
                  Quản lý và theo dõi các lịch khám bệnh
                </p>
              </div>
            </div>
            <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100">
              <span className="text-sm text-slate-500">Tổng số: </span>
              <span className="font-bold text-blue-600 text-lg ml-1">
                {bookings.length}
              </span>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">
              Chưa có lịch hẹn
            </h3>
            <p className="text-slate-400 text-sm">
              Bạn chưa có lịch hẹn khám bệnh nào
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const badge = getStatusBadge(b.status);
              const isCompleted = b.status === "COMPLETED";
              const hasMedicalRecord =
                b.diagnosis || b.prescription || b.doctorNote;

              return (
                <div
                  key={b.id}
                  className="group bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <div className="p-5">
                    {/* Header Row với Doctor và Actions */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
                          <Stethoscope className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="font-bold text-slate-800 text-lg">
                            BS. {b.schedule?.doctor?.user?.fullName || "N/A"}
                          </h2>
                          <p className="text-sm text-blue-600">
                            {b.schedule?.doctor?.specialty?.name ||
                              "Chuyên khoa"}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-row md:flex-col gap-2">
                        <button
                          onClick={() => openQRModal(b)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-cyan-700 transition-all shadow-sm"
                        >
                          <QrCode className="w-4 h-4" />
                          Mã QR
                        </button>
                        {["PENDING", "CONFIRMED"].includes(
                          b.status?.trim().toUpperCase(),
                        ) && (
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-all border border-red-200"
                          >
                            <XCircle className="w-4 h-4" />
                            Huỷ lịch
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 2 Column Layout: Left (Appointment Info) + Right (Medical Record) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-3">
                      {/* LEFT COLUMN - Thông tin lịch khám */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1 h-5 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full"></div>
                          <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
                            THÔNG TIN LỊCH KHÁM
                          </h3>
                        </div>

                        {/* Date & Time */}
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                <Calendar className="w-4 h-4 text-blue-500" />
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase">
                                  Ngày khám
                                </p>
                                <p className="text-sm font-medium text-slate-700">
                                  {formatDate(b.bookingDate)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                <Clock className="w-4 h-4 text-blue-500" />
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase">
                                  Giờ khám
                                </p>
                                <p className="text-sm font-medium text-slate-700">
                                  {formatTime(b.schedule?.timeStart)} -{" "}
                                  {formatTime(b.schedule?.timeEnd)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Room & Symptom */}
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-white rounded-lg shadow-sm">
                              <Building2 className="w-4 h-4 text-blue-500" />
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase">
                                Phòng khám
                              </p>
                              <p className="text-sm font-medium text-slate-700">
                                {b.schedule?.room?.name || "Phòng khám"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="p-1.5 bg-white rounded-lg shadow-sm">
                              <AlertCircle className="w-4 h-4 text-amber-500" />
                            </div>
                            <div className="flex-1">
                              <p className="text-[10px] text-slate-400 uppercase">
                                Triệu chứng
                              </p>
                              <p className="text-sm text-slate-600">
                                {b.symptom || "Không có triệu chứng"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Status + Payment Row */}
                        <div className="pt-2 flex items-center justify-between">
                          {/* LEFT: Status Badge */}
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${badge.className}`}
                          >
                            {badge.icon}
                            {badge.text}
                          </span>

                          {/* RIGHT: Payment Button */}
                          {b.status?.trim().toUpperCase() === "PENDING" && (
                            <button
                              onClick={() => router.push(`/payment/${b.id}`)}
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-all shadow-sm"
                            >
                              Thanh toán ngay
                            </button>
                          )}
                        </div>
                      </div>

                      {/* RIGHT COLUMN - Hồ sơ bệnh án */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1 h-5 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full"></div>
                          <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
                            HỒ SƠ KHÁM BỆNH
                          </h3>
                        </div>

                        {isCompleted && hasMedicalRecord ? (
                          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                            {/* Diagnosis */}
                            {b.diagnosis && (
                              <div className="mb-3 pb-2 border-b border-blue-200/50">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <ClipboardList className="w-3.5 h-3.5 text-blue-600" />
                                  <span className="text-xs font-semibold text-blue-700 uppercase">
                                    Chẩn đoán
                                  </span>
                                </div>
                                <p className="text-sm text-slate-700 pl-5">
                                  {b.diagnosis}
                                </p>
                              </div>
                            )}

                            {/* Prescription */}
                            {b.prescription && (
                              <div className="mb-3 pb-2 border-b border-blue-200/50">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <Pill className="w-3.5 h-3.5 text-blue-600" />
                                  <span className="text-xs font-semibold text-blue-700 uppercase">
                                    Đơn thuốc
                                  </span>
                                </div>
                                <p className="text-sm text-slate-700 pl-5 whitespace-pre-wrap">
                                  {b.prescription}
                                </p>
                              </div>
                            )}

                            {/* Doctor Note */}
                            {b.doctorNote && (
                              <div>
                                <div className="flex items-center gap-1.5 mb-1">
                                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                                  <span className="text-xs font-semibold text-blue-700 uppercase">
                                    Ghi chú bác sĩ
                                  </span>
                                </div>
                                <p className="text-sm text-slate-700 pl-5">
                                  {b.doctorNote}
                                </p>
                              </div>
                            )}
                          </div>
                        ) : isCompleted && !hasMedicalRecord ? (
                          <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm text-slate-500">
                              Chưa có hồ sơ bệnh án
                            </p>
                            <p className="text-xs text-slate-400">
                              Hồ sơ sẽ được cập nhật sau khi khám
                            </p>
                          </div>
                        ) : (
                          <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-100">
                            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-2">
                              <Clock className="w-6 h-6 text-slate-400" />
                            </div>
                            <p className="text-sm font-medium text-slate-500">
                              Chưa có hồ sơ
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              Hồ sơ bệnh án sẽ hiển thị sau khi hoàn thành khám
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* QR Modal */}
        {isQRModalOpen && selectedBooking && (
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setIsQRModalOpen(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl">
                    <QrCode className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-800">Mã QR khám bệnh</h3>
                </div>
                <button
                  onClick={() => setIsQRModalOpen(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-white rounded-2xl shadow-lg border border-slate-100">
                    <QRCodeSVG
                      value={getQRValue(selectedBooking)}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 text-left mb-4">
                  <h4 className="font-semibold text-slate-800 text-sm mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    Thông tin lịch hẹn
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Bệnh nhân:</span>
                      <span className="font-medium text-slate-700">
                        {selectedBooking.user?.fullName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Bác sĩ:</span>
                      <span className="font-medium text-slate-700">
                        BS. {selectedBooking.schedule?.doctor?.user?.fullName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ngày khám:</span>
                      <span className="font-medium text-slate-700">
                        {formatDate(selectedBooking.bookingDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Giờ khám:</span>
                      <span className="font-medium text-slate-700">
                        {formatTime(selectedBooking.schedule?.timeStart)} -{" "}
                        {formatTime(selectedBooking.schedule?.timeEnd)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phòng khám:</span>
                      <span className="font-medium text-slate-700">
                        {selectedBooking.schedule?.room?.name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-100 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-2">
                    Mã xác nhận (quét QR hoặc nhập mã)
                  </p>
                  <div className="flex items-center gap-2 justify-center">
                    <code className="text-sm font-mono text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                      {selectedBooking.qrCode || "QR-" + selectedBooking.id}
                    </code>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          selectedBooking.qrCode || "QR-" + selectedBooking.id,
                        )
                      }
                      className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-slate-100">
                <button
                  onClick={() => setIsQRModalOpen(false)}
                  className="w-full px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors font-medium"
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
