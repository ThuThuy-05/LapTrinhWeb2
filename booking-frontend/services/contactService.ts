// services/contactService.ts
import api from "@/lib/api";

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  id: number;
  status: string;
}

export interface MessageData {
  content: string;
  sender: "user" | "support";
  contact_id?: number;
}

export interface MessageResponse {
  success: boolean;
  id: number;
}

export interface ChatMessage {
  id: number;
  content: string;
  sender: "user" | "support";
  contact_id: number | null;
  created_at: string;
}

// Tạo liên hệ mới (bảng contacts)
export const createContact = async (
  data: ContactData,
): Promise<ContactResponse> => {
  const response = await api.post("/contacts", data);
  return response.data;
};

// Gửi tin nhắn chat (bảng messages)
export const sendChatMessage = async (
  data: MessageData,
): Promise<MessageResponse> => {
  const response = await api.post("/messages", data);
  return response.data;
};

// Lấy lịch sử chat theo contact_id
export const getChatHistory = async (
  contactId: number,
): Promise<ChatMessage[]> => {
  const response = await api.get(`/messages?contact_id=${contactId}`);
  return response.data;
};

// Lấy tất cả tin nhắn (cho admin)
export const getAllMessages = async (): Promise<ChatMessage[]> => {
  const response = await api.get("/messages");
  return response.data;
};
