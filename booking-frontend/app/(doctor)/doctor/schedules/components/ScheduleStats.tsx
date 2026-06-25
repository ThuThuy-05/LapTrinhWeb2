"use client";

import { Calendar, CheckCircle2, Activity, XCircle } from "lucide-react";

interface ScheduleStatsProps {
  stats: {
    total: number;
    available: number;
    booked: number;
    cancelled: number;
  };
}

export default function ScheduleStats({ stats }: ScheduleStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">Tổng ca trực</p>
            <p className="text-4xl font-bold text-slate-800 mt-2">
              {stats.total}
            </p>
          </div>
          <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl p-3">
            <Calendar className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">Còn trống</p>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {stats.available}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-3">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">Đã đặt lịch</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {stats.booked}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-3">
            <Activity className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">Đã hủy</p>
            <p className="text-4xl font-bold text-red-600 mt-2">
              {stats.cancelled}
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-rose-500 rounded-xl p-3">
            <XCircle className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
