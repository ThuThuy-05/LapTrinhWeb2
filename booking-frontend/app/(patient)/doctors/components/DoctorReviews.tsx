"use client";

import { MessageCircle, ChevronRight, EyeOff } from "lucide-react";
import { Review } from "@/services/reviewService";
import { ReviewCard } from "./ReviewCard";

interface DoctorReviewsProps {
  visibleReviews: Review[];
  hiddenCount: number;
  currentUserId?: number;
  showAllReviews: boolean;
  setShowAllReviews: React.Dispatch<React.SetStateAction<boolean>>;
  loadData: () => void;
}

export default function DoctorReviews({
  visibleReviews,
  hiddenCount,
  currentUserId,
  showAllReviews,
  setShowAllReviews,
  loadData,
}: DoctorReviewsProps) {
  const displayedReviews = showAllReviews
    ? visibleReviews
    : visibleReviews.slice(0, 3);

  return (
    <>
      {visibleReviews.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <MessageCircle size={24} className="text-gray-400" />
          </div>

          <p className="text-gray-500 font-medium">Chưa có đánh giá nào</p>

          <p className="text-gray-400 text-sm mt-1">
            Hãy là người đầu tiên chia sẻ trải nghiệm của bạn
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {displayedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUserId={currentUserId}
              onUpdate={loadData}
            />
          ))}

          {hiddenCount > 0 && (
            <div className="flex items-center justify-center gap-2 py-2 text-xs text-gray-400 border-t border-gray-100 mt-2">
              <EyeOff size={12} />
              <span>{hiddenCount} đánh giá đã bị ẩn bởi quản trị viên</span>
            </div>
          )}

          {visibleReviews.length > 3 && (
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-3 border-t border-gray-100 mt-2 flex items-center justify-center gap-1"
            >
              {showAllReviews
                ? "Thu gọn"
                : `Xem tất cả ${visibleReviews.length} đánh giá`}

              <ChevronRight
                size={14}
                className={`transition-transform ${
                  showAllReviews ? "rotate-90" : ""
                }`}
              />
            </button>
          )}
        </div>
      )}
    </>
  );
}
