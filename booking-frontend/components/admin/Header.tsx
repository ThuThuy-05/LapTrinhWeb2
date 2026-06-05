"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Bell, ShieldCheck, Sparkles } from "lucide-react";
import { getProfile } from "@/services/authService";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  // 🔥 LOAD PROFILE
  useEffect(() => {
    const role = localStorage.getItem("role");

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    // 🔥 CHẶN SAI ROLE (ví dụ admin page)
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      router.push("/");
    }

    if (pathname.startsWith("/doctor") && role !== "DOCTOR") {
      router.push("/");
    }

    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (error) {
        console.log(error);

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        router.push("/login");
      }
    };

    fetchProfile();
  }, []);

  // 🔥 LOGOUT (FIX CHUẨN)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("fullName");

    setUser(null);

    router.push("/login");
  };

  return (
    <header className="h-24 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-12 sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
      {/* LEFT: BRANDING - Phối màu Neon trên nền tối */}
      <div className="flex items-center gap-5 shrink-0">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-40 group-hover:opacity-70 transition duration-500"></div>
          <div className="relative w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-cyan-400 shadow-xl border border-slate-700 transition-transform group-hover:rotate-6">
            <ShieldCheck size={32} strokeWidth={2.5} />
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-white tracking-tighter leading-none uppercase">
            3T <span className="text-cyan-400">Hospital</span>
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="h-[2px] w-8 bg-cyan-500 rounded-full shadow-[0_0_8px_#06b6d4]"></span>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
              Management System
            </p>
          </div>
        </div>
      </div>

      {/* CENTER: LIVE CLOCK - Phong cách Cyberpunk nhẹ */}
      {/* <div className="hidden lg:flex items-center gap-6 px-10 py-3 bg-slate-800/50 rounded-[2rem] border border-slate-700/50 shadow-inner">
        <div className="flex items-center justify-center w-10 h-10 bg-slate-900 rounded-full text-cyan-400 shadow-md animate-pulse">
          <Clock size={20} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col border-l border-slate-700 pl-6">
          <span className="text-2xl font-black text-white tracking-widest leading-none tabular-nums drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
            {currentTime.toLocaleTimeString("vi-VN")}
          </span>
          <span className="text-[10px] font-bold text-cyan-500/70 uppercase tracking-[0.2em] mt-1">
            {currentTime.toLocaleDateString("vi-VN", {
              weekday: "long",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>
      </div> */}

      {/* RIGHT: PROFILE & LOGOUT */}
      <div className="flex items-center gap-6 shrink-0">
        {/* NOTIFICATION */}
        <button className="group relative p-3 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-2xl transition-all duration-300">
          <Bell size={24} strokeWidth={2} />
          <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-900 group-hover:scale-125 transition-transform"></span>
        </button>

        {/* USER INFO */}
        <div className="flex items-center gap-5 pl-8 border-l border-slate-800">
          <div className="flex flex-col text-right">
            <div className="flex items-center justify-end gap-1.5 mb-1">
              <Sparkles size={12} className="text-amber-400 fill-amber-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {user?.role || "ADMIN"}
              </span>
            </div>
            <span className="text-lg font-black text-white tracking-tight leading-tight uppercase">
              {user?.lastName} {user?.firstName || "Admin"}
            </span>
          </div>

          {/* AVATAR DÙNG GRADIENT NỔI BẬT */}
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-cyan-900/20 uppercase transition-transform hover:scale-110">
            {(user?.firstName || "A").charAt(0)}
          </div>

          {/* LOGOUT BUTTON - MÀU ĐỎ TRÊN NỀN TỐI CỰC ĐẸP */}
          <button
            onClick={handleLogout}
            className="group flex items-center justify-center w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl transition-all duration-300 hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-[0_0_20px_rgba(225,29,72,0.4)]"
            title="Đăng xuất"
          >
            <LogOut
              size={22}
              strokeWidth={2.5}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
