import api from "@/lib/api";

export interface Message {
  id: number;
  sender: string;
  content: string;
  createdAt: string;
}

export const getMessages = async (contactId: number): Promise<Message[]> => {
  const response = await api.get(`/messages/${contactId}`);
  return response.data;
};

export const sendMessage = async (
  contactId: number,
  sender: string,
  content: string,
) => {
  const response = await api.post(`/messages/${contactId}`, {
    sender,
    content,
  });

  return response.data;
};
