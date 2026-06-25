// components/patient/BranchHome.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  ArrowRight,
  Sparkles,
  Clock,
  Building2,
  ChevronRight,
} from "lucide-react";
import { getAllBranches, Branch } from "@/services/branchService";

export default function BranchHome() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await getAllBranches();
        setBranches(data.filter((b: Branch) => b.active));
      } catch (error) {
        console.error("Lỗi tải chi nhánh:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  if (loading) return null;
  const displayedBranches = showAll ? branches : branches.slice(0, 3);
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 rounded-full mb-3">
            <Building2 className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
              Hệ thống chi nhánh
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">
            Chi nhánh của chúng tôi
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Hệ thống bệnh viện trải dài khắp thành phố, phục vụ bạn tốt nhất
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayedBranches.map((branch) => (
            <div
              key={branch.id}
              className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-5 text-white">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Building2 size={24} />
                  </div>

                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                    Hoạt động
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold line-clamp-2">
                  {branch.name}
                </h3>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-teal-600 mt-0.5" />
                  <p className="text-sm text-slate-600">{branch.address}</p>
                </div>

                <div className="flex items-center gap-3 mb-5">
                  <Clock className="w-5 h-5 text-teal-600" />
                  <span className="text-sm text-slate-600">Hoạt động 24/7</span>
                </div>

                <Link
                  href={`/branch/${branch.id}`}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
                >
                  Đặt lịch tại chi nhánh
                  <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Nút xem thêm đặt ngoài grid */}
        {branches.length > 3 && (
          <div className="text-center mt-10">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Sparkles className="w-4 h-4" />

              {showAll ? "Thu gọn" : "Xem thêm"}

              <ArrowRight
                className={`w-4 h-4 transition-transform ${
                  showAll ? "rotate-90" : ""
                }`}
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
