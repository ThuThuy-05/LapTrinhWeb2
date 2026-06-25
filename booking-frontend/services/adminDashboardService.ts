import axiosInstance from "@/lib/api";

export interface AdminDashboard {
  totalDoctors: number;
  totalPatients: number;
  totalBookings: number;
  totalSpecialties: number;
  totalBranches: number;
  totalReviews: number;

  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;

  todayBookings: number;
  todayCompletedBookings: number;
  todayCancelledBookings: number;

  topDoctorName: string;
  topDoctorBookings: number;

  topSpecialtyName: string;
  topSpecialtyBookings: number;
}

export const getAdminDashboard = async (): Promise<AdminDashboard> => {
  const response = await axiosInstance.get("/dashboard/admin");

  return response.data;
};
