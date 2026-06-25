// app/(patient)/doctor/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllDoctors, Doctor } from "@/services/doctorService";
import { getAllSpecialties, Specialty } from "@/services/specialtyService";
import { getAllBranches, Branch } from "@/services/branchService";
import DoctorHeader from "./components/DoctorHeader";
import DoctorFilters from "./components/DoctorFilters";
import DoctorList from "./components/DoctorList";
import PaginationPatient from "@/components/PaginationPatient";

export default function DoctorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const specialtyIdFromUrl = searchParams.get("specialtyId");
  const specialtyNameFromUrl = searchParams.get("specialtyName");

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const selectedSpecialty = specialtyIdFromUrl ?? "all";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorData, specialtyData, branchData] = await Promise.all([
          getAllDoctors(),
          getAllSpecialties(),
          getAllBranches(),
        ]);

        setDoctors(doctorData || []);
        setSpecialties(specialtyData || []);
        setBranches(branchData || []);
      } catch (error) {
        console.error("Load doctors error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const specialtyId = doctor.specialty?.id?.toString();
      const branchId = doctor.branch?.id?.toString();

      const matchSpecialty =
        selectedSpecialty === "all" || specialtyId === selectedSpecialty;
      const matchBranch =
        selectedBranch === "all" || branchId === selectedBranch;

      return matchSpecialty && matchBranch;
    });
  }, [doctors, selectedSpecialty, selectedBranch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSpecialty, selectedBranch]);

  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDoctors = filteredDoctors.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleSpecialtyChange = (value: string) => {
    const specialty = specialties.find((s) => s.id.toString() === value);
    if (value === "all") {
      router.push("/doctor");
    } else {
      router.push(
        `/doctor?specialtyId=${value}&specialtyName=${encodeURIComponent(specialty?.name || "")}`,
      );
    }
  };

  const handleReset = () => {
    router.push("/doctors");
    setSelectedBranch("all");
  };

  const handleDoctorClick = (doctorId: number) => {
    router.push(`/doctors/${doctorId}`);
  };

  const handleBooking = (doctorId: number) => {
    router.push(`/booking/${doctorId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <DoctorHeader
        title={
          specialtyNameFromUrl
            ? `Bác sĩ - ${decodeURIComponent(specialtyNameFromUrl)}`
            : "Đội ngũ bác sĩ"
        }
        subtitle="Chọn bác sĩ phù hợp với bạn để đặt lịch khám"
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <DoctorFilters
          selectedSpecialty={selectedSpecialty}
          onSpecialtyChange={handleSpecialtyChange}
          selectedBranch={selectedBranch}
          onBranchChange={setSelectedBranch}
          specialties={specialties}
          branches={branches}
        />

        <DoctorList
          doctors={currentDoctors}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          onBooking={handleBooking}
          onDoctorClick={handleDoctorClick}
          onReset={handleReset}
          emptyMessage="Không tìm thấy bác sĩ phù hợp"
        />

        {filteredDoctors.length > 0 && (
          <>
            <PaginationPatient
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
            <div className="mt-6 text-center text-sm text-slate-400">
              Hiển thị {startIndex + 1} -{" "}
              {Math.min(endIndex, filteredDoctors.length)} trong tổng số{" "}
              {filteredDoctors.length} bác sĩ
            </div>
          </>
        )}
      </div>
    </div>
  );
}
