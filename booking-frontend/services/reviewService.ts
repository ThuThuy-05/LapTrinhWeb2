// services/reviewService.ts

import api from "@/lib/api";

export interface Review {
  id: number;
  userId: number;
  doctorId: number;
  patientName: string;
  rating: number;
  comment: string;
  verifiedBooking: boolean;
  createdAt: string;
  date?: string;
  isHidden?: boolean;
}

export interface ReviewRequest {
  doctorId: number;
  rating: number;
  comment: string;
}

// Hàm lấy userId hiện tại
export const getCurrentUserId = (): number | null => {
  const userId = localStorage.getItem("userId");
  if (userId) {
    return parseInt(userId);
  }

  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const id = payload.userId || payload.sub || payload.id;
      if (id) {
        localStorage.setItem("userId", String(id));
        return parseInt(id);
      }
    } catch (e) {
      console.error("Lỗi parse token:", e);
    }
  }

  return null;
};

// Lấy danh sách đánh giá theo bác sĩ (BE đã lọc isHidden = false)
export const getDoctorReviews = async (doctorId: number): Promise<Review[]> => {
  try {
    const response = await api.get(`/reviews/doctor/${doctorId}`);
    console.log("📥 Nhận reviews từ BE:", response.data);

    let reviews = response.data;
    if (!Array.isArray(reviews)) {
      reviews = reviews.content || reviews.data || [];
    }

    return reviews.map((review: any) => ({
      id: review.id,
      userId: review.userId,
      doctorId: review.doctorId,
      patientName: review.userName || `Bệnh nhân ${review.userId}`,
      rating: review.rating,
      comment: review.comment,
      verifiedBooking: review.verifiedBooking ?? true,
      createdAt: review.createdAt || new Date().toISOString(),
      date: review.createdAt,
      isHidden: review.isHidden || false,
    }));
  } catch (error) {
    console.error("Lỗi lấy reviews:", error);
    return [];
  }
};

// Lấy điểm trung bình
export const getAverageRating = async (doctorId: number): Promise<number> => {
  try {
    const response = await api.get(`/reviews/doctor/${doctorId}/average`);
    return response.data || 0;
  } catch (error) {
    console.error("Lỗi lấy điểm TB:", error);
    return 0;
  }
};

// Tạo đánh giá mới (POST)
export const createReview = async (data: ReviewRequest): Promise<Review> => {
  try {
    const userId = getCurrentUserId();

    if (!userId) {
      throw new Error("Không tìm thấy userId. Vui lòng đăng nhập lại!");
    }

    const payload = {
      userId: userId,
      doctorId: data.doctorId,
      rating: data.rating,
      comment: data.comment,
    };

    console.log("📤 Tạo review payload:", payload);
    const response = await api.post("/reviews", payload);
    console.log("📥 Response:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("❌ Lỗi tạo review:", error);
    throw error;
  }
};

// Cập nhật đánh giá (PUT)
export const updateReview = async (
  reviewId: number,
  data: {
    rating: number;
    comment: string;
  },
): Promise<Review> => {
  try {
    const userId = getCurrentUserId();

    if (!userId) {
      throw new Error("Không tìm thấy userId. Vui lòng đăng nhập lại!");
    }

    const payload = {
      rating: data.rating,
      comment: data.comment,
    };

    console.log(`📤 Cập nhật review ${reviewId}:`, payload);

    const response = await api.put(`/reviews/${reviewId}`, payload, {
      params: { userId: userId },
    });

    return response.data;
  } catch (error: any) {
    console.error(`❌ Lỗi cập nhật review ${reviewId}:`, error);
    throw error;
  }
};

// Xóa đánh giá (DELETE) - Chỉ chủ review mới xóa được
export const deleteReview = async (reviewId: number): Promise<void> => {
  try {
    const userId = getCurrentUserId();

    if (!userId) {
      throw new Error("Không tìm thấy userId. Vui lòng đăng nhập lại!");
    }

    console.log(`📤 Xóa review ${reviewId}`);

    await api.delete(`/reviews/${reviewId}`, {
      params: { userId: userId },
    });
  } catch (error: any) {
    console.error(`❌ Lỗi xóa review ${reviewId}:`, error);
    throw error;
  }
};

// ✅ Admin: Ẩn đánh giá (BE trả về ReviewResponse có isHidden)
export const adminHideReview = async (reviewId: number): Promise<Review> => {
  try {
    const response = await api.put(`/reviews/admin/reviews/${reviewId}/hide`);
    console.log(`📤 Đã ẩn review ${reviewId}:`, response.data);

    // BE trả về ReviewResponse đã cập nhật
    return {
      id: response.data.id,
      userId: response.data.userId,
      doctorId: 0, // BE không trả về doctorId trong response
      patientName: response.data.userName,
      rating: response.data.rating,
      comment: response.data.comment,
      verifiedBooking: true,
      createdAt: response.data.createdAt,
      isHidden: response.data.isHidden ?? true,
    };
  } catch (error: any) {
    console.error(`❌ Lỗi ẩn review ${reviewId}:`, error);
    throw error;
  }
};

// ✅ Admin: Hiện đánh giá (BE trả về ReviewResponse có isHidden)
export const adminShowReview = async (reviewId: number): Promise<Review> => {
  try {
    const response = await api.put(`/reviews/admin/reviews/${reviewId}/show`);
    console.log(`📤 Đã hiện review ${reviewId}:`, response.data);

    // BE trả về ReviewResponse đã cập nhật
    return {
      id: response.data.id,
      userId: response.data.userId,
      doctorId: 0,
      patientName: response.data.userName,
      rating: response.data.rating,
      comment: response.data.comment,
      verifiedBooking: true,
      createdAt: response.data.createdAt,
      isHidden: response.data.isHidden ?? false,
    };
  } catch (error: any) {
    console.error(`❌ Lỗi hiện review ${reviewId}:`, error);
    throw error;
  }
};

export const getAllReviews = async (): Promise<Review[]> => {
  const response = await api.get("/reviews/admin/reviews");

  return response.data.map((review: any) => ({
    id: review.id,
    userId: review.userId,
    doctorId: review.doctorId,
    patientName: review.userName || `User ${review.userId}`,
    doctorName: review.doctorName,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    isHidden: review.isHidden ?? false,
  }));
};