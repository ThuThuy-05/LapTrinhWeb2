import api from "@/lib/api";

// =========================
// TYPE
// =========================

export type Branch = {
  id: number;
  name: string;
  address: string;
  active: boolean;
};

// =========================
// GET ALL
// =========================

export const getAllBranches = async (): Promise<Branch[]> => {
  const res = await api.get("/branches");
  return res.data;
};
// =========================
// GET BY ID
// =========================

export const getBranchById = async (id: number | string): Promise<Branch> => {
  const res = await api.get(`/branches/${id}`);
  return res.data;
};

// =========================
// ADMIN: CREATE
// =========================

export const createBranch = async (data: {
  name: string;
  address: string;
  active?: boolean;
}): Promise<Branch> => {
  const res = await api.post("/admin/branches", data);
  return res.data;
};

// =========================
// ADMIN: UPDATE
// =========================

export const updateBranch = async (
  id: number | string,
  data: { name: string; address: string; active?: boolean },
): Promise<Branch> => {
  const res = await api.put(`/admin/branches/${id}`, data);
  return res.data;
};

// =========================
// ADMIN: DELETE
// =========================

export const deleteBranch = async (id: number | string): Promise<void> => {
  await api.delete(`/admin/branches/${id}`);
};

export const getDoctorsByBranch = async (branchId: number | string) => {
  const res = await api.get(`/branches/${branchId}/doctors`);

  return res.data;
};
