// app/(doctor)/doctor/patients/components/PatientDetailModal.tsx
"use client";

import { useState } from "react";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  CheckCircle2,
  Stethoscope,
  History,
} from "lucide-react";
import PrintPatientRecord from "./PrintPatientRecord";

interface GroupedPatient {
  userId: number;
  fullName: string;
  phone: string;
  email: string;
  gender: string;
  address: string;
  dateOfBirth?: string; // ← ĐÃ THÊM
  latestBookingDate: string;
  latestStatus: string;
  latestSymptom: string;
  allBookings: any[];
}

interface PatientDetailModalProps {
  patient: GroupedPatient;
  onClose: () => void;
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

const formatTime = (time: string) => {
  if (!time) return "N/A";
  return time.substring(0, 5);
};

const getStatusBadge = (status: string) => {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-green-100 text-green-700">
          <CheckCircle2 className="w-3 h-3" />
          Đã khám
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-700">
          {status}
        </span>
      );
  }
};

export default function PatientDetailModal({
  patient,
  onClose,
}: PatientDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"info" | "history">("info");

  // Sắp xếp tăng dần (cũ lên trước)
  const bookings = [...patient.allBookings].sort(
    (a, b) =>
      new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime(),
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50 backdrop-blur-sm pt-32 pb-4 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[70vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                Hồ sơ bệnh nhân
              </h3>
              <p className="text-[10px] text-slate-400">
                Mã BN: #{patient.userId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-4">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-3 py-2 text-xs font-medium transition-all ${
              activeTab === "info"
                ? "text-cyan-600 border-b-2 border-cyan-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Thông tin chung
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-3 py-2 text-xs font-medium transition-all ${
              activeTab === "history"
                ? "text-cyan-600 border-b-2 border-cyan-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Lịch sử khám ({bookings.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === "info" && (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-800 text-xs mb-3 flex items-center gap-1.5 uppercase tracking-wide">
                  <Heart className="w-3.5 h-3.5 text-rose-500" /> Thông tin cá
                  nhân
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-slate-400 text-[10px]">Họ tên</p>
                    <p className="font-medium text-slate-800 text-sm">
                      {patient.fullName}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Giới tính</p>
                    <p className="text-slate-700">
                      {patient.gender === "MALE" ? "Nam" : "Nữ"}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Ngày sinh</p>
                    <p className="text-slate-700">
                      {formatDate(patient.dateOfBirth || "")}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">SĐT</p>
                    <p className="flex items-center gap-1 text-slate-700">
                      <Phone className="w-3 h-3" />
                      {patient.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Email</p>
                    <p className="truncate text-slate-700 text-xs">
                      {patient.email}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-slate-400 text-[10px]">Địa chỉ</p>
                    <p className="text-slate-700 text-xs">
                      {patient.address || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-800 text-xs mb-3 flex items-center gap-1.5 uppercase tracking-wide">
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-600" /> Thống
                  kê khám bệnh
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-slate-400 text-[10px]">
                      Tổng số lần khám
                    </p>
                    <p className="text-xl font-bold text-emerald-600">
                      {bookings.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">
                      Lần khám gần nhất
                    </p>
                    <p className="text-slate-700 text-sm">
                      {formatDate(bookings[bookings.length - 1]?.bookingDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="pt-4">
              <h4 className="font-semibold text-slate-800 text-xs mb-3 flex items-center gap-1.5 uppercase tracking-wide">
                <History className="w-3.5 h-3.5 text-cyan-600" /> Lịch sử khám
                bệnh
              </h4>
              <div className="space-y-3">
                {bookings.map((booking, idx) => (
                  <div
                    key={booking.id}
                    className="border border-slate-200 rounded-lg overflow-hidden"
                  >
                    <div className="flex items-center justify-between bg-slate-50 px-3 py-2 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                        <span className="font-semibold text-xs">
                          Lần {idx + 1}
                        </span>
                        <span className="text-slate-500 text-xs">
                          {formatDate(booking.bookingDate)}
                        </span>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="p-3 space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-slate-400 text-[10px]">Giờ khám</p>
                          <p className="text-slate-700">
                            {formatTime(booking.schedule?.timeStart)} -{" "}
                            {formatTime(booking.schedule?.timeEnd)}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-[10px]">
                            Phòng khám
                          </p>
                          <p className="text-slate-700">
                            {booking.schedule?.room?.name || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px]">
                          Triệu chứng
                        </p>
                        <p className="text-slate-700 bg-slate-50 p-1.5 rounded mt-0.5">
                          {booking.symptom || "Không có"}
                        </p>
                      </div>
                      {booking.diagnosis && (
                        <div>
                          <p className="text-slate-400 text-[10px]">
                            Chẩn đoán
                          </p>
                          <p className="text-slate-700 bg-slate-50 p-1.5 rounded mt-0.5">
                            {booking.diagnosis}
                          </p>
                        </div>
                      )}
                      {booking.prescription && (
                        <div>
                          <p className="text-slate-400 text-[10px]">
                            Đơn thuốc
                          </p>
                          <p className="font-mono text-xs bg-slate-50 p-1.5 rounded mt-0.5 whitespace-pre-wrap">
                            {booking.prescription}
                          </p>
                        </div>
                      )}
                      {booking.doctorNote && (
                        <div>
                          <p className="text-slate-400 text-[10px]">Ghi chú</p>
                          <p className="text-slate-700 bg-slate-50 p-1.5 rounded mt-0.5">
                            {booking.doctorNote}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-100 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs hover:bg-slate-200 transition-colors"
          >
            Đóng
          </button>
          <PrintPatientRecord
            patient={{
              id: patient.userId,
              fullName: patient.fullName,
              phone: patient.phone,
              email: patient.email,
              gender: patient.gender,
              address: patient.address,
              dateOfBirth: patient.dateOfBirth, 
            }}
            bookings={bookings}
            buttonText="In hồ sơ"
            onPrintStart={() => console.log("Bắt đầu in...")}
            onPrintEnd={() => console.log("In xong!")}
          />
        </div>
      </div>
    </div>
  );
}
