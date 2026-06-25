// components/patient/SpecialtyHome.tsx (Phiên bản màu sắc đẹp mắt)
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Stethoscope, ArrowRight, Sparkles } from "lucide-react";
import { getAllSpecialties, Specialty } from "@/services/specialtyService";

const fallbackIcons = ["❤️", "🏥", "👶", "🤰", "🦴", "👂"];
const colorGradients = [
  "from-rose-100 to-orange-100",
  "from-blue-100 to-cyan-100",
  "from-green-100 to-emerald-100",
  "from-purple-100 to-pink-100",
  "from-yellow-100 to-amber-100",
  "from-indigo-100 to-blue-100",
];

export default function SpecialtyHome() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const data = await getAllSpecialties();
        setSpecialties(data.filter((s: Specialty) => s.active));
      } catch (error) {
        console.error("Lỗi tải chuyên khoa:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecialties();
  }, []);
  const displayedSpecialties = showAll ? specialties : specialties.slice(0, 6);
  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header với hiệu ứng màu */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-full mb-4">
            <Stethoscope className="w-4 h-4 text-teal-600" />
            <span className="text-teal-600 text-sm font-semibold uppercase tracking-wider">
              Chuyên khoa
            </span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Chuyên khoa nổi bật
          </h2>
          <div className="flex justify-center mt-4">
            <div className="w-20 h-1 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full"></div>
          </div>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg">
            Đội ngũ bác sĩ chuyên môn cao, giàu kinh nghiệm trong từng lĩnh vực
          </p>
        </div>

        {/* Grid - hiển thị 6 chuyên khoa với màu sắc */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {displayedSpecialties.map((specialty, index) => (
            <Link key={specialty.id} href="/specialties" className="group">
              <div className="bg-white rounded-2xl p-5 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-teal-200 hover:-translate-y-1">
                {/* Ảnh với gradient màu khác nhau */}
                <div
                  className={`w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br ${colorGradients[index % colorGradients.length]} flex items-center justify-center overflow-hidden group-hover:scale-110 transition duration-300 shadow-md`}
                >
                  {specialty.image ? (
                    <img
                      src={specialty.image}
                      alt={specialty.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">
                      {fallbackIcons[index % fallbackIcons.length]}
                    </span>
                  )}
                </div>

                {/* Tên với màu sắc */}
                <h3 className="font-semibold text-slate-700 text-sm group-hover:text-teal-600 transition duration-300">
                  {specialty.name}
                </h3>

                {/* Hiệu ứng underline khi hover */}
                <div className="w-0 h-0.5 bg-gradient-to-r from-teal-400 to-blue-400 mx-auto mt-2 group-hover:w-8 transition-all duration-300 rounded-full"></div>
              </div>
            </Link>
          ))}
        </div>

        {specialties.length > 6 && (
          <div className="text-center mt-14">
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
