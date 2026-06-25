// app/payment/failed/page.tsx
"use client";

import Link from "next/link";
import { XCircle, Home, RefreshCw, Phone, Mail } from "lucide-react";

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50/30 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon thất bại */}
        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <XCircle className="w-10 h-10 text-white" />
        </div>

        {/* Tiêu đề */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-6">
          Thanh toán thất bại!
        </h1>

        {/* Lời nhắn */}
        <div className="mt-4 space-y-2">
          <p className="text-gray-600">
            Rất tiếc, giao dịch của bạn đã không thành công.
          </p>
          <p className="text-gray-500 text-sm">
            Đặt lịch chưa được xác nhận. Vui lòng thử lại hoặc liên hệ hỗ trợ.
          </p>
        </div>

        {/* Nút hành động */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link
            href="/appointments"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-900 to-teal-600 text-white rounded-lg hover:shadow-md transition"
          >
            <RefreshCw className="w-4 h-4" />
            Đặt lại lịch
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </Link>
        </div>

        {/* Hỗ trợ */}
        <div className="mt-6 p-4 bg-white/60 rounded-xl border border-red-200">
          <p className="text-sm text-gray-600 font-medium">Cần hỗ trợ?</p>
          <div className="flex items-center justify-center gap-4 mt-2 text-sm">
            <a
              href="tel:19001234"
              className="flex items-center gap-1 text-red-600 hover:text-red-700 transition"
            >
              <Phone className="w-3.5 h-3.5" />
              1900 1234
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="mailto:support@3thospital.vn"
              className="flex items-center gap-1 text-red-600 hover:text-red-700 transition"
            >
              <Mail className="w-3.5 h-3.5" />
              support@3thospital.vn
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-6">
          © 2026 3T Hospital - Chúng tôi luôn sẵn sàng hỗ trợ bạn!
        </p>
      </div>
    </div>
  );
}
