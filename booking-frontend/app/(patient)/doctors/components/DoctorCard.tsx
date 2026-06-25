// app/(patient)/doctor/components/DoctorCard.tsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Doctor } from "@/services/doctorService";

interface DoctorCardProps {
  doctor: Doctor;
  index?: number;
  onBooking?: (doctorId: number) => void;
  onClick?: (doctorId: number) => void;
  className?: string;
  showBookingButton?: boolean;
}

export default function DoctorCard({
  doctor,
  index = 0,
  onBooking,
  onClick,
  className = "",
  showBookingButton = true,
}: DoctorCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    if (onClick) {
      onClick(doctor.id);
    } else {
      router.push(`/doctors/${doctor.id}`);
    }
  };

  const handleBookingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBooking) {
      onBooking(doctor.id);
    } else {
      router.push(`/booking/${doctor.id}`);
    }
  };

  const fullName =
    `BS. ${doctor.user?.lastName || ""} ${doctor.user?.firstName || ""}`.trim() ||
    "Bác sĩ";

  return (
    <div
      onClick={handleCardClick}
      className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-slate-100 cursor-pointer ${className}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden border-2 border-slate-50 shrink-0 shadow-sm">
              <Image
                src={
                  doctor?.user?.avatar &&
                  (doctor.user.avatar.startsWith("http") ||
                    doctor.user.avatar.startsWith("/"))
                    ? doctor.user.avatar
                    : "/images/default-avatar.png"
                }
                alt={fullName}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1">
            <h2
              className="text-lg text-slate-800 group-hover:text-blue-600 transition-colors"
              style={{ fontFamily: "Times New Roman, serif", fontWeight: 700 }}
            >
              {fullName}
            </h2>
            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
              {doctor.specialty?.name}
            </span>
          </div>
        </div>

        <div className="my-4 border-t border-slate-100"></div>

        <div className="space-y-2.5">
          <div className="flex items-start gap-2 text-sm text-slate-600">
            <span className="text-blue-500 shrink-0">🏥</span>
            <span>
              <span className="text-slate-400">Cơ sở:</span>{" "}
              <span className="font-semibold text-slate-700">
                {doctor.branch?.name || "Đang cập nhật"}
              </span>
            </span>
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-600">
            <span className="text-blue-500 shrink-0">🎓</span>
            <span>
              <span className="text-slate-400">Học vị:</span>{" "}
              <span className="font-semibold text-slate-700">
                {doctor.degree || "Đang cập nhật"}
              </span>
            </span>
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-600">
            <span className="text-blue-500 shrink-0">👨‍⚕️</span>
            <span>
              <span className="text-slate-400">Kinh nghiệm:</span>{" "}
              <span className="font-semibold text-slate-700">
                {doctor.experience || 0} năm
              </span>
            </span>
          </div>
        </div>

        {showBookingButton && (
          <button
            onClick={handleBookingClick}
            className="mt-6 w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:shadow-blue-200 active:scale-95 group/btn"
          >
            <span className="flex items-center justify-center gap-2">
              Đặt lịch khám
              <svg
                className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
