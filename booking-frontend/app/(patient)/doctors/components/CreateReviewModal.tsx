// components/patient/doctor/CreateReviewModal.tsx

"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { createReview } from "@/services/reviewService";

interface CreateReviewModalProps {
  open: boolean;
  onClose: () => void;
  doctorId: number;
  doctorName: string;
  onSuccess: () => void;
}

export const CreateReviewModal = ({
  open,
  onClose,
  doctorId,
  doctorName,
  onSuccess,
}: CreateReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    console.log("doctorId =", doctorId);
    console.log("rating =", rating);
    console.log("comment =", comment);
    if (rating === 0) {
      alert("Vui lòng chọn số sao");
      return;
    }
    if (!comment.trim()) {
      alert("Vui lòng nhập nội dung");
      return;
    }

    setSubmitting(true);
    try {
      await createReview({
        doctorId,
        rating,
        comment: comment.trim(),
      });

      alert("✅ Gửi đánh giá thành công!");
      onSuccess();
      onClose();
      setRating(0);
      setComment("");
    } catch (error: any) {
      console.error("Lỗi gửi review:", error);
      alert(
        error.response?.data?.message || "❌ Gửi thất bại, vui lòng thử lại",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold text-gray-800">Đánh giá bác sĩ</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">
              Bạn đánh giá bác sĩ{" "}
              <span className="font-semibold text-gray-700">{doctorName}</span>{" "}
              như thế nào?
            </p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(s)}
                  className="transition-all hover:scale-110 focus:outline-none"
                >
                  <Star
                    size={44}
                    className={`${
                      (hoverRating || rating) >= s
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-xs text-blue-600 mt-2">
                Bạn đã chọn {rating} / 5 sao
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Chia sẻ trải nghiệm của bạn
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
              placeholder="Bác sĩ khám rất kỹ, tận tâm, giải thích dễ hiểu..."
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {comment.length}/500
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang gửi...
              </div>
            ) : (
              "Gửi đánh giá"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
