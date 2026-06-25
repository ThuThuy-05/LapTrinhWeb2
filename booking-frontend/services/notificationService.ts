// services/notificationService.ts
import api from "@/lib/api";

export interface Notification {
  id: number;
  content: string;
  createdAt: string;
  isRead: boolean;

  contactId: number;
}
export const getNotifications = async (
  userId: number,
): Promise<Notification[]> => {
  try {
    const response = await api.get(`/notifications/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

// Mark a single notification as read
export const markNotificationAsRead = async (
  notificationId: number,
): Promise<void> => {
  await api.put(`/notifications/${notificationId}/read`);
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (
  userId: number,
): Promise<void> => {
  await api.patch(`/notifications/user/${userId}/read-all`);
};
