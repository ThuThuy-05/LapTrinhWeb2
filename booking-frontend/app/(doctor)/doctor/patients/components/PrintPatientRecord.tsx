// app/(doctor)/doctor/patients/components/PrintPatientRecord.tsx
"use client";

import { Printer } from "lucide-react";

interface Patient {
  id?: number;
  fullName: string;
  gender: string;
  phone: string;
  email: string;
  address?: string;
  dateOfBirth?: string;
  avatar?: string;
}

interface Booking {
  id?: number;
  bookingDate: string;
  schedule?: {
    timeStart: string;
    timeEnd: string;
    room?: { name: string };
  };
  symptom?: string;
  diagnosis?: string;
  prescription?: string;
  doctorNote?: string;
  status?: string;
}

interface PrintPatientRecordProps {
  patient: Patient;
  bookings: Booking[];
  buttonText?: string;
  buttonClassName?: string;
  icon?: React.ReactNode;
  onPrintStart?: () => void;
  onPrintEnd?: () => void;
}

// Helper functions
const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "N/A";
  }
};

const formatTime = (timeString: string): string => {
  if (!timeString) return "N/A";
  return timeString.substring(0, 5);
};

const formatDateTime = (dateString: string): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "N/A";
  }
};

const getGenderText = (gender: string): string => {
  return gender === "MALE" ? "Nam" : gender === "FEMALE" ? "Nữ" : "Khác";
};

const getStatusText = (status?: string): string => {
  switch (status) {
    case "COMPLETED":
      return "Đã hoàn thành";
    case "CONFIRMED":
      return "Đã xác nhận";
    case "PENDING":
      return "Chờ xác nhận";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return "Chưa xác định";
  }
};

