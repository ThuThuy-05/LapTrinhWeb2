"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getSchedulesByDoctorId,
  Schedule,
  formatTime,
} from "@/services/scheduleService";

interface Props {
  doctorId: number;
}

export default function DoctorSchedule({ doctorId }: Props) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    getSchedulesByDoctorId(doctorId, "AVAILABLE").then((data) => {
      setSchedules(data);
      setLoading(false);
    });
  }, [doctorId]);

  const { dates, groupedSchedules } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 2);

    const filtered = schedules.filter((s) => {
      const d = new Date(s.date);
      return d >= today && d <= maxDate;
    });

    const map: Record<string, Schedule[]> = {};
    filtered.forEach((item) => {
      if (!map[item.date]) map[item.date] = [];
      map[item.date].push(item);
    });

    Object.values(map).forEach((list) =>
      list.sort((a, b) => a.timeStart.localeCompare(b.timeStart)),
    );

    return { dates: Object.keys(map).sort(), groupedSchedules: map };
  }, [schedules]);

  // Tự động chọn ngày đầu tiên
  useEffect(() => {
    if (dates.length && !selectedDate) setSelectedDate(dates[0]);
  }, [dates, selectedDate]);

  if (loading)
    return (
      <div className="text-sm text-gray-500 animate-pulse">
        Đang tải lịch...
      </div>
    );
  if (!dates.length)
    return (
      <p className="text-sm text-gray-500">Bác sĩ chưa có lịch làm việc.</p>
    );

  return (
    <div className="space-y-6">
      {/* Danh sách ngày */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {dates.map((date) => {
          const d = new Date(date);
          const isSelected = selectedDate === date;

          return (
            <button
              key={date}
              onClick={() => {
                setSelectedDate(date);
                setSelectedScheduleId(null); // Reset chọn giờ khi đổi ngày
              }}
              className={`flex-shrink-0 min-w-[110px] rounded-xl border-2 p-3 transition-all ${
                isSelected
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="font-bold text-sm text-gray-800">
                {d.toLocaleDateString("vi-VN", {
                  weekday: "short",
                  day: "2-digit",
                  month: "2-digit",
                })}
              </div>
              <div className="text-green-600 text-[11px] font-medium mt-1">
                {groupedSchedules[date].length} khung giờ
              </div>
            </button>
          );
        })}
      </div>

      {/* Danh sách khung giờ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {groupedSchedules[selectedDate]?.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setSelectedScheduleId(item.id);
              sessionStorage.setItem("selected_schedule", JSON.stringify(item));
            }}
            className={`border rounded-lg py-3 text-sm font-medium transition ${
              selectedScheduleId === item.id
                ? "border-blue-600 bg-blue-600 text-white shadow-md"
                : "border-gray-300 text-gray-700 hover:border-blue-500"
            }`}
          >
            {formatTime(item.timeStart)} - {formatTime(item.timeEnd)}
          </button>
        ))}
      </div>
    </div>
  );
}
