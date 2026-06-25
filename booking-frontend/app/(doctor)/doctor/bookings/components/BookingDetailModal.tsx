"use client";

import { useState } from "react";
import {
  X,
  User,
  Heart,
  Calendar,
  CheckCircle2,
  XCircle,
  Save,
  UserCheck,
  FolderOpen,
  ClipboardList,
  FileText,
} from "lucide-react";
import { Booking } from "@/services/bookingService";

interface BookingDetailModalProps {
  booking: Booking;
  updating: boolean;
  onClose: () => void;
  onUpdateStatus: (bookingId: number, newStatus: string) => Promise<void>;
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

export default function BookingDetailModal({
  booking,
  updating,
  onClose,
  onUpdateStatus,
}: BookingDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"info" | "medical">("info");
  const [diagnosis, setDiagnosis] = useState(booking.diagnosis || "");
  const [prescription, setPrescription] = useState(booking.prescription || "");
  const [doctorNote, setDoctorNote] = useState(booking.doctorNote || "");

  const handleUpdateWithMedical = async (newStatus: string) => {
    if (newStatus === "COMPLETED") {
      // Cập nhật state medical trước khi gọi API
      // Component cha sẽ xử lý việc này
    }
    await onUpdateStatus(booking.id, newStatus);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 pt-24">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto animate-in zoom-in-95 duration-200 mx-auto my-auto">
        {/* Modal Header - Compact */}
        <div className="sticky top-0 bg-white z-10 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg">
              <UserCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Chi tiết bệnh nhân</h3>
              <p className="text-[10px] text-slate-400">
                Mã đặt lịch: #{booking.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Modal Content - Compact */}
        <div className="p-5">
          {/* Tabs - Compact */}
          <div className="flex gap-2 mb-4 border-b border-slate-100">
            <button
              onClick={() => setActiveTab("info")}
              className={`px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === "info"
                  ? "text-cyan-600 border-b-2 border-cyan-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Thông tin chung
            </button>
            <button
              onClick={() => setActiveTab("medical")}
              className={`px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === "medical"
                  ? "text-cyan-600 border-b-2 border-cyan-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              Hồ sơ khám bệnh
            </button>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "info" ? (
              /* Compact Patient & Appointment Info */
              <div className="space-y-4">
                {/* Patient Info Card - Compact */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <div className="flex items-center gap-1.5 mb-3 pb-1.5 border-b border-slate-200">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <h4 className="font-semibold text-slate-800 text-sm">
                      Thông tin bệnh nhân
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-400">Họ tên</p>
                      <p className="font-medium text-slate-800">
                        {booking.user?.fullName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Giới tính</p>
                      <p className="text-slate-700">
                        {booking.user?.gender === "MALE"
                          ? "Nam"
                          : booking.user?.gender === "FEMALE"
                            ? "Nữ"
                            : "Khác"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Số điện thoại</p>
                      <p className="text-slate-700">
                        {booking.user?.phone || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Email</p>
                      <p className="text-slate-700 text-xs break-all">
                        {booking.user?.email || "N/A"}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-slate-400">Địa chỉ</p>
                      <p className="text-slate-700 text-sm">
                        {booking.user?.address || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Appointment Info Card - Compact */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <div className="flex items-center gap-1.5 mb-3 pb-1.5 border-b border-slate-200">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <h4 className="font-semibold text-slate-800 text-sm">
                      Thông tin khám bệnh
                    </h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Ngày khám:</span>
                      <span className="font-medium text-slate-800">
                        {formatDate(booking.bookingDate)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Giờ khám:</span>
                      <span className="text-slate-700">
                        {booking.schedule?.timeStart?.substring(0, 5)} -{" "}
                        {booking.schedule?.timeEnd?.substring(0, 5)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Phòng khám:</span>
                      <span className="text-slate-700">
                        {booking.schedule?.room?.name || "N/A"}
                      </span>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Triệu chứng:</p>
                      <div className="bg-white p-2 rounded-lg text-sm text-slate-700 border border-slate-100">
                        {booking.symptom || "Không có triệu chứng"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Medical Record Tab - Compact */
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <div className="flex items-center gap-1.5 mb-3 pb-1.5 border-b border-slate-200">
                  <ClipboardList className="w-4 h-4 text-purple-500" />
                  <h4 className="font-semibold text-slate-800 text-sm">
                    Hồ sơ khám bệnh
                  </h4>
                </div>

                {/* Saved medical info */}
                {(booking.diagnosis ||
                  booking.prescription ||
                  booking.doctorNote) && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="font-medium text-blue-800 text-xs mb-2 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      Thông tin đã lưu
                    </h5>
                    {booking.diagnosis && (
                      <div className="mb-2">
                        <label className="text-[10px] font-semibold text-blue-700 block">
                          Chẩn đoán:
                        </label>
                        <p className="text-xs text-slate-700 bg-white p-1.5 rounded">
                          {booking.diagnosis}
                        </p>
                      </div>
                    )}
                    {booking.prescription && (
                      <div className="mb-2">
                        <label className="text-[10px] font-semibold text-blue-700 block">
                          Đơn thuốc:
                        </label>
                        <p className="text-xs text-slate-700 bg-white p-1.5 rounded whitespace-pre-wrap">
                          {booking.prescription}
                        </p>
                      </div>
                    )}
                    {booking.doctorNote && (
                      <div>
                        <label className="text-[10px] font-semibold text-blue-700 block">
                          Ghi chú:
                        </label>
                        <p className="text-xs text-slate-700 bg-white p-1.5 rounded">
                          {booking.doctorNote}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Chẩn đoán
                    </label>
                    <textarea
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="Nhập chẩn đoán..."
                      rows={2}
                      className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Đơn thuốc
                    </label>
                    <textarea
                      value={prescription}
                      onChange={(e) => setPrescription(e.target.value)}
                      placeholder="Nhập đơn thuốc..."
                      rows={3}
                      className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Ghi chú của bác sĩ
                    </label>
                    <textarea
                      value={doctorNote}
                      onChange={(e) => setDoctorNote(e.target.value)}
                      placeholder="Nhập ghi chú..."
                      rows={2}
                      className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons - Compact */}
          {booking.status?.toUpperCase() !== "COMPLETED" &&
            booking.status?.toUpperCase() !== "CANCELLED" && (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <h4 className="font-semibold text-slate-700 text-xs mb-2">
                  Cập nhật trạng thái
                </h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {booking.status?.toUpperCase() !== "CONFIRMED" && (
                    <button
                      onClick={() => handleUpdateWithMedical("CONFIRMED")}
                      disabled={updating}
                      className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-xs font-medium hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Xác nhận
                    </button>
                  )}
                  {booking.status?.toUpperCase() !== "COMPLETED" && (
                    <button
                      onClick={() => handleUpdateWithMedical("COMPLETED")}
                      disabled={updating}
                      className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-xs font-medium hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                    >
                      <Save className="w-3.5 h-3.5" /> Hoàn thành
                    </button>
                  )}
                  {booking.status?.toUpperCase() !== "CANCELLED" && (
                    <button
                      onClick={() => handleUpdateWithMedical("CANCELLED")}
                      disabled={updating}
                      className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg text-xs font-medium hover:from-red-600 hover:to-rose-600 transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Hủy
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 text-center mt-2">
                  * Khi hoàn thành khám, thông tin sẽ được lưu tự động
                </p>
              </div>
            )}
        </div>

        {/* Modal Footer - Compact */}
        <div className="sticky bottom-0 bg-white px-5 py-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
