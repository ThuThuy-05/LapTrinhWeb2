import api from "@/lib/api";

// =========================
// TYPE
// =========================

export type Banner = {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  active: boolean;
  createdAt: string;
};

// =========================
// GET ALL
// =========================

export const getBanners = async (): Promise<Banner[]> => {
  const res = await api.get("/banners");
  return res.data;
};

// =========================
// CREATE (MULTIPART)
// =========================

export const createBanner = async (
  file: File,
  title: string,
  description?: string,
): Promise<Banner> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);

  if (description) {
    formData.append("description", description);
  }

  const res = await api.post("/admin/banners/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// =========================
// UPDATE (MULTIPART - FIX QUAN TRỌNG)
// =========================

export const updateBanner = async (
  id: number,
  data: {
    file?: File;
    title: string;
    description?: string;
    active?: boolean;
  },
): Promise<Banner> => {
  const formData = new FormData();

  if (data.file) {
    formData.append("file", data.file);
  }

  formData.append("title", data.title);

  if (data.description) {
    formData.append("description", data.description);
  }

  if (data.active !== undefined) {
    formData.append("active", String(data.active));
  }

  const res = await api.put(`/admin/banners/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// =========================
// DELETE
// =========================

export const deleteBanner = async (id: number) => {
  const res = await api.delete(`/admin/banners/${id}`);
  return res.data;
};
