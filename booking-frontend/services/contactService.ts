import api from "@/lib/api";

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  userId: number;
}

export interface ContactResponse {
  id: number;
  status: string;
  message: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "PENDING" | "DONE";
  adminReply?: string;
  replyAt?: string;
  createdAt: string;
}

// Patient gửi liên hệ
export const createContact = async (
  data: ContactData,
): Promise<ContactResponse> => {
  const response = await api.post("/contacts", data);
  return response.data;
};

// Lấy tất cả liên hệ (Admin)
export const getContacts = async (): Promise<Contact[]> => {
  const response = await api.get("/contacts");
  return response.data;
};

// Lấy chi tiết liên hệ
export const getContactById = async (id: number): Promise<Contact> => {
  console.log("ID =", id);

  const response = await api.get(`/contacts/${id}`);
  return response.data;
};
// Admin phản hồi
export const replyContact = async (
  id: number,
  reply: string,
): Promise<Contact> => {
  const response = await api.post(`/contacts/${id}/reply`, {
    reply,
  });

  return response.data;
};