// Generate HTML content for printing
const generatePrintHTML = (
  patient: Patient,
  bookings: Booking[],
  printDate: string
): string => {
  return `<!DOCTYPE html>
<html>
  <head>
    <title>Hồ sơ bệnh nhân - ${patient.fullName}</title>
    <meta charset="utf-8" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Times New Roman', Arial, sans-serif;
        margin: 20px;
        padding: 20px;
        color: #333;
        background: white;
      }
      .print-container {
        max-width: 1200px;
        margin: 0 auto;
      }
      .header {
        text-align: center;
        margin-bottom: 30px;
        border-bottom: 3px solid #2563eb;
        padding-bottom: 20px;
      }
      .hospital-name {
        font-size: 28px;
        font-weight: bold;
        color: #1e40af;
        margin-bottom: 5px;
      }
      .hospital-sub {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 10px;
      }
      .title {
        font-size: 22px;
        font-weight: bold;
        margin: 10px 0;
        color: #1f2937;
      }
      .print-date {
        font-size: 12px;
        color: #9ca3af;
        margin-top: 5px;
      }
      .section {
        margin-bottom: 25px;
        border: 1px solid #e5e7eb;
        padding: 20px;
        border-radius: 12px;
        page-break-inside: avoid;
        background: white;
      }
      .section-title {
        font-size: 18px;
        font-weight: bold;
        background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
        padding: 10px 15px;
        margin: -20px -20px 20px -20px;
        border-radius: 12px 12px 0 0;
        border-bottom: 2px solid #2563eb;
        color: #1e40af;
      }
      .info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
      }
      .info-item {
        margin-bottom: 5px;
        border-bottom: 1px dashed #f3f4f6;
        padding-bottom: 8px;
      }
      .info-label {
        font-weight: bold;
        color: #6b7280;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .info-value {
        font-size: 14px;
        margin-top: 4px;
        color: #1f2937;
      }
      .booking-item {
        border: 1px solid #e5e7eb;
        padding: 15px;
        margin-bottom: 20px;
        border-radius: 10px;
        page-break-inside: avoid;
        background: #fafafa;
      }
      .booking-header {
        background: white;
        padding: 10px;
        margin: -15px -15px 15px -15px;
        border-radius: 10px 10px 0 0;
        border-bottom: 2px solid #2563eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
      }
      .booking-number {
        font-weight: bold;
        color: #2563eb;
        font-size: 14px;
      }
      .booking-date {
        color: #6b7280;
        font-size: 12px;
      }
      .booking-status {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: bold;
      }
      .status-completed { background: #d1fae5; color: #065f46; }
      .status-confirmed { background: #dbeafe; color: #1e40af; }
      .status-pending { background: #fed7aa; color: #92400e; }
      .status-cancelled { background: #fee2e2; color: #991b1b; }
      .footer {
        text-align: center;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #e5e7eb;
        font-size: 11px;
        color: #9ca3af;
      }
      .signature {
        display: flex;
        justify-content: space-between;
        margin-top: 40px;
        padding-top: 20px;
      }
      .signature-item {
        text-align: center;
        width: 200px;
      }
      .signature-line {
        border-top: 1px solid #000;
        margin-top: 40px;
        padding-top: 10px;
      }
      @media print {
        body {
          margin: 0;
          padding: 10px;
        }
        .no-print {
          display: none;
        }
        .section {
          break-inside: avoid;
        }
        .booking-item {
          break-inside: avoid;
        }
      }
    </style>
  </head>
  <body>
    <div class="print-container">
      <!-- Header -->
      <div class="header">
        <div class="hospital-name">🏥 3T HOSPITAL</div>
        <div class="hospital-sub">Hệ thống y tế 3T - Chất lượng tạo niềm tin</div>
        <div class="title">HỒ SƠ BỆNH NHÂN</div>
        <div class="print-date">Ngày in: ${printDate}</div>
      </div>

      <!-- Thông tin bệnh nhân -->
      <div class="section">
        <div class="section-title">📋 THÔNG TIN BỆNH NHÂN</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Họ và tên</div>
            <div class="info-value"><strong>${patient.fullName}</strong></div>
          </div>
          <div class="info-item">
            <div class="info-label">Giới tính</div>
            <div class="info-value">${getGenderText(patient.gender)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Ngày sinh</div>
            <div class="info-value">${formatDate(patient.dateOfBirth || "")}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Số điện thoại</div>
            <div class="info-value">${patient.phone}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Email</div>
            <div class="info-value">${patient.email}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Địa chỉ</div>
            <div class="info-value">${patient.address || "Chưa cập nhật"}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Mã số bệnh nhân</div>
            <div class="info-value">${patient.id || "N/A"}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Tổng số lần khám</div>
            <div class="info-value"><strong>${bookings.length} lần</strong></div>
          </div>
        </div>
      </div>

      <!-- Lịch sử khám bệnh -->
      <div class="section">
        <div class="section-title">📜 LỊCH SỬ KHÁM BỆNH</div>
        ${
          bookings.length > 0
            ? bookings
                .map(
                  (booking, idx) => `
          <div class="booking-item">
            <div class="booking-header">
              <span class="booking-number">Lần khám thứ ${idx + 1}</span>
              <span class="booking-date">📅 ${formatDate(booking.bookingDate)}</span>
              <span class="booking-status status-${(booking.status || "").toLowerCase()}">
                ${getStatusText(booking.status)}
              </span>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Giờ khám</div>
                <div class="info-value">⏰ ${formatTime(booking.schedule?.timeStart || "")} - ${formatTime(booking.schedule?.timeEnd || "")}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Phòng khám</div>
                <div class="info-value">🏥 ${booking.schedule?.room?.name || "N/A"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Triệu chứng</div>
                <div class="info-value">${booking.symptom || "Không có"}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Chẩn đoán</div>
                <div class="info-value">${booking.diagnosis || "Chưa có"}</div>
              </div>
              ${
                booking.prescription
                  ? `
              <div class="info-item">
                <div class="info-label">Đơn thuốc</div>
                <div class="info-value">${booking.prescription.replace(/\n/g, "<br/>")}</div>
              </div>
              `
                  : ""
              }
              ${
                booking.doctorNote
                  ? `
              <div class="info-item">
                <div class="info-label">Ghi chú bác sĩ</div>
                <div class="info-value">📝 ${booking.doctorNote}</div>
              </div>
              `
                  : ""
              }
            </div>
          </div>
        `
                )
                .join("")
            : `
          <div style="text-align: center; padding: 40px; color: #999;">
            <p>📭 Chưa có lịch sử khám bệnh</p>
          </div>
        `
        }
      </div>

      <!-- Chữ ký -->
      <div class="signature">
        <div class="signature-item">
          <div class="signature-line">Bác sĩ điều trị</div>
          <div style="margin-top: 10px; font-size: 12px; color: #666;">(Ký và ghi rõ họ tên)</div>
        </div>
        <div class="signature-item">
          <div class="signature-line">Bệnh nhân</div>
          <div style="margin-top: 10px; font-size: 12px; color: #666;">(Ký và ghi rõ họ tên)</div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>📄 Hồ sơ được tạo tự động từ hệ thống 3T Hospital Portal</p>
        <p>🔒 Thông tin được bảo mật - Chỉ dùng cho mục đích y tế</p>
        <p style="margin-top: 5px;">© ${new Date().getFullYear()} 3T Hospital - All rights reserved</p>
      </div>
    </div>
  </body>
</html>`;
};

// Main component
export default function PrintPatientRecord({
  patient,
  bookings,
  buttonText = "In hồ sơ",
  buttonClassName = "",
  icon,
  onPrintStart,
  onPrintEnd,
}: PrintPatientRecordProps) {
  const handlePrint = () => {
    // Callback trước khi in
    if (onPrintStart) onPrintStart();

    // Lưu title gốc
    const originalTitle = document.title;
    
    // Đổi title
    document.title = `HoSo_BenhNhan_${patient.fullName}_${formatDate(new Date().toISOString())}`;
    
    // Tạo nội dung HTML
    const printDate = formatDateTime(new Date().toISOString());
    const printContent = generatePrintHTML(patient, bookings, printDate);
    
    // Mở cửa sổ in mới
    const printWindow = window.open("", "_blank");
    
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Chờ load xong rồi in
      printWindow.onload = () => {
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
          // Khôi phục title gốc
          document.title = originalTitle;
          // Callback sau khi in
          if (onPrintEnd) onPrintEnd();
        };
      };
    } else {
      // Khôi phục title nếu không mở được cửa sổ
      document.title = originalTitle;
      alert("Không thể mở cửa sổ in. Vui lòng kiểm tra trình duyệt của bạn.");
      if (onPrintEnd) onPrintEnd();
    }
  };

  return (
    <button
      onClick={handlePrint}
      className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg ${buttonClassName}`}
    >
      {icon || <Printer className="w-4 h-4" />}
      {buttonText}
    </button>
  );
}