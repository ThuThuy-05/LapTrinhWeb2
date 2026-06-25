// app/(patient)/doctor/components/DoctorResultCount.tsx
"use client";

interface DoctorResultCountProps {
  total: number;
  currentPage?: number;
  totalPages?: number;
  startIndex?: number;
  endIndex?: number;
  className?: string;
}

export default function DoctorResultCount({
  total,
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  className = "",
}: DoctorResultCountProps) {
  if (total === 0) return null;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <p className="text-slate-500 text-sm">
        Tìm thấy{" "}
        <span className="font-bold text-blue-600">{total}</span> bác sĩ
        {totalPages && totalPages > 1 && (
          <span className="text-slate-400 ml-2 text-xs">
            (Trang {currentPage}/{totalPages})
          </span>
        )}
      </p>
      {startIndex !== undefined && endIndex !== undefined && (
        <p className="text-sm text-slate-400">
          Hiển thị {startIndex + 1} - {Math.min(endIndex, total)} trong tổng số{" "}
          {total} bác sĩ
        </p>
      )}
    </div>
  );
}