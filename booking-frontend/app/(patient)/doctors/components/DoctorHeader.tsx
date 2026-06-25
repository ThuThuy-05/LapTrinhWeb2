// app/(patient)/doctor/components/DoctorHeader.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface DoctorHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backUrl?: string;
}

export default function DoctorHeader({
  title,
  subtitle = "Chọn bác sĩ phù hợp với bạn để đặt lịch khám",
  showBackButton = true,
  backUrl,
}: DoctorHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {showBackButton && (
          <div className="mb-6">
            <button
              onClick={handleBack}
              className="group inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105"
              style={{ fontFamily: "'Times New Roman', Times, serif" }}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span
                className="text-sm"
                style={{ fontFamily: "'Times New Roman', Times, serif" }}
              >
                Quay lại
              </span>
            </button>
          </div>
        )}

        <div>
          <h1
            className="text-3xl md:text-4xl font-bold text-white tracking-tight"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            {title}
          </h1>
          <p
            className="text-blue-100 text-sm md:text-base mt-2"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
