import axiosInstance from "@/lib/api";

export interface DoctorDashboard {
  totalAppointments: number;
  todayAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  pendingAppointments: number;
  totalPatients: number;
}

export const getDoctorDashboard = async (
  doctorId: number,
): Promise<DoctorDashboard> => {
  const response = await axiosInstance.get(`/dashboard/doctor/${doctorId}`);

  return response.data;
};
