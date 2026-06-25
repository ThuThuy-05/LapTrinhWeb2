"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  ChevronRight,
  CalendarRange,
  ClipboardList,
  UserCircle,
  MessageSquare,
  Settings,
} from "lucide-react";

const doctorMenuItems = [
  { name: "Tổng quan", href: "/doctor", icon: LayoutDashboard },
  { name: "Lịch trực cá nhân", href: "/doctor/schedules", icon: CalendarRange },
  { name: "Danh sách đặt lịch", href: "/doctor/bookings", icon: ClipboardList },
  { name: "Bệnh nhân của tôi", href: "/doctor/patients", icon: Users },
  { name: "Hồ sơ cá nhân", href: "/doctor/profile", icon: UserCircle },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-[#0f172a] text-slate-300 flex flex-col h-screen sticky top-0 shadow-2xl z-50 border-r border-slate-800/50">
      {/* LOGO AREA */}
      <div className="p-8">
        <Link href="/admin" className="flex items-center justify-center group">
          <div className="transition-transform duration-300 group-hover:scale-105">
            <img
              src="/logo.png"
              alt="3T Hospital"
              className="w-48 h-14 object-contain brightness-125 saturate-150"
            />
          </div>
        </Link>
      </div>

      {/* MENU AREA */}
      <nav className="flex-1 px-6 space-y-2">
        {doctorMenuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-5 py-4 rounded-[1.5rem] transition-all duration-300 group ${
                isActive
                  ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                  : "hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon
                  size={20}
                  className={`${
                    isActive
                      ? "text-cyan-400"
                      : "text-slate-500 group-hover:text-cyan-300"
                  } transition-colors`}
                />
                <span
                  className={`font-bold text-sm ${isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-100"}`}
                >
                  {item.name}
                </span>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="p-8">
        <div className="bg-gradient-to-br from-slate-800/50 to-transparent p-4 rounded-3xl border border-slate-700/30 text-center">
          <p className="text-[10px] text-cyan-500/60 font-black uppercase tracking-widest">
            NTTTHUY - TTTN(2026)
          </p>
        </div>
      </div>
    </aside>
  );
}
