"use client";

import { useEffect, useState } from "react";
import {
  Star,
  Eye,
  EyeOff,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  MessageSquare,
  Calendar,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertCircle,
  Users,
  TrendingUp,
  Award,
  Stethoscope,
  Shield,
} from "lucide-react";
import {
  adminHideReview,
  adminShowReview,
  getDoctorReviews,
  getAllReviews,
  Review,
} from "@/services/reviewService";
import Pagination from "@/components/Pagination";
import { getAllDoctors, Doctor } from "@/services/doctorService";

const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800;14..32,900&display=swap');
  .admin-reviews * {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
`;

interface ReviewWithDoctor extends Review {
  doctorName?: string;
  doctorSpecialty?: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewWithDoctor[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | "all">(
    "all",
  );
  const [selectedRating, setSelectedRating] = useState<number | "all">("all");
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<ReviewWithDoctor | null>(
    null,
  );
  const [showHideModal, setShowHideModal] = useState(false);
  const [reviewToHide, setReviewToHide] = useState<ReviewWithDoctor | null>(
    null,
  );
  const [processing, setProcessing] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 1;

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      const doctorsList = await getAllDoctors();

      if (!doctorsList || doctorsList.length === 0) {
        setError("Không có dữ liệu bác sĩ");
        return;
      }

      setDoctors(doctorsList);

      const doctorMap = new Map();

      doctorsList.forEach((doctor) => {
        const firstName = doctor.user?.firstName || "";
        const lastName = doctor.user?.lastName || "";

        const doctorName =
          `${lastName} ${firstName}`.trim() || `BS. ID ${doctor.id}`;

        const specialtyName = doctor.specialty?.name || "";

        doctorMap.set(doctor.id, {
          name: doctorName,
          specialty: specialtyName,
        });
      });
    } catch (err) {
      setError("Lỗi load dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const doctorsList = await getAllDoctors();
        setDoctors(doctorsList || []);

        const reviewsList = await getAllReviews();
        setReviews(reviewsList);

        console.log("Reviews:", reviewsList);
      } catch (err) {
        setError("Lỗi load dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Ẩn đánh giá
  const handleHideReview = async (review: ReviewWithDoctor) => {
    setProcessing(true);
    try {
      const updated = await adminHideReview(review.id);
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, isHidden: true } : r)),
      );
      showNotification("success", "Đã ẩn đánh giá thành công");
      setShowHideModal(false);
      setReviewToHide(null);
    } catch (error: any) {
      console.error("Lỗi ẩn đánh giá:", error);
      showNotification(
        "error",
        error?.response?.data?.message || "Không thể ẩn đánh giá",
      );
    } finally {
      setProcessing(false);
    }
  };

  // Hiện đánh giá
  const handleShowReview = async (review: ReviewWithDoctor) => {
    setProcessing(true);
    try {
      const updated = await adminShowReview(review.id);
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, isHidden: false } : r)),
      );
      showNotification("success", "Đã hiện đánh giá thành công");
      setShowHideModal(false);
      setReviewToHide(null);
    } catch (error: any) {
      console.error("Lỗi hiện đánh giá:", error);
      showNotification(
        "error",
        error?.response?.data?.message || "Không thể hiện đánh giá",
      );
    } finally {
      setProcessing(false);
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDoctorInfo = (doctorId: number) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    if (!doctor) return { name: `BS. ID ${doctorId}`, specialty: "" };

    const firstName = doctor.user?.firstName || "";
    const lastName = doctor.user?.lastName || "";
    const name = `${lastName} ${firstName}`.trim() || `BS. ID ${doctor.id}`;
    const specialty = doctor.specialty?.name || "";

    return { name, specialty };
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= rating
                ? "fill-[#F59E0B] text-[#F59E0B]"
                : "text-[#D0F0FD]"
            }
          />
        ))}
      </div>
    );
  };

  // Lọc reviews
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      searchTerm === "" ||
      review.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDoctor =
      selectedDoctorId === "all" || review.doctorId === selectedDoctorId;
    const matchesRating =
      selectedRating === "all" || review.rating === selectedRating;
    const matchesHidden = !showHiddenOnly || review.isHidden === true;

    return matchesSearch && matchesDoctor && matchesRating && matchesHidden;
  });

  // Phân trang - ĐÃ SỬA (chỉ khai báo 1 lần)
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Thống kê
  const stats = {
    total: reviews.length,
    visibleCount: reviews.filter((r) => !r.isHidden).length,
    hiddenCount: reviews.filter((r) => r.isHidden).length,
    averageRating:
      reviews.filter((r) => !r.isHidden).length > 0
        ? (
            reviews
              .filter((r) => !r.isHidden)
              .reduce((sum, r) => sum + (r.rating || 0), 0) /
            reviews.filter((r) => !r.isHidden).length
          ).toFixed(1)
        : 0,
    verifiedCount: reviews.filter((r) => r.verifiedBooking && !r.isHidden)
      .length,
    fiveStarCount: reviews.filter((r) => r.rating === 5 && !r.isHidden).length,
    totalDoctors: doctors.length,
  };

  if (loading) {
    return (
      <div className="admin-reviews w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-[#E6F7F5] via-[#F0FDFA] to-[#E6F7F5]">
        <style>{fontStyle}</style>
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-[#D0F0FD] border-t-[#2DD4BF] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#5B8C9E] font-medium">
            Đang tải dữ liệu đánh giá...
          </p>
        </div>
      </div>
    );
  }

  if (error && reviews.length === 0) {
    return (
      <div className="admin-reviews w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-[#E6F7F5] via-[#F0FDFA] to-[#E6F7F5]">
        <style>{fontStyle}</style>
        <div className="text-center max-w-md mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50">
          <AlertCircle className="mx-auto text-[#F59E0B] mb-4" size={48} />
          <h2 className="text-xl font-extrabold text-[#1F4A5C] mb-2">
            Lỗi tải dữ liệu
          </h2>
          <p className="text-[#5B8C9E] mb-4">{error}</p>
          <button
            onClick={fetchAllData}
            className="px-5 py-2.5 bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white rounded-xl font-extrabold text-sm hover:from-[#14B8A6] hover:to-[#0284C7] transition shadow-md"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-reviews w-full min-h-screen bg-gradient-to-br from-[#E6F7F5] via-[#F0FDFA] to-[#E6F7F5]">
      <style>{fontStyle}</style>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Star size={24} className="text-white" />
                </div>
                <h1 className="text-3xl font-extrabold">Quản lý đánh giá</h1>
              </div>
              <p className="text-white/80 font-medium ml-16">
                Quản lý và kiểm duyệt đánh giá của bệnh nhân
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-xl">
                <Shield size={16} />
                <span className="text-sm font-semibold">Quản trị viên</span>
              </div>
              <button
                onClick={fetchAllData}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-xl hover:bg-white/30 transition font-semibold"
              >
                <RefreshCw size={18} />
                Làm mới
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl animate-in slide-in-from-top-2 duration-200 ${
            notification.type === "success"
              ? "bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white"
              : "bg-gradient-to-r from-rose-500 to-red-500 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-[#2DD4BF]/10 border border-white/50 p-5 transition-all hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#5B8C9E] text-xs font-extrabold uppercase tracking-wider">
                  Tổng đánh giá
                </p>
                <p className="text-3xl font-extrabold text-[#1F4A5C] mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center">
                <MessageSquare className="text-[#2DD4BF]" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-[#2DD4BF]/10 border border-white/50 p-5 transition-all hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#5B8C9E] text-xs font-extrabold uppercase tracking-wider">
                  Đang hiển thị
                </p>
                <p className="text-3xl font-extrabold text-[#1F4A5C] mt-1">
                  {stats.visibleCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Eye className="text-emerald-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-[#2DD4BF]/10 border border-white/50 p-5 transition-all hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#5B8C9E] text-xs font-extrabold uppercase tracking-wider">
                  Đã ẩn
                </p>
                <p className="text-3xl font-extrabold text-[#1F4A5C] mt-1">
                  {stats.hiddenCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <EyeOff className="text-amber-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-[#2DD4BF]/10 border border-white/50 p-5 transition-all hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#5B8C9E] text-xs font-extrabold uppercase tracking-wider">
                  Điểm TB
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-3xl font-extrabold text-[#1F4A5C]">
                    {stats.averageRating}
                  </p>
                  <Star size={22} className="fill-[#F59E0B] text-[#F59E0B]" />
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center">
                <TrendingUp className="text-[#F59E0B]" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-[#2DD4BF]/10 border border-white/50 p-5 transition-all hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#5B8C9E] text-xs font-extrabold uppercase tracking-wider">
                  Đã xác thực
                </p>
                <p className="text-3xl font-extrabold text-[#1F4A5C] mt-1">
                  {stats.verifiedCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <CheckCircle className="text-purple-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-[#2DD4BF]/10 border border-white/50 p-5 transition-all hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#5B8C9E] text-xs font-extrabold uppercase tracking-wider">
                  Bác sĩ
                </p>
                <p className="text-3xl font-extrabold text-[#1F4A5C] mt-1">
                  {stats.totalDoctors}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center">
                <Stethoscope className="text-[#0EA5E9]" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-[#2DD4BF]/10 border border-white/50 p-5 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B8D9E6]"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Tìm theo tên bệnh nhân hoặc nội dung..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F0FDFA] border border-[#D0F0FD] rounded-xl focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 outline-none transition-all text-[#1F4A5C] font-medium placeholder:text-[#B8D9E6]"
                />
              </div>
            </div>

            <div className="w-56">
              <select
                value={selectedDoctorId}
                onChange={(e) => {
                  setSelectedDoctorId(
                    e.target.value === "all" ? "all" : Number(e.target.value),
                  );
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2.5 bg-[#F0FDFA] border border-[#D0F0FD] rounded-xl focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 outline-none transition-all text-[#1F4A5C] font-medium"
              >
                <option value="all">Tất cả bác sĩ</option>
                {doctors.map((doctor) => {
                  const { name, specialty } = getDoctorInfo(doctor.id);
                  return (
                    <option key={doctor.id} value={doctor.id}>
                      {name} {specialty ? `- ${specialty}` : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="w-36">
              <select
                value={selectedRating}
                onChange={(e) => {
                  setSelectedRating(
                    e.target.value === "all" ? "all" : Number(e.target.value),
                  );
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2.5 bg-[#F0FDFA] border border-[#D0F0FD] rounded-xl focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 outline-none transition-all text-[#1F4A5C] font-medium"
              >
                <option value="all">Tất cả số sao</option>
                <option value={5}>5 sao</option>
                <option value={4}>4 sao</option>
                <option value={3}>3 sao</option>
                <option value={2}>2 sao</option>
                <option value={1}>1 sao</option>
              </select>
            </div>

            <button
              onClick={() => setShowHiddenOnly(!showHiddenOnly)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                showHiddenOnly
                  ? "bg-amber-100 text-amber-700 border border-amber-200"
                  : "bg-[#F0FDFA] text-[#5B8C9E] hover:bg-[#E6F7F5] border border-[#D0F0FD]"
              }`}
            >
              <EyeOff size={16} />
              {showHiddenOnly ? "Đang xem bài ẩn" : "Xem bài đã ẩn"}
            </button>

            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedDoctorId("all");
                setSelectedRating("all");
                setShowHiddenOnly(false);
                setCurrentPage(1);
              }}
              className="p-2.5 text-[#5B8C9E] hover:text-[#2DD4BF] transition-all"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-[#2DD4BF]/10 border border-white/50 overflow-hidden">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare
                className="mx-auto text-[#D0F0FD] mb-3"
                size={56}
              />
              <p className="text-[#5B8C9E] font-medium">
                {showHiddenOnly
                  ? "Không có đánh giá nào bị ẩn"
                  : "Chưa có đánh giá nào"}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-[#2DD4BF]/10 to-[#0EA5E9]/10 border-b border-[#D0F0FD]">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                        Bệnh nhân
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                        Bác sĩ
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                        Chuyên khoa
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                        Đánh giá
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                        Nội dung
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                        Ngày
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6F7F5]">
                    {paginatedReviews.map((review) => {
                      const doctorInfo = getDoctorInfo(review.doctorId);
                      return (
                        <tr
                          key={review.id}
                          className={`hover:bg-[#2DD4BF]/5 transition-all ${
                            review.isHidden ? "bg-amber-50/30" : ""
                          }`}
                        >
                          <td className="px-6 py-4">
                            <span className="font-mono text-xs font-extrabold text-[#2DD4BF]">
                              #{review.id}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2DD4BF] to-[#0EA5E9] flex items-center justify-center">
                                <User size={14} className="text-white" />
                              </div>
                              <span className="font-semibold text-[#1F4A5C] text-sm">
                                {review.patientName}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-semibold text-[#1F4A5C]">
                                {review.doctorName || doctorInfo.name}
                              </p>
                              <p className="text-xs text-[#5B8C9E] font-medium">
                                ID: {review.doctorId}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {review.doctorSpecialty || doctorInfo.specialty ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#2DD4BF]/10 text-[#2DD4BF] rounded-xl text-xs font-extrabold">
                                <Stethoscope size={10} />
                                {review.doctorSpecialty || doctorInfo.specialty}
                              </span>
                            ) : (
                              <span className="text-[#B8D9E6] text-xs">--</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {renderStars(review.rating)}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-[#5B8C9E] max-w-xs truncate font-medium">
                              {review.comment}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              {review.verifiedBooking ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-extrabold w-fit">
                                  <CheckCircle size={10} /> Đã xác thực
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 rounded-xl text-xs font-extrabold w-fit">
                                  <XCircle size={10} /> Chưa xác thực
                                </span>
                              )}
                              {review.isHidden && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-600 rounded-xl text-xs font-extrabold w-fit">
                                  <EyeOff size={10} /> Đã ẩn
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-xs text-[#5B8C9E] font-medium">
                              <Calendar size={12} />
                              {formatDate(review.createdAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setSelectedReview(review)}
                                className="p-2 text-[#5B8C9E] hover:text-[#2DD4BF] hover:bg-[#E6F7F5] rounded-xl transition-all"
                                title="Xem chi tiết"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setReviewToHide(review);
                                  setShowHideModal(true);
                                }}
                                className={`p-2 rounded-xl transition-all ${
                                  review.isHidden
                                    ? "text-emerald-600 hover:bg-emerald-50"
                                    : "text-amber-600 hover:bg-amber-50"
                                }`}
                                title={
                                  review.isHidden
                                    ? "Hiện đánh giá"
                                    : "Ẩn đánh giá"
                                }
                              >
                                {review.isHidden ? (
                                  <Eye size={16} />
                                ) : (
                                  <EyeOff size={16} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination - ĐÃ SỬA */}
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-[#1F4A5C]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-[#D0F0FD] px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-extrabold text-[#1F4A5C]">
                Chi tiết đánh giá #{selectedReview.id}
              </h2>
              <button
                onClick={() => setSelectedReview(null)}
                className="p-2 hover:bg-[#E6F7F5] rounded-xl transition-all"
              >
                <XCircle size={20} className="text-[#5B8C9E]" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-[#E6F7F5]">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2DD4BF] to-[#0EA5E9] flex items-center justify-center">
                  <User size={22} className="text-white" />
                </div>
                <div>
                  <p className="font-extrabold text-[#1F4A5C]">
                    {selectedReview.patientName}
                  </p>
                  <p className="text-sm text-[#5B8C9E] font-medium">
                    User ID: {selectedReview.userId}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-extrabold text-[#5B8C9E] uppercase tracking-wider mb-1">
                  Bác sĩ
                </p>
                <p className="font-semibold text-[#1F4A5C]">
                  {selectedReview.doctorName ||
                    getDoctorInfo(selectedReview.doctorId).name}
                </p>
              </div>

              <div>
                <p className="text-xs font-extrabold text-[#5B8C9E] uppercase tracking-wider mb-1">
                  Chuyên khoa
                </p>
                <p className="text-[#1F4A5C] font-medium">
                  {selectedReview.doctorSpecialty ||
                    getDoctorInfo(selectedReview.doctorId).specialty ||
                    "--"}
                </p>
              </div>

              <div>
                <p className="text-xs font-extrabold text-[#5B8C9E] uppercase tracking-wider mb-1">
                  Đánh giá
                </p>
                {renderStars(selectedReview.rating)}
              </div>

              <div>
                <p className="text-xs font-extrabold text-[#5B8C9E] uppercase tracking-wider mb-1">
                  Nội dung
                </p>
                <p className="text-[#1F4A5C] bg-[#F0FDFA] p-4 rounded-xl border border-[#D0F0FD] font-medium">
                  {selectedReview.comment}
                </p>
              </div>

              <div>
                <p className="text-xs font-extrabold text-[#5B8C9E] uppercase tracking-wider mb-1">
                  Trạng thái
                </p>
                <div className="flex flex-col gap-2">
                  {selectedReview.verifiedBooking ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-extrabold w-fit">
                      <CheckCircle size={14} /> Đã xác thực
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-500 rounded-xl text-sm font-extrabold w-fit">
                      <XCircle size={14} /> Chưa xác thực
                    </span>
                  )}
                  {selectedReview.isHidden && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-xl text-sm font-extrabold w-fit">
                      <EyeOff size={14} /> Đã bị ẩn bởi quản trị viên
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-extrabold text-[#5B8C9E] uppercase tracking-wider mb-1">
                  Ngày tạo
                </p>
                <p className="text-[#1F4A5C] font-medium">
                  {formatDate(selectedReview.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hide/Show Confirmation Modal */}
      {showHideModal && reviewToHide && (
        <div className="fixed inset-0 bg-[#1F4A5C]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    reviewToHide.isHidden ? "bg-emerald-100" : "bg-amber-100"
                  }`}
                >
                  {reviewToHide.isHidden ? (
                    <Eye size={24} className="text-emerald-600" />
                  ) : (
                    <EyeOff size={24} className="text-amber-600" />
                  )}
                </div>
                <h3 className="text-xl font-extrabold text-[#1F4A5C]">
                  {reviewToHide.isHidden ? "Hiện đánh giá" : "Ẩn đánh giá"}
                </h3>
              </div>
              <p className="text-[#1F4A5C] font-medium mb-2">
                {reviewToHide.isHidden
                  ? `Bạn có chắc chắn muốn HIỆN lại đánh giá của "${reviewToHide.patientName}"?`
                  : `Bạn có chắc chắn muốn ẨN đánh giá của "${reviewToHide.patientName}"?`}
              </p>
              <p className="text-[#5B8C9E] text-sm mb-6">
                {reviewToHide.isHidden
                  ? "Đánh giá sẽ hiển thị lại công khai trên trang bác sĩ."
                  : "Đánh giá sẽ bị ẩn khỏi giao diện người dùng. Bạn có thể hiện lại bất cứ lúc nào."}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowHideModal(false)}
                  className="flex-1 px-4 py-2.5 border border-[#D0F0FD] rounded-xl text-[#5B8C9E] font-semibold hover:bg-[#F0FDFA] transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={() =>
                    reviewToHide.isHidden
                      ? handleShowReview(reviewToHide)
                      : handleHideReview(reviewToHide)
                  }
                  disabled={processing}
                  className={`flex-1 px-4 py-2.5 rounded-xl font-extrabold transition-all disabled:opacity-50 shadow-md ${
                    reviewToHide.isHidden
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700"
                      : "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700"
                  }`}
                >
                  {processing
                    ? "Đang xử lý..."
                    : reviewToHide.isHidden
                      ? "Hiện"
                      : "Ẩn"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
