"use client";

import {
  GraduationCap,
  Briefcase,
  Award,
  Hospital,
  MapPin,
  Phone,
  Clock,
} from "lucide-react";
import { Doctor } from "@/services/doctorService";

interface DoctorSidebarProps {
  doctor: Doctor;
}

const InfoCard = ({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-blue-50 rounded-lg">
          <Icon size={18} className="text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
    </div>

    <div className="p-6">{children}</div>
  </div>
);

const InfoRow = ({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: any;
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0 group hover:bg-gray-50/50 transition-colors -mx-2 px-2 rounded-lg">
    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
      <Icon size={16} className="text-blue-600" />
    </div>

    <div className="flex-1">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>

      <p
        className={`text-sm font-medium ${
          highlight ? "text-blue-600" : "text-gray-700"
        }`}
      >
        {value}
      </p>
    </div>
  </div>
);

export default function DoctorSidebar({ doctor }: DoctorSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Thông tin cơ bản */}
      <InfoCard icon={GraduationCap} title="Thông tin cơ bản">
        <InfoRow
          icon={GraduationCap}
          label="Học vị"
          value={doctor.degree?.split(",")[0] || "Bác sĩ Chuyên khoa"}
        />

        <InfoRow
          icon={Briefcase}
          label="Kinh nghiệm"
          value={`${doctor.experience} năm`}
        />

        <InfoRow
          icon={Award}
          label="Chuyên khoa"
          value={doctor.specialty?.name || "Đang cập nhật"}
          highlight
        />
      </InfoCard>

      {/* Nơi làm việc */}
      <InfoCard icon={Hospital} title="Nơi làm việc">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 p-2 bg-blue-50 rounded-lg text-blue-600">
              <MapPin size={18} />
            </div>

            <div className="flex-1">
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                Cơ sở y tế
              </p>

              <p className="text-sm font-semibold text-slate-800 leading-tight">
                {doctor.branch?.name || "Đang cập nhật"}
              </p>
            </div>
          </div>

          {doctor.branch?.address && (
            <div className="flex items-start gap-3 pl-2 border-l-2 border-slate-100 ml-[10px]">
              <p className="text-sm text-slate-500 italic leading-relaxed">
                {doctor.branch.address}
              </p>
            </div>
          )}

          {doctor.branch?.phone && (
            <div className="flex items-center gap-3 pt-3 border-t border-slate-50">
              <div className="text-slate-400">
                <Phone size={16} />
              </div>

              <div className="flex-1">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  SĐT liên hệ
                </p>

                <a
                  href={`tel:${doctor.branch.phone}`}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  {doctor.branch.phone}
                </a>
              </div>
            </div>
          )}
        </div>
      </InfoCard>

      {/* Lịch làm việc */}
      <InfoCard icon={Clock} title="Lịch làm việc">
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Thứ 2 - Thứ 6</span>

            <span className="text-sm font-semibold text-gray-900">
              07:30 - 17:00
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Thứ 7</span>

            <span className="text-sm font-semibold text-gray-900">
              07:30 - 12:00
            </span>
          </div>

          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600">Chủ Nhật</span>

            <span className="text-sm font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
              Nghỉ
            </span>
          </div>
        </div>
      </InfoCard>
    </div>
  );
}
