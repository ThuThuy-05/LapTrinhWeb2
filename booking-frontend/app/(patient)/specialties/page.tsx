"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAllSpecialties, Specialty } from "@/services/specialtyService";
import {
  Loader2,
  Sparkles,
  ChevronRight,
  Activity,
  Search,
  ArrowLeft,
} from "lucide-react";
import PaginationPatient from "@/components/PaginationPatient";

export default function SpecialtyPage() {
  const router = useRouter();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllSpecialties();
        setSpecialties(data);
      } catch (error) {
        console.error("Lỗi lấy chuyên khoa:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSpecialties = specialties.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    queueMicrotask(() => {
      setCurrentPage(1);
    });
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredSpecialties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSpecialties = filteredSpecialties.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  // Hàm xử lý đặt khám - chuyển sang trang danh sách bác sĩ theo chuyên khoa
  const handleBooking = (specialtyId: number, specialtyName: string) => {
    router.push(
      `/doctors?specialtyId=${specialtyId}&specialtyName=${encodeURIComponent(specialtyName)}`,
    );
  };

  // Hàm xử lý click vào card (xem chi tiết chuyên khoa)
  const handleCardClick = (specialtyId: number) => {
    router.push(`/specialties/${specialtyId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 gap-3">
        <div className="relative flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-500 z-10" size={40} />
          <div className="absolute w-10 h-10 bg-blue-100 rounded-full animate-ping opacity-40"></div>
        </div>
        <p className="text-slate-500 font-medium text-xs tracking-wide animate-pulse font-['Times_New_Roman',serif]">
          Đang tải danh sách chuyên khoa...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 text-slate-800 antialiased selection:bg-blue-500 selection:text-white font-['Times_New_Roman',serif]">
      {/* HERO BANNER */}
      <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 py-8 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="group inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-sm font-['Times_New_Roman',serif]">
                Quay lại
              </span>
            </button>
            <div className="w-[100px]"></div>
          </div>

          <div className="text-center space-y-4 mt-6">
            <span className="inline-flex items-center gap-1.5 bg-white/10 text-blue-100 text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm">
              <Sparkles size={12} className="text-yellow-300" /> Trung tâm y
              khoa chất lượng cao
            </span>

            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none font-['Times_New_Roman',serif]">
              Đặt Lịch Khám Theo{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent">
                Chuyên Khoa
              </span>
            </h1>

            <p className="text-blue-100 text-xs md:text-sm max-w-2xl mx-auto font-light leading-relaxed font-['Times_New_Roman',serif]">
              Hệ thống kết nối đội ngũ bác sĩ đầu ngành. Chủ động chọn chuyên
              khoa, tiết kiệm thời gian chờ đợi tại bệnh viện.
            </p>

            <div className="max-w-md mx-auto pt-3">
              <div className="relative group">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Tìm nhanh tên chuyên khoa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/10 backdrop-blur-md text-white text-xs rounded-xl border border-white/10 focus:border-blue-500 focus:bg-white focus:text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 shadow-inner placeholder:text-slate-400 font-['Times_New_Roman',serif]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Kết quả tìm kiếm */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-slate-500 text-sm font-['Times_New_Roman',serif]">
            Tìm thấy{" "}
            <span className="font-bold text-blue-600">
              {filteredSpecialties.length}
            </span>{" "}
            chuyên khoa
            {totalPages > 1 && (
              <span className="text-slate-400 ml-2">
                (Trang {currentPage}/{totalPages})
              </span>
            )}
          </p>
          <div className="h-px flex-1 ml-4 bg-gradient-to-r from-blue-200 to-transparent"></div>
        </div>

        {currentSpecialties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm max-w-md mx-auto">
            <Activity className="mx-auto text-slate-300 mb-2" size={32} />
            <p className="text-sm font-medium text-slate-500 font-['Times_New_Roman',serif]">
              Không tìm thấy chuyên khoa phù hợp
            </p>
            <p className="text-xs text-slate-400 mt-1 font-['Times_New_Roman',serif]">
              Vui lòng thử từ khóa khác xem sao nhé!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentSpecialties.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/50 shadow-[0_2px_12px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_32px_-12px_rgba(59,130,246,0.15)] hover:-translate-y-1.5 hover:border-blue-500/30 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
                >
                  {/* IMAGE */}
                  <div className="relative w-full h-52 bg-white rounded-t-2xl overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                      fill
                      // Dùng 'object-contain' nếu bạn muốn thấy toàn bộ hình,
                      // dùng 'object-cover' nếu muốn lấp đầy khung hình
                      className="object-contain p-4 transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      quality={100} // Thêm thuộc tính này để tăng chất lượng lên tối đa
                    />
                  </div>

                  {/* TEXT INFO CONTAINER */}
                  <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                    <div className="space-y-2">
                      <h2
                        onClick={() => handleCardClick(item.id)}
                        className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-1 tracking-tight font-['Times_New_Roman',serif] cursor-pointer"
                      >
                        {item.name}
                      </h2>
                      <p
                        onClick={() => handleCardClick(item.id)}
                        className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-normal font-['Times_New_Roman',serif] cursor-pointer"
                      >
                        {item.description ||
                          "Chuyên khoa hiện tại chưa có mô tả chi tiết được cập nhật từ bệnh viện."}
                      </p>
                    </div>

                    {/* PRICE & BUTTON ACTIONS */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5 font-['Times_New_Roman',serif]">
                          Phí khám cơ bản
                        </span>
                        <span className="text-slate-900 font-black text-base tracking-tight group-hover:text-blue-600 transition-colors duration-200 font-['Times_New_Roman',serif]">
                          {item.price?.toLocaleString()}{" "}
                          <span className="text-xs font-medium text-slate-400">
                            đ
                          </span>
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBooking(item.id, item.name);
                        }}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 h-9.5 rounded-xl font-bold text-xs transition-all duration-200 flex items-center gap-0.5 shadow-sm shadow-blue-500/15 group-hover:shadow-md group-hover:shadow-blue-500/20 group-hover:pl-4.5 group-hover:pr-3.5 font-['Times_New_Roman',serif]"
                      >
                        Đặt khám ngay
                        <ChevronRight
                          size={14}
                          className="transform group-hover:translate-x-0.5 transition-transform"
                        />
                      </button>
                    </div>
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

            {/* Hiển thị thông tin dòng */}
            {filteredSpecialties.length > 0 && (
              <div className="mt-6 text-center text-sm text-slate-400 font-['Times_New_Roman',serif]">
                Hiển thị {startIndex + 1} -{" "}
                {Math.min(endIndex, filteredSpecialties.length)} trong tổng số{" "}
                {filteredSpecialties.length} chuyên khoa
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
