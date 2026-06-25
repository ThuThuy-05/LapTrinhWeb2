// app/(patient)/doctor/components/DoctorEmptyState.tsx
"use client";

interface DoctorEmptyStateProps {
  onReset?: () => void;
  message?: string;
  icon?: string;
}

export default function DoctorEmptyState({
  onReset,
  message = "Không tìm thấy bác sĩ phù hợp",
  icon = "👨‍⚕️",
}: DoctorEmptyStateProps) {
  return (
    <div className="text-center py-16 bg-white rounded-xl shadow-sm">
      <div className="text-5xl mb-3">{icon}</div>
      <p className="text-slate-500">{message}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="mt-3 text-blue-600 hover:text-blue-700 text-sm underline"
        >
          Xóa bộ lọc
        </button>
      )}
    </div>
  );
}