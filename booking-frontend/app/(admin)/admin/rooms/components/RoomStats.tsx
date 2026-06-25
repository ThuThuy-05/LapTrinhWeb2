// app/admin/rooms/components/RoomStats.tsx
"use client";

import { Building2, CheckCircle, XCircle, Layers } from "lucide-react";

interface RoomStatsProps {
  total: number;
  active: number;
  inactive: number;
}

export default function RoomStats({ total, active, inactive }: RoomStatsProps) {
  const stats = [
    {
      title: "Tổng phòng",
      value: total,
      icon: Layers,
      color: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Đang hoạt động",
      value: active,
      icon: CheckCircle,
      color: "from-teal-500 to-teal-600",
      bgLight: "bg-teal-50",
      iconColor: "text-teal-600",
    },
    {
      title: "Ngừng hoạt động",
      value: inactive,
      icon: XCircle,
      color: "from-red-500 to-red-600",
      bgLight: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgLight}`}>
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
