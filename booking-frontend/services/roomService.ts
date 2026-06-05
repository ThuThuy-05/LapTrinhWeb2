// services/roomService.ts
import api from "@/lib/api";

// =========================
// TYPE
// =========================

export type Room = {
  id: number;
  name: string;
  location: string;
  branch?: {
    id: number;
    name: string;
    active: boolean;
  };
  active: boolean;
};

// =========================
// GET ALL (PUBLIC)
// =========================

export const getAllRooms = async (): Promise<Room[]> => {
  const res = await api.get("/rooms");
  return res.data;
};

// =========================
// GET BY ID
// =========================

export const getRoomById = async (id: number | string): Promise<Room> => {
  const res = await api.get(`/rooms/${id}`);
  return res.data;
};

// =========================
// ADMIN: CREATE
// =========================

export const createRoom = async (data: {
  name: string;
  location: string;
  branchId: number;
  active?: boolean;
}): Promise<Room> => {
  const res = await api.post("/admin/rooms", data);
  return res.data;
};

// =========================
// ADMIN: UPDATE
// =========================

export const updateRoom = async (
  id: number | string,
  data: {
    name: string;
    location: string;
    branchId: number;
    active?: boolean;
  },
): Promise<Room> => {
  const res = await api.put(`/admin/rooms/${id}`, data);
  return res.data;
};

// =========================
// ADMIN: DELETE
// =========================

export const deleteRoom = async (id: number | string): Promise<void> => {
  await api.delete(`/admin/rooms/${id}`);
};