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
  Review,
} from "@/services/reviewService";
import { getAllDoctors, Doctor } from "@/services/doctorService";

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

  const itemsPerPage = 10;

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
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
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

  // Phân trang
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
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải dữ liệu đánh giá...</p>
        </div>
      </div>
    );
  }

  if (error && reviews.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-700 mb-2">
            Lỗi tải dữ liệu
          </h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchAllData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Quản lý đánh giá</h1>
              <p className="text-blue-100 mt-2">
                Quản lý và kiểm duyệt đánh giá của bệnh nhân
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
                <Shield size={16} />
                <span className="text-sm">Quản trị viên</span>
              </div>
              <button
                onClick={fetchAllData}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
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
          className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-slide-in ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Tổng đánh giá</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.total}
                </p>
              </div>
              <MessageSquare className="text-blue-500" size={40} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Đang hiển thị</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.visibleCount}
                </p>
              </div>
              <Eye className="text-green-500" size={40} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Đã ẩn</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.hiddenCount}
                </p>
              </div>
              <EyeOff className="text-orange-500" size={40} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Điểm TB</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-gray-800">
                    {stats.averageRating}
                  </p>
                  <Star size={24} className="fill-yellow-400 text-yellow-400" />
                </div>
              </div>
              <TrendingUp className="text-yellow-500" size={40} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Đã xác thực</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.verifiedCount}
                </p>
              </div>
              <CheckCircle className="text-purple-500" size={40} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Bác sĩ</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.totalDoctors}
                </p>
              </div>
              <Stethoscope className="text-indigo-500" size={40} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                showHiddenOnly
                  ? "bg-orange-100 text-orange-700 border-orange-300"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
              className="px-4 py-2 text-gray-600 hover:text-blue-600 transition"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500">
                {showHiddenOnly
                  ? "Không có đánh giá nào bị ẩn"
                  : "Chưa có đánh giá nào"}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                        Bệnh nhân
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                        Bác sĩ
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                        Chuyên khoa
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                        Đánh giá
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                        Nội dung
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                        Trạng thái
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                        Ngày
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedReviews.map((review) => {
                      const doctorInfo = getDoctorInfo(review.doctorId);
                      return (
                        <tr
                          key={review.id}
                          className={`hover:bg-gray-50 transition ${review.isHidden ? "bg-orange-50/30" : ""}`}
                        >
                          <td className="px-6 py-4 text-sm text-gray-500">
                            #{review.id}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <User size={16} className="text-blue-600" />
                              </div>
                              <span className="font-medium text-gray-800">
                                {review.patientName}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {review.doctorName || doctorInfo.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                ID: {review.doctorId}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {review.doctorSpecialty || doctorInfo.specialty ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                                <Stethoscope size={12} />
                                {review.doctorSpecialty || doctorInfo.specialty}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">--</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {renderStars(review.rating)}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-600 max-w-xs truncate">
                              {review.comment}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              {review.verifiedBooking ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs w-fit">
                                  <CheckCircle size={12} /> Đã xác thực
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs w-fit">
                                  <XCircle size={12} /> Chưa xác thực
                                </span>
                              )}
                              {review.isHidden && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs w-fit">
                                  <EyeOff size={12} /> Đã ẩn
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              {formatDate(review.createdAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setSelectedReview(review)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Xem chi tiết"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                onClick={() => {
                                  setReviewToHide(review);
                                  setShowHideModal(true);
                                }}
                                className={`p-2 rounded-lg transition ${
                                  review.isHidden
                                    ? "text-green-600 hover:bg-green-50"
                                    : "text-orange-600 hover:bg-orange-50"
                                }`}
                                title={
                                  review.isHidden
                                    ? "Hiện đánh giá"
                                    : "Ẩn đánh giá"
                                }
                              >
                                {review.isHidden ? (
                                  <Eye size={18} />
                                ) : (
                                  <EyeOff size={18} />
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-1 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-blue-600 transition"
                  >
                    <ChevronLeft size={18} /> Trước
                  </button>
                  <div className="flex gap-2">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-lg transition ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-1 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-blue-600 transition"
                  >
                    Sau <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Chi tiết đánh giá #{selectedReview.id}
              </h2>
              <button
                onClick={() => setSelectedReview(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <XCircle size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {selectedReview.patientName}
                  </p>
                  <p className="text-sm text-gray-500">
                    User ID: {selectedReview.userId}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Bác sĩ</p>
                <p className="font-medium text-gray-800">
                  {selectedReview.doctorName ||
                    getDoctorInfo(selectedReview.doctorId).name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Chuyên khoa</p>
                <p className="text-gray-700">
                  {selectedReview.doctorSpecialty ||
                    getDoctorInfo(selectedReview.doctorId).specialty ||
                    "--"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Đánh giá</p>
                {renderStars(selectedReview.rating)}
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Nội dung</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {selectedReview.comment}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
                <div className="flex flex-col gap-2">
                  {selectedReview.verifiedBooking ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm w-fit">
                      <CheckCircle size={14} /> Đã xác thực
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-sm w-fit">
                      <XCircle size={14} /> Chưa xác thực
                    </span>
                  )}
                  {selectedReview.isHidden && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm w-fit">
                      <EyeOff size={14} /> Đã bị ẩn bởi quản trị viên
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Ngày tạo</p>
                <p className="text-gray-700">
                  {formatDate(selectedReview.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hide/Show Confirmation Modal */}
      {showHideModal && reviewToHide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    reviewToHide.isHidden ? "bg-green-100" : "bg-orange-100"
                  }`}
                >
                  {reviewToHide.isHidden ? (
                    <Eye size={24} className="text-green-600" />
                  ) : (
                    <EyeOff size={24} className="text-orange-600" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {reviewToHide.isHidden ? "Hiện đánh giá" : "Ẩn đánh giá"}
                </h3>
              </div>
              <p className="text-gray-600 mb-2">
                {reviewToHide.isHidden
                  ? `Bạn có chắc chắn muốn HIỆN lại đánh giá của "${reviewToHide.patientName}"?`
                  : `Bạn có chắc chắn muốn ẨN đánh giá của "${reviewToHide.patientName}"?`}
              </p>
              <p className="text-gray-500 text-sm mb-6">
                {reviewToHide.isHidden
                  ? "Đánh giá sẽ hiển thị lại công khai trên trang bác sĩ."
                  : "Đánh giá sẽ bị ẩn khỏi giao diện người dùng. Bạn có thể hiện lại bất cứ lúc nào."}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowHideModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
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
                  className={`flex-1 px-4 py-2 rounded-lg transition disabled:opacity-50 ${
                    reviewToHide.isHidden
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-orange-600 text-white hover:bg-orange-700"
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
