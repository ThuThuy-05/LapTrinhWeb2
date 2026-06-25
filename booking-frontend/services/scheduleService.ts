
// services/scheduleService.ts

import api from "@/lib/api";

export type Schedule = {
  id: number;
  date: string;
  timeStart: string;
  timeEnd: string;
  status: "AVAILABLE" | "BOOKED" | "CANCELLED";
  doctorId: number;
  roomId?: number;
  room?: {
    id: number;
    name: string;
    location: string;
  };
  doctor?: {
    id: number;
    user: {
      id: number;
      fullName: string;
      email: string;
      avatar?: string;
    };
    specialty?: {
      id: number;
      name: string;
    };
    branch?: {
      id: number;
      name: string;
    };
  };
};

// ✅ Lấy ngày hiện tại theo local timezone (định dạng yyyy-mm-dd cho input)
export const getCurrentDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// ✅ Format date hiển thị: 26/05/2026
export const formatScheduleDate = (date: string) => {
  if (!date) return "";

  // Nếu date là string yyyy-mm-dd, parse trực tiếp
  const parts = date.split("-");
  if (parts.length === 3) {
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    return `${day}/${month}/${year}`;
  }

  // Nếu date đã có dạng dd/mm/yyyy thì trả về nguyên
  if (date.includes("/")) {
    return date;
  }

  // Fallback cho các format khác
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// ✅ Format date hiển thị cho input date (yyyy-mm-dd)
export const formatDateForInput = (date: string): string => {
  if (!date) return "";

  // Nếu đã có dạng yyyy-mm-dd thì trả về
  if (date.includes("-") && date.length === 10) {
    return date;
  }

  // Nếu có dạng dd/mm/yyyy thì chuyển về yyyy-mm-dd
  const parts = date.split("/");
  if (parts.length === 3) {
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }

  return date;
};

export const formatTime = (time: string) => {
  if (!time) return "";
  return time.substring(0, 5);
};

// ✅ Dùng endpoint mới để lấy TẤT CẢ lịch
export const getAllSchedules = async (): Promise<Schedule[]> => {
  try {
    const res = await api.get("/admin/schedules/all");
    return res.data;
  } catch (error: any) {
    console.error("Admin endpoint failed:", error?.response?.status);

    try {
      const doctorsRes = await api.get("/doctors");
      const doctors = doctorsRes.data || [];

      const allSchedulesPromises = doctors.map(async (doctor: any) => {
        try {
          const schedulesRes = await api.get("/schedules", {
            params: { doctorId: doctor.id },
          });
          return schedulesRes.data || [];
        } catch (e) {
          console.error(`Error fetching schedules for doctor ${doctor.id}:`, e);
          return [];
        }
      });

      const allSchedulesArrays = await Promise.all(allSchedulesPromises);
      const allSchedules = allSchedulesArrays.flat();

      const uniqueSchedules = Array.from(
        new Map(
          allSchedules.map((schedule) => [schedule.id, schedule]),
        ).values(),
      );

      return uniqueSchedules;
    } catch (e) {
      console.error("Error fetching doctors:", e);
      return [];
    }
  }
};

// Lấy lịch theo doctor
export const getSchedulesByDoctorId = async (
  doctorId: string | number,
  status?: "AVAILABLE" | "BOOKED" | "CANCELLED",
): Promise<Schedule[]> => {
  try {
    const params: any = { doctorId: Number(doctorId) };
    if (status) params.status = status;

    const res = await api.get("/schedules", { params });
    return res.data;
  } catch (error) {
    console.error("Error fetching schedules by doctor:", error);
    return [];
  }
};

// Lấy theo ngày và doctor
export const getSchedulesByDateAndDoctor = async (
  date: string,
  doctorId?: number,
): Promise<Schedule[]> => {
  try {
    const params: any = { date };
    if (doctorId) params.doctorId = doctorId;

    const res = await api.get("/schedules", { params });
    return res.data;
  } catch (error) {
    console.error("Error fetching schedules by date:", error);
    return [];
  }
};

export const createSchedule = async (data: any): Promise<Schedule> => {
  const res = await api.post("/admin/schedules", data);
  return res.data;
};

export const updateSchedule = async (
  id: number | string,
  data: any,
): Promise<Schedule> => {
  const res = await api.put(`/admin/schedules/${id}`, data);
  return res.data;
};

export const deleteSchedule = async (id: number | string): Promise<void> => {
  await api.delete(`/admin/schedules/${id}`);
};

export const getSchedulesByDoctor = async (
  doctorId: number,
): Promise<Schedule[]> => {
  const res = await api.get(`/doctor/schedules/${doctorId}`);

  return res.data;
};
