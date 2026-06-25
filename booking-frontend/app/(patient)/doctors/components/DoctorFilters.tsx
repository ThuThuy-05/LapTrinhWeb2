// app/(patient)/doctor/components/DoctorFilters.tsx
"use client";

import { Specialty } from "@/services/specialtyService";
import { Branch } from "@/services/branchService";

interface DoctorFiltersProps {
  selectedSpecialty: string;
  onSpecialtyChange: (value: string) => void;
  selectedBranch: string;
  onBranchChange: (value: string) => void;
  specialties: Specialty[];
  branches: Branch[];
  className?: string;
}

export default function DoctorFilters({
  selectedSpecialty,
  onSpecialtyChange,
  selectedBranch,
  onBranchChange,
  specialties,
  branches,
  className = "",
}: DoctorFiltersProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-slate-100 p-5 mb-6 ${className}`}
    >
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Chuyên khoa
          </label>
          <select
            value={selectedSpecialty}
            onChange={(e) => onSpecialtyChange(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white text-slate-700 text-sm"
          >
            <option value="all">📋 Tất cả chuyên khoa</option>
            {specialties.map((s) => (
              <option key={s.id} value={s.id.toString()}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Cơ sở khám
          </label>
          <select
            value={selectedBranch}
            onChange={(e) => onBranchChange(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white text-slate-700 text-sm"
          >
            <option value="all">🏥 Tất cả cơ sở</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id.toString()}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}