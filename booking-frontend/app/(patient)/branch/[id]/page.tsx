// app/(patient)/branch/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDoctorsByBranch } from "@/services/branchService";
import { getBranchById } from "@/services/branchService";
import DoctorHeader from "@/app/(patient)/doctors/components/DoctorHeader";
import DoctorList from "@/app/(patient)/doctors/components/DoctorList";
import { Doctor } from "@/services/doctorService";
import PaginationPatient from "@/components/PaginationPatient";

export default function BranchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]); // ← Tất cả bác sĩ
  const [branchName, setBranchName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const branchId = params.id as string;

      const branch = await getBranchById(branchId);
      setBranchName(branch?.name || "Chi nhánh");

      const data = await getDoctorsByBranch(branchId);
      setAllDoctors(data || []);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  // Phân trang - tính toán từ allDoctors
  const totalPages = Math.ceil(allDoctors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDoctors = allDoctors.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleBooking = (doctorId: number) => {
    router.push(`/booking/${doctorId}`);
  };

  const handleDoctorClick = (doctorId: number) => {
    router.push(`/doctors/${doctorId}`);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center"
        style={{ fontFamily: "'Times New Roman', Times, serif" }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p
            className="text-blue-600 font-medium text-lg"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            Đang tải danh sách bác sĩ...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      <DoctorHeader
        title={`Bác sĩ tại ${branchName}`}
        subtitle={`Danh sách bác sĩ đang làm việc tại ${branchName}`}
        showBackButton={true}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <DoctorList
          doctors={currentDoctors} // ← Đã phân trang
          loading={loading}
          onBooking={handleBooking}
          onDoctorClick={handleDoctorClick}
          gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
          showResultCount={false}
          showBookingButton={true}
          emptyMessage="Chưa có bác sĩ nào tại chi nhánh này"
          emptyIcon="🏥"
        />

        {/* Phân trang - hiển thị khi có nhiều hơn 1 trang */}
        {allDoctors.length > 0 && totalPages > 1 && (
          <PaginationPatient
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        )}
      </div>
    </div>
  );
}
