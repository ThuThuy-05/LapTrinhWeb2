// services/bookingService.ts
import api from "@/lib/api";

export type Booking = {
  id: number;
  symptom: string;
  status: string;
  bookingDate: string;
  qrCode: string;
  createdAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    phone: string;
    email: string;
    dateOfBirth: string;
    gender: string;
    avatar: string;
    address: string;
    role: string;
    active: boolean;
  };
  schedule: {
    id: number;
    date: string;
    timeStart: string;
    timeEnd: string;
    status: string;
    doctor: {
      id: number;
      degree: string;
      experience: number;
      description: string;
      specialty: {
        id: number;
        name: string;
        description: string;
        price: number;
        image: string;
        active: boolean;
      };
      branch: {
        id: number;
        name: string;
        active: boolean;
      };
      user: {
        id: number;
        firstName: string;
        lastName: string;
        fullName: string;
        phone: string;
        email: string;
        avatar: string;
        role: string;
      };
    };
    room: {
      id: number;
      name: string;
      location: string;
      branch: {
        id: number;
        name: string;
        active: boolean;
      };
      active: boolean;
    };
  };
};

// Lấy tất cả booking (Admin)
export const getAllBookings = async () => {
  const response = await api.get<Booking[]>("/bookings");
  return response.data;
};

// Lấy booking theo ID
export const getBookingById = async (id: number) => {
  const response = await api.get<Booking>(`/bookings/${id}`);
  return response.data;
};

// Hủy booking (Admin)
export const cancelBooking = async (id: number) => {
  const response = await api.delete(`/admin/bookings/${id}`);
  return response.data;
};

// Cập nhật trạng thái booking (Admin)
export const updateBookingStatus = async (id: number, status: string) => {
  const response = await api.put(`/admin/bookings/${id}`, { status });
  return response.data;
};

// Tạo booking mới
export const createBooking = async (data: {
  userId: number;
  scheduleId: number;
  symptom: string;
}) => {
  const response = await api.post(`/bookings`, data);
  return response.data;
};

// Lấy booking của user
export const getMyBookings = async (userId: string | number) => {
  const response = await api.get<Booking[]>(`/bookings/my-bookings/${userId}`);
  return response.data;
};

// // services/bookingService.ts
// import api from "@/lib/api";

// export type Booking = {
//   id: number;
//   symptom: string;
//   status: string;
//   bookingDate: string;
//   qrCode: string;
//   // 🚀 ĐÃ SỬA: Đồng bộ chuẩn 100% với object "user" từ Backend trả về
//   user: {
//     id: number;
//     fullName: string;
//     dateOfBirth: string; // Backend trả về dateOfBirth
//     gender: string;
//     phone: string;
//     email: string;
//     address: string;
//     role: string;
//     active: boolean;
//   };
//   schedule: {
//     id: number;
//     date: string;
//     timeStart: string;
//     timeEnd: string;
//     doctor: {
//       id: number;
//       degree: string;
//       specialty: {
//         name: string;
//       };
//       user: {
//         avatar: string;
//         fullName: string;
//       };
//     };
//     room: {
//       name: string;
//       location: string;
//     };
//   };
// };

// export const getMyBookings = async (userId: string | number) => {
//   const response = await api.get<Booking[]>(`/bookings/my-bookings/${userId}`);
//   return response.data;
// };

// export const getBookingById = async (id: number) => {
//   const response = await api.get<Booking>(`/bookings/${id}`);
//   return response.data;
// };

// export const cancelBooking = async (id: number) => {
//   const response = await api.delete(`/admin/bookings/${id}`);
//   return response.data;
// };

// export const createBooking = async (data: {
//   userId: number;
//   scheduleId: number;
//   symptom: string;
// }) => {
//   const response = await api.post(`/bookings`, data);
//   return response.data;
// };
