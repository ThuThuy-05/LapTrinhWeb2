// app/(patient)/doctor/components/DoctorList.tsx
"use client";

import { Doctor } from "@/services/doctorService";
import DoctorCard from "./DoctorCard";
import DoctorEmptyState from "./DoctorEmptyState";
import DoctorResultCount from "./DoctorResultCount";

interface DoctorListProps {
  doctors: Doctor[];
  loading?: boolean;
  currentPage?: number;
  totalPages?: number;
  startIndex?: number;
  endIndex?: number;
  onBooking?: (doctorId: number) => void;
  onDoctorClick?: (doctorId: number) => void;
  onReset?: () => void;
  className?: string;
  gridClassName?: string;
  showResultCount?: boolean;
  showBookingButton?: boolean;
  emptyMessage?: string;
  emptyIcon?: string;
}

export default function DoctorList({
  doctors,
  loading = false,
  currentPage = 1,
  totalPages = 1,
  startIndex,
  endIndex,
  onBooking,
  onDoctorClick,
  onReset,
  className = "",
  gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7",
  showResultCount = true,
  showBookingButton = true,
  emptyMessage = "Không tìm thấy bác sĩ phù hợp",
  emptyIcon = "👨‍⚕️",
}: DoctorListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <DoctorEmptyState onReset={onReset} message={emptyMessage} icon={emptyIcon} />
    );
  }

  return (
    <div className={className}>
      {showResultCount && startIndex !== undefined && endIndex !== undefined && (
        <DoctorResultCount
          total={doctors.length}
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          className="mb-4"
        />
      )}

      <div className={gridClassName}>
        {doctors.map((doctor, index) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            index={index}
            onBooking={onBooking}
            onClick={onDoctorClick}
            showBookingButton={showBookingButton}
          />
        ))}
      </div>
    </div>
  );
}