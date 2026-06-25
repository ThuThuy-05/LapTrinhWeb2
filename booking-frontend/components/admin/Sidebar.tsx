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
  { name: "Phòng", href: "/admin/rooms", icon: Building2 },
  { name: "Lịch trực", href: "/admin/schedules", icon: CalendarRange },
  { name: "Lịch đặt", href: "/admin/bookings", icon: ClipboardList },
  { name: "Bài viết", href: "/admin/posts", icon: FileText },
  { name: "Đánh giá", href: "/admin/reviews", icon: MessageSquareQuote },
  { name: "Liên hệ", href: "/admin/contact", icon: MessageSquareQuote },

  { name: "Banners", href: "/admin/banner", icon: ImageIcon },
  { name: "Cài đặt", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    // Dùng h-screen sticky và flex flex-col để sidebar luôn dính sát mép trái
    <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col h-screen sticky top-0 shrink-0">
      {/* LOGO AREA - Giảm padding để tiết kiệm không gian */}
      <div className="p-6">
        <Link href="/admin" className="flex items-center justify-center">
          <img
            src="/logo.png"
            alt="3T Hospital"
            className="w-40 h-12 object-contain brightness-125"
          />
        </Link>
      </div>

      {/* MENU AREA - Chỉnh lại padding */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {/* overflow-y-auto giúp cuộn nếu menu dài quá màn hình */}
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-cyan-600/20 text-cyan-400"
                  : "hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
              {isActive && <ChevronRight size={14} className="text-cyan-400" />}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER AREA - Dính sát đáy */}
      <div className="p-4 border-t border-slate-800/50">
        <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest">
          NTTTHUY - TTTN(2026)
        </p>
      </div>
    </aside>
  );
}
