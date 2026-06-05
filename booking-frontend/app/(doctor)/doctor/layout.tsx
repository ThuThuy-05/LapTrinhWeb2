"use client";

import Sidebar from "@/components/doctor/Sidebar"; // Đường dẫn tới file Sidebar bạn vừa sửa
import Header from "@/components/doctor/Header"; // Đường dẫn tới file Header bạn vừa sửa

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#020617]">
      {" "}
      {/* Nền tối sâu cho toàn bộ trang */}
      {/* 1. SIDEBAR: Cố định bên trái */}
      <Sidebar />
      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER: Cố định trên cùng */}
        <Header />

        {/* PAGE CONTENT: Nơi hiển thị nội dung các trang con */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          {/* Một lớp overlay nhẹ để tạo chiều sâu cho nội dung */}
          <div className="relative">
            {/* Trang trí background nhẹ phía sau nội dung (tùy chọn) */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

            {/* Nội dung thực tế của trang (Dashboard, Bookings, v.v.) */}
            <div className="relative z-10">{children}</div>
          </div>
        </main>

        {/* FOOTER NHỎ (Tùy chọn) */}
        <footer className="px-10 py-4 border-t border-slate-800/50 bg-[#0f172a]/30">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest text-right">
            © 2026 3T Hospital Digital Portal • Security Encrypted
          </p>
        </footer>
      </div>
    </div>
  );
}
