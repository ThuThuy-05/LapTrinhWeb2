// app/booking/success/page.tsx
"use client";

import Link from "next/link";
import { CheckCircle, Home, ListChecks } from "lucide-react";

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50/30 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon thành công */}
        <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>

        {/* Tiêu đề */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-6">
          Đặt lịch thành công! 🎉
        </h1>

        {/* Lời cảm ơn */}
        <div className="mt-4 space-y-2">
          <p className="text-gray-600">
            Cảm ơn bạn đã tin tưởng và lựa chọn dịch vụ của chúng tôi.
          </p>
          <p className="text-gray-500 text-sm">
            Thông tin xác nhận đã được gửi đến email của bạn.
          </p>
          <p className="text-teal-600 font-medium text-sm mt-4">
            📌 Vui lòng đến trước 15 phút và mang theo CMND/CCCD.
          </p>
        </div>

        {/* 2 nút: Lịch hẹn của tôi + Về trang chủ */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link
            href="/appointments"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-teal-500 text-teal-600 rounded-lg hover:bg-teal-50 transition text-sm font-medium"
          >
            <ListChecks className="w-4 h-4" />
            Lịch hẹn của tôi
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-900 to-teal-600 text-white rounded-lg hover:shadow-md transition text-sm font-medium"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </Link>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-8">
          © 2024 3T Hospital - Trân trọng cảm ơn!
        </p>
      </div>
    </div>
  );
}
