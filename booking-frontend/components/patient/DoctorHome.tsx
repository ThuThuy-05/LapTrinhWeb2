// components/patient/DoctorHome.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, ChevronRight, Stethoscope, Calendar, Award } from "lucide-react";
import { getAllDoctors, Doctor } from "@/services/doctorService";

export default function DoctorHome() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getAllDoctors();
        setDoctors(data.slice(0, 4));
      } catch (error) {
        console.error("Lỗi tải bác sĩ:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-br from-blue-50 to-teal-50/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-teal-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 rounded-full mb-3">
            <Stethoscope className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
              Đội ngũ bác sĩ
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">
            Bác sĩ nổi bật
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Gặp gỡ các bác sĩ hàng đầu, tận tâm với sức khỏe của bạn
          </p>
        </div>

        {/* Grid bác sĩ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {doctors.map((doctor) => {
            const fullName =
              `${doctor.user?.lastName || ""} ${doctor.user?.firstName || ""}`.trim() ||
              `BS. ID ${doctor.id}`;
            return (
              <Link
                key={doctor.id}
                href={`/doctors/${doctor.id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 hover:border-teal-200"
              >
                <div className="relative h-40 bg-gradient-to-br from-blue-800 to-teal-500 flex items-center justify-center">
                  {doctor.user?.avatar ? (
                    <img
                      src={doctor.user.avatar}
                      alt={fullName}
                      className="w-28 h-28 rounded-full object-cover border-3 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                      <span className="text-5xl">👨‍⚕️</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 bg-white/90 backdrop-blur rounded-md">
                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                    <span className="text-[10px] font-bold text-slate-700">
                      4.9
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-800 text-base mb-0.5 group-hover:text-teal-600 transition line-clamp-1">
                    {fullName}
                  </h3>
                  <p className="text-xs text-teal-600 font-medium mb-2">
                    {doctor.specialty?.name || "Bác sĩ đa khoa"}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      <span>{doctor.experience || 5}+ năm</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>100+ BN</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View all button */}
        <div className="text-center mt-8">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-800 to-teal-500 text-white rounded-lg text-sm font-semibold hover:shadow-md transition"
          >
            Xem tất cả bác sĩ
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
