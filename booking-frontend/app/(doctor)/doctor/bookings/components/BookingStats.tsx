"use client";

import {
  Calendar,
  Clock as ClockIcon,
  CheckCircle2,
  Check,
  UserCheck,
} from "lucide-react";

// Icon Users component
const UsersIcon = (props: any) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

interface BookingStatsProps {
  stats: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    today: number;
  };
}

export default function BookingStats({ stats }: BookingStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all">
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
            <UsersIcon className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wide">
              Hôm nay
            </p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {stats.today}
            </p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wide">
              Chờ xác nhận
            </p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {stats.pending}
            </p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
            <ClockIcon className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wide">
              Đã xác nhận
            </p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {stats.confirmed}
            </p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all">
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
            <Check className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
