"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { getAllDoctors, Doctor } from "@/services/doctorService";
import { getAllSpecialties, Specialty } from "@/services/specialtyService";
import { getAllBranches, Branch } from "@/services/branchService";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import PaginationPatient from "@/components/PaginationPatient";

export default function PatientDoctorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lấy specialtyId từ URL nếu có
  const specialtyIdFromUrl = searchParams.get("specialtyId");
  const specialtyNameFromUrl = searchParams.get("specialtyName");

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  // const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const selectedSpecialty = specialtyIdFromUrl ?? "all";
  // useEffect(() => {
  //   if (specialtyIdFromUrl) {
  //     setSelectedSpecialty(specialtyIdFromUrl);
  //   }
  // }, [specialtyIdFromUrl]);
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
    queueMicrotask(() => {
      setCurrentPage(1);
    });
  }, [selectedSpecialty, selectedBranch]);

  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDoctors = filteredDoctors.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium font-['Times_New_Roman',serif]">
            Đang tải danh sách bác sĩ...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 font-['Times_New_Roman',serif]">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="group inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-sm">Quay lại</span>
            </button>
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              {specialtyNameFromUrl
                ? `Bác sĩ - ${decodeURIComponent(specialtyNameFromUrl)}`
                : "Đội ngũ bác sĩ"}
            </h1>
            <p className="text-blue-100 text-sm md:text-base mt-2">
              Chọn bác sĩ phù hợp với bạn để đặt lịch khám
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* FILTER SECTION */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 mb-6">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Chuyên khoa
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) =>
                  router.push(`/doctors?specialtyId=${e.target.value}`)
                }
                className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white text-slate-700 text-sm"
              >
                <option value="all">📋 Tất cả chuyên khoa</option>
                {specialties.map((s) => (
                  <option key={s.id} value={s.id.toString()}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Cơ sở khám
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white text-slate-700 text-sm"
              >
                <option value="all">🏥 Tất cả cơ sở</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id.toString()}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* RESULT COUNT */}
        {filteredDoctors.length > 0 && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-slate-500 text-sm">
              Tìm thấy{" "}
              <span className="font-bold text-blue-600">
                {filteredDoctors.length}
              </span>{" "}
              bác sĩ
              {totalPages > 1 && (
                <span className="text-slate-400 ml-2 text-xs">
                  (Trang {currentPage}/{totalPages})
                </span>
              )}
            </p>
          </div>
        )}
        {/* EMPTY STATE */}
        {filteredDoctors.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-5xl mb-3">👨‍⚕️</div>
            <p className="text-slate-500">Không tìm thấy bác sĩ phù hợp</p>
            <button
              onClick={() => {
                router.push("/doctors");
                setSelectedBranch("all");
              }}
              className="mt-3 text-blue-600 hover:text-blue-700 text-sm underline"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
        {/* DOCTOR CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {currentDoctors.map((doctor, index) => (
            <div
              key={doctor.id}
              onClick={() => router.push(`/doctors/${doctor.id}`)} // ✅ THÊM DÒNG NÀY - click vào card
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-slate-100 cursor-pointer" // ✅ THÊM cursor-pointer
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden border-2 border-slate-50 shrink-0 shadow-sm">
                        <Image
                          src={
                            doctor?.user?.avatar &&
                            (doctor.user.avatar.startsWith("http") ||
                              doctor.user.avatar.startsWith("/"))
                              ? doctor.user.avatar
                              : "/images/default-avatar.png"
                          }
                          alt={`${doctor?.user?.lastName || "Doctor"} ${doctor?.user?.firstName || ""}`}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-black text-lg text-slate-800 group-hover:text-blue-600 transition-colors font-['Times_New_Roman',serif]">
                      BS. {doctor.user?.lastName} {doctor.user?.firstName}
                    </h2>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold font-['Times_New_Roman',serif]">
                      {doctor.specialty?.name}
                    </span>
                  </div>
                </div>

                <div className="my-4 border-t border-slate-100"></div>

                <div className="space-y-2.5">
                  <div className="flex items-start gap-2 text-sm text-slate-600 font-['Times_New_Roman',serif]">
                    <span className="text-blue-500 shrink-0">🏥</span>
                    <span>
                      <span className="text-slate-400">Cơ sở:</span>{" "}
                      <span className="font-semibold text-slate-700">
                        {doctor.branch?.name || "Đang cập nhật"}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-600 font-['Times_New_Roman',serif]">
                    <span className="text-blue-500 shrink-0">🎓</span>
                    <span>
                      <span className="text-slate-400">Học vị:</span>{" "}
                      <span className="font-semibold text-slate-700">
                        {doctor.degree || "Đang cập nhật"}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-600 font-['Times_New_Roman',serif]">
                    <span className="text-blue-500 shrink-0">👨‍⚕️</span>
                    <span>
                      <span className="text-slate-400">Kinh nghiệm:</span>{" "}
                      <span className="font-semibold text-slate-700">
                        {doctor.experience} năm
                      </span>
                    </span>
                  </div>
                </div>

                {/* Nút đặt lịch - cần ngăn chặn sự kiện bubble */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // ✅ THÊM DÒNG NÀY - ngăn không cho click vào nút cũng chuyển trang
                    router.push(`/booking/${doctor.id}`);
                  }}
                  className="mt-6 w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:shadow-blue-200 active:scale-95 group/btn font-['Times_New_Roman',serif]"
                >
                  <span className="flex items-center justify-center gap-2">
                    Đặt lịch khám
                    <svg
                      className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* PAGINATION - Sử dụng component đã tách */}
        <PaginationPatient
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
        {filteredDoctors.length > 0 && (
          <div className="mt-6 text-center text-sm text-slate-400">
            Hiển thị {startIndex + 1} -{" "}
            {Math.min(endIndex, filteredDoctors.length)} trong tổng số{" "}
            {filteredDoctors.length} bác sĩ
          </div>
        )}
      </div>
    </div>
  );
}
