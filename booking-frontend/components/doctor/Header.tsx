"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Bell,
  ShieldCheck,
  Sparkles,
  Clock,
  Activity,
} from "lucide-react";
import { getProfile } from "@/services/authService";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  return (
    <header className="h-24 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-12 sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
      {/* LEFT: BRANDING */}
      <div className="flex items-center gap-5 shrink-0">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-40 group-hover:opacity-70 transition duration-500"></div>
          <div className="relative w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-cyan-400 border border-slate-700 transition-transform group-hover:rotate-6">
            <Activity size={30} strokeWidth={2.5} className="animate-pulse" />
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-white tracking-tighter leading-none uppercase">
            3T <span className="text-cyan-400">Hospital</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1.5 flex items-center gap-2">
            <span className="h-[2px] w-5 bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></span>
            Portal Management
          </p>
        </div>
      </div>

      {/* RIGHT: PROFILE & LOGOUT */}
      <div className="flex items-center gap-6">
        <button className="group relative p-3 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 rounded-2xl transition-all">
          <Bell size={22} />
          <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-cyan-500 rounded-full border-2 border-[#0f172a] shadow-[0_0_10px_#06b6d4]"></span>
        </button>

        <div className="flex items-center gap-5 pl-8 border-l border-slate-800">
          <div className="flex flex-col text-right">
            <div className="flex items-center justify-end gap-1.5 mb-0.5">
              <Sparkles size={10} className="text-amber-400" />
              <span className="text-[10px] font-black text-cyan-500/80 uppercase tracking-widest">
                {user?.role || "DOCTOR"}
              </span>
            </div>
            <span className="text-lg font-black text-white tracking-tight uppercase">
              BS. {user?.lastName || ""}
            </span>
          </div>

          {/* AVATAR VỚI VIỀN NEON */}
          <div className="h-12 w-12 rounded-2xl bg-slate-800 border-2 border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-xl shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-transform hover:scale-110">
            {(user?.firstName || "H").charAt(0)}
          </div>

          <button
            onClick={handleLogout}
            className="group w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl transition-all hover:bg-rose-600 hover:text-white hover:shadow-[0_0_15px_rgba(225,29,72,0.4)]"
          >
            <LogOut
              size={20}
              strokeWidth={2.5}
              className="mx-auto group-hover:-translate-x-0.5 transition-transform"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
