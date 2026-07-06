// components/patient/doctor/ReviewCard.tsx

"use client";

import { useState } from "react";
import { Star, Edit2, Trash2, CheckCircle, X, EyeOff } from "lucide-react";
import { RatingStars } from "./RatingStars";
import {
  updateReview,
  deleteReview,
  getCurrentUserId,
} from "@/services/reviewService";

interface Review {
  id: number;
  userId: number;
  patientName: string;
  rating: number;
  comment: string;
  verifiedBooking: boolean;
  date?: string;
  createdAt?: string;
  isHidden?: boolean;
}

interface ReviewCardProps {
  review: Review;
  currentUserId?: number;
  onUpdate: () => void;
}

export const ReviewCard = ({
  review,
  currentUserId,
  onUpdate,
}: ReviewCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editComment, setEditComment] = useState(review.comment);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const loggedInUserId = getCurrentUserId();
  const isOwner = loggedInUserId === review.userId;

  // Nếu review bị ẩn bởi admin, hiển thị thông báo
  if (review.isHidden) {
    return (
      <div className="border-b border-gray-100 pb-4 last:border-0">
        <div className="flex items-start gap-3 opacity-60">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold shrink-0">
            {review.patientName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-medium text-gray-500 line-through">
                {review.patientName || `Người dùng ${review.userId}`}
              </p>
              <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                <EyeOff size={10} /> Đã bị ẩn bởi quản trị viên
              </span>
            </div>
            <RatingStars rating={review.rating} size={12} />
            <p className="text-sm text-gray-400 italic mt-2">
              Nội dung đã bị ẩn do vi phạm tiêu chuẩn cộng đồng.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN");
  };

  const handleUpdate = async () => {
    if (editRating === 0) {
      alert("Vui lòng chọn số sao");
      return;
    }
    if (!editComment.trim()) {
      alert("Vui lòng nhập nội dung");
      return;
    }

    setSubmitting(true);
    try {
      console.log(`✏️ Đang cập nhật review ${review.id}...`);
      await updateReview(review.id, {
        rating: editRating,
        comment: editComment.trim(),
      });
      alert("✅ Cập nhật đánh giá thành công!");
      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      console.error("Lỗi cập nhật:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "❌ Cập nhật thất bại";
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      console.log(`🗑️ Đang xóa review ${review.id}...`);
      await deleteReview(review.id);
      alert("✅ Xóa đánh giá thành công!");
      setShowDeleteConfirm(false);
      onUpdate();
    } catch (error: any) {
      console.error("Lỗi xóa:", error);
      const errorMsg =
        error.response?.data?.message || error.message || "❌ Xóa thất bại";
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Chế độ xem
  if (!isEditing) {
    return (
      <>
        <div className="border-b border-gray-100 pb-4 last:border-0 group relative">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0">
              {review.patientName?.charAt(0)?.toUpperCase() || "U"}
            </div>

            {/* Nội dung */}
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium text-gray-900">
                  {review.patientName || `Người dùng ${review.userId}`}
                </p>
                {review.verifiedBooking && (
                  <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    <CheckCircle size={10} /> Đã khám
                  </span>
                )}
              </div>
              <RatingStars rating={review.rating} size={12} />
              <p className="text-sm text-gray-600 leading-relaxed mt-2">
                {review.comment}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {formatDate(review.date || review.createdAt)}
              </p>
            </div>

            {/* Nút sửa/xóa - CHỈ HIỆN KHI LÀ CHỦ SỞ HỮU */}
            {isOwner && (
              <div className="absolute top-0 right-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Sửa đánh giá"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Xóa đánh giá"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal xác nhận xóa */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-sm w-full p-5">
              <h3 className="text-lg font-semibold mb-2">Xóa đánh giá?</h3>
              <p className="text-sm text-gray-600 mb-5">
                Bạn có chắc chắn muốn xóa đánh giá này không?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {submitting ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Chế độ sửa
  return (
    <div className="border-2 border-blue-200 rounded-xl p-4 bg-blue-50/30 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-semibold text-gray-900">Sửa đánh giá</h4>
        <button
          onClick={() => setIsEditing(false)}
          className="p-1 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Đánh giá của bạn:</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setEditRating(star)}
            >
              <Star
                size={32}
                className={`${
                  (hoverRating || editRating) >= star
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                } transition-colors`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Nội dung đánh giá
        </label>
        <textarea
          rows={3}
          value={editComment}
          onChange={(e) => setEditComment(e.target.value)}
          className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-blue-500 outline-none resize-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setIsEditing(false)}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          onClick={handleUpdate}
          disabled={submitting}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  );
};
