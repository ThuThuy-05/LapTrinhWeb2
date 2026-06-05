// services/userService.ts

import api from "@/lib/api";

// ============================
// GET ALL USERS
// ============================
export const getAllUsers = async () => {
  try {
    const res = await api.get("/admin/users");

    console.log("USERS:", res.data);

    return res.data;
  } catch (error) {
    console.error("Get all users error:", error);
    throw error;
  }
};

// ============================
// GET USER BY ID
// ============================
export const getUserById = async (id: number) => {
  try {
    const res = await api.get(`/admin/users/${id}`);

    return res.data;
  } catch (error) {
    console.error("Get user error:", error);
    throw error;
  }
};

// ============================
// DELETE USER
// ============================
export const deleteUser = async (id: number) => {
  try {
    const res = await api.delete(`/admin/users/${id}`);

    return res.data;
  } catch (error) {
    console.error("Delete user error:", error);
    throw error;
  }
};

// ============================
// UPDATE USER
// ============================
export const updateUser = async (id: number, data: any) => {
  try {
    const res = await api.put(`/admin/users/${id}`, data);

    return res.data;
  } catch (error) {
    console.error("Update user error:", error);
    throw error;
  }
};

// ============================
// CHANGE USER STATUS (KHÓA/MỞ KHÓA)
// ============================
export const changeUserStatus = async (id: number, active: boolean) => {
  try {
    // Gọi đúng endpoint mà bạn đã có trong controller: /api/admin/{id}/status
    const res = await api.put(`/admin/${id}/status`, null, {
      params: { active }
    });

    return res.data;
  } catch (error) {
    console.error("Change user status error:", error);
    throw error;
  }
};
