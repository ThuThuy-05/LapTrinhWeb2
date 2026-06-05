"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Image as ImageIcon,
  Settings,
  Stethoscope,
  ChevronRight,
  CalendarRange,
  BriefcaseMedical,
  MessageSquareQuote,
  FileText,
  ClipboardList,
  Building2,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Người dùng", href: "/admin/users", icon: Users },
  { name: "Bác sĩ", href: "/admin/doctors", icon: Stethoscope },
  { name: "Chuyên khoa", href: "/admin/specialties", icon: BriefcaseMedical },
  { name: "Chi nhánh", href: "/admin/branches", icon: Building2 },
  { name: "Lịch trực", href: "/admin/schedules", icon: CalendarRange },
  { name: "Lịch đặt", href: "/admin/bookings", icon: ClipboardList },
  { name: "Bài viết", href: "/admin/posts", icon: FileText },
  { name: "Đánh giá", href: "/admin/reviews", icon: MessageSquareQuote },
  { name: "Banners", href: "/admin/banner", icon: ImageIcon },
  { name: "Cài đặt", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col h-screen sticky top-0 shadow-2xl z-50">
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
      <nav className="flex-1 px-4 space-y-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                isActive
                  ? "bg-cyan-600/20 border border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                  : "hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  size={20}
                  className={`${
                    isActive
                      ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                      : "text-slate-500 group-hover:text-cyan-300"
                  } transition-colors`}
                />
                <span
                  className={`font-bold text-sm tracking-wide ${isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-white"}`}
                >
                  {item.name}
                </span>
              </div>
              {isActive && (
                <ChevronRight
                  size={16}
                  className="text-cyan-400 animate-pulse"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER AREA */}
      <div className="p-6 border-t border-slate-800/50">
        <div className="bg-slate-800/40 rounded-xl p-3 text-center border border-slate-700/30">
          <p className="text-[10px] text-cyan-500/70 font-black uppercase tracking-[0.2em]">
            NTTTHUY - TTTN(2026)
          </p>
        </div>
      </div>
    </aside>
  );
}
