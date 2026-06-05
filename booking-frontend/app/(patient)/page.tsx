"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllBranches, Branch } from "@/services/branchService";
import {
  Calendar,
  Stethoscope,
  Users,
  HeartHandshake,
  Clock,
  ArrowRight,
  MapPin,
  Building2,
  Loader2,
  Award,
} from "lucide-react";
import BannerList from "@/components/patient/BannerList";

export default function HomePage() {
  const router = useRouter();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranch, setLoadingBranch] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await getAllBranches();
        setBranches(data.filter((b) => b.active));
      } catch (error) {
        console.error("Lỗi tải chi nhánh:", error);
      } finally {
        setLoadingBranch(false);
      }
    };
    fetchBranches();
  }, []);

  const stats = [
    {
      val: "99%",
      label: "Hài lòng",
      icon: HeartHandshake,
      color: "text-emerald-500",
    },
    { val: "150+", label: "Bác sĩ", icon: Users, color: "text-blue-500" },
    {
      val: "35+",
      label: "Chuyên khoa",
      icon: Stethoscope,
      color: "text-indigo-500",
    },
    { val: "24/7", label: "Hỗ trợ", icon: Clock, color: "text-rose-500" },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-800 pb-20">
      {/* 1. BANNER */}
      <BannerList />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2. QUICK ACTIONS - TẠO HIỆU ỨNG NỔI */}
        <div className="mt-[-60px] relative z-20 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              title: "Đặt Lịch Khám",
              desc: "Chọn bác sĩ & khung giờ nhanh chóng.",
              icon: Calendar,
              bg: "bg-blue-600",
            },
            {
              title: "Chuyên Khoa",
              desc: "Danh sách dịch vụ y tế chuyên sâu.",
              icon: Stethoscope,
              bg: "bg-slate-900",
            },
            {
              title: "Đội Ngũ Bác Sĩ",
              desc: "Hồ sơ năng lực chuyên gia y tế.",
              icon: Users,
              bg: "bg-emerald-600",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`${item.bg} p-8 rounded-3xl text-white shadow-xl hover:-translate-y-2 transition-transform cursor-pointer`}
            >
              <item.icon size={32} className="mb-4" />
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-sm opacity-80 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* 3. QUY TRÌNH KHÁM BỆNH */}
        <section className="py-20 text-center">
          <h2 className="text-3xl font-black mb-12">Quy trình khám bệnh 3T</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              "Chọn dịch vụ",
              "Đặt lịch & Thanh toán",
              "Khám & Nhận kết quả",
            ].map((step, i) => (
              <div
                key={i}
                className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mb-4">
                  0{i + 1}
                </div>
                <h4 className="font-bold">{step}</h4>
              </div>
            ))}
          </div>
        </section>

        {/* 4. HỆ THỐNG CHI NHÁNH */}
        <section className="py-10">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Building2 className="text-blue-600" /> Hệ thống cơ sở
          </h2>
          {loadingBranch ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {branches.map((b) => (
                <div
                  key={b.id}
                  onClick={() => router.push(`/bookings?branchId=${b.id}`)}
                  className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-500 cursor-pointer transition-all"
                >
                  <MapPin className="text-blue-500 mb-2" />
                  <h4 className="font-bold">{b.name}</h4>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 5. THỐNG KÊ (STATS) */}
        <section className="py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-8 rounded-2xl border border-slate-200">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <s.icon className={`mx-auto ${s.color} mb-2`} size={24} />
                <p className="text-2xl font-black">{s.val}</p>
                <p className="text-xs text-slate-400 uppercase tracking-widest">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

     
    </div>
  );
}
