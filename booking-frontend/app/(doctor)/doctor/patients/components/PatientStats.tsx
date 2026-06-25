"use client";

import { User, CheckCircle2, X } from "lucide-react";

interface PatientStatsProps {
  stats: {
    total: number;
    completed: number;
    cancelled: number;
  };
}

export default function PatientStats({ stats }: PatientStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wide">
              Tổng số
            </p>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {stats.total}
            </p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wide">
              Đã khám
            </p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {stats.completed}
            </p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wide">
              Đã hủy
            </p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {stats.cancelled}
            </p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center">
            <X className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
