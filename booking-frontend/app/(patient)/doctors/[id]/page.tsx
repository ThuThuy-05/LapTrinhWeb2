// app/(patient)/doctors/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  MessageCircle,
  CalendarDays,
  Heart,
  Share2,
  Bookmark,
  ChevronRight,
  Star,
  Clock,
  Hospital,
  Stethoscope,
  UserCircle,
  Phone,
  Mail,
  CheckCircle,
  Video,
  EyeOff,
} from "lucide-react";

import { getDoctorById, Doctor } from "@/services/doctorService";
import {
  getDoctorReviews,
  getAverageRating,
  Review,
  getCurrentUserId,
} from "@/services/reviewService";

import { CreateReviewModal } from "../components/CreateReviewModal";
import { RatingStars } from "../components/RatingStars";
import DoctorReviews from "../components/DoctorReviews";
import DoctorSidebar from "../components/DoctorSidebar";
import DoctorSchedule from "../components/DoctorSchedule";
const InfoCard = ({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
    <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-blue-50 rounded-lg">
          <Icon size={18} className="text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const SpecialtyTag = ({
  name,
  isMain = false,
}: {
  name: string;
  isMain?: boolean;
}) => (
  <span
    className={`
    inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all
    ${
      isMain
        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm"
        : "bg-blue-50 text-blue-700 hover:bg-blue-100"
    }
  `}
  >
    {isMain && <Stethoscope size={12} className="mr-1" />}
    {name}
  </span>
);

const StatBadge = ({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) => (
  <div className="text-center px-3 py-2 bg-gray-50 rounded-xl">
    <p className="text-xl font-bold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
  </div>
);

export default function DoctorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = parseInt(params.id as string);

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [allReviews, setAllReviews] = useState<Review[]>([]); // Lưu tất cả reviews từ API
  const [visibleReviews, setVisibleReviews] = useState<Review[]>([]); // Chỉ lưu review chưa ẩn
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hiddenCount, setHiddenCount] = useState(0); // Số lượng review bị ẩn

  const [currentUserId] = useState<number | undefined>(() => {
    if (typeof window === "undefined") return undefined;
    return getCurrentUserId() ?? undefined;
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [doctorData, reviewsData, avgData] = await Promise.all([
        getDoctorById(doctorId),
        getDoctorReviews(doctorId),
        getAverageRating(doctorId),
      ]);

      setDoctor(doctorData);
      setAllReviews(reviewsData);

      // ✅ Lọc chỉ lấy review chưa bị ẩn (isHidden = false)
      const visible = reviewsData.filter((review) => !review.isHidden);
      setVisibleReviews(visible);

      // Đếm số lượng review bị ẩn
      const hidden = reviewsData.filter((review) => review.isHidden).length;
      setHiddenCount(hidden);

      setAvgRating(avgData);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!doctorId) return;
    loadData();
  }, [doctorId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Stethoscope size={24} className="text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            Đang tải thông tin bác sĩ...
          </p>
        </div>
      </div>
    );
  }

  if (!doctor) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 rounded-b-3xl shadow-xl">
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-gray-700 hover:bg-gray-100 transition"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Quay lại</span>
            </button>

            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl text-white hover:bg-white/20 transition">
                <Share2 size={18} />
              </button>
              <button
                onClick={() => setIsSaved(!isSaved)}
                className="p-2 rounded-xl text-white hover:bg-white/20 transition"
              >
                <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-xl opacity-60"></div>
              <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden bg-white border-4 border-white shadow-xl">
                {doctor.user?.avatar ? (
                  <Image
                    src={doctor.user.avatar}
                    alt=""
                    width={144}
                    height={144}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-500 text-5xl text-white">
                    👨‍⚕️
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 text-white">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold mb-3">
                    BS. {doctor.user?.lastName} {doctor.user?.firstName}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <SpecialtyTag
                      name={doctor.specialty?.name || "Chuyên khoa"}
                      isMain
                    />

                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-xl">
                      <RatingStars rating={avgRating} size={14} />
                      <span className="text-sm font-medium">
                        {avgRating.toFixed(1)} · {visibleReviews.length} đánh
                        giá
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-white/90">
                    <Hospital size={16} />
                    <span className="font-medium">
                      {doctor.branch?.name || "Đang cập nhật"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => router.push(`/booking/${doctor.id}`)}
                    className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg"
                  >
                    <CalendarDays size={18} />
                    Đặt lịch ngay
                  </button>

                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 px-6 py-3 rounded-xl font-medium flex items-center gap-2"
                  >
                    <Heart size={18} />
                    Đánh giá
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <StatBadge value={doctor.experience} label="Năm kinh nghiệm" />
              <StatBadge value={visibleReviews.length} label="Đánh giá" />
              <StatBadge value={avgRating.toFixed(1)} label="Sao trung bình" />
            </div>

            <InfoCard icon={Clock} title="Lịch làm việc">
              <DoctorSchedule doctorId={doctor.id} />
            </InfoCard>

            <InfoCard icon={UserCircle} title="Giới thiệu">
              <p className="text-gray-600 leading-relaxed">
                {doctor.description ||
                  `Bác sĩ ${doctor.user?.lastName} ${doctor.user?.firstName} là chuyên gia hàng đầu trong lĩnh vực ${doctor.specialty?.name}. Với hơn ${doctor.experience} năm kinh nghiệm và tận tâm với nghề, bác sĩ đã điều trị thành công cho hàng nghìn bệnh nhân.`}
              </p>
            </InfoCard>

            {/* Đánh giá */}
            <InfoCard icon={MessageCircle} title="Đánh giá từ bệnh nhân">
              <DoctorReviews
                visibleReviews={visibleReviews}
                hiddenCount={hiddenCount}
                currentUserId={currentUserId}
                showAllReviews={showAllReviews}
                setShowAllReviews={setShowAllReviews}
                loadData={loadData}
              />
            </InfoCard>
          </div>

          {/* Right Column */}
          <DoctorSidebar doctor={doctor} />
        </div>
      </div>

      {/* Modal */}
      <CreateReviewModal
        open={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        doctorId={doctor.id}
        doctorName={`${doctor.user?.lastName} ${doctor.user?.firstName}`}
        onSuccess={loadData}
      />
    </div>
  );
}
