import api from "@/lib/api";

// ============================
// TYPE DEFINITION (THÊM PHẦN NÀY ĐỂ HẾT LỖI)
// ============================
export type Specialty = {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  active: boolean;
};

// ============================
// GET ALL (PUBLIC)
// ============================
export const getAllSpecialties = async (): Promise<Specialty[]> => {
  const res = await api.get("/specialties");
  return res.data;
};

// ============================
// CREATE (UPLOAD FILE)
// ============================
export const createSpecialty = async (data: {
  name: string;
  description: string;
  file: File;
  price: number;
  active?: boolean;
}): Promise<Specialty> => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("description", data.description || "");
  formData.append("file", data.file);
  formData.append("active", String(data.active ?? true));
  formData.append("price", String(data.price));

  const res = await api.post("/admin/specialties", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ============================
// UPDATE
// ============================
export const updateSpecialty = async (
  id: number,
  data: {
    name: string;
    description: string;
    file?: File | null;
    active?: boolean;
    price: number;
  },
): Promise<Specialty> => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("description", data.description || "");
  formData.append("price", String(data.price));

  if (data.active !== undefined) {
    formData.append("active", String(data.active));
  }

  if (data.file) {
    formData.append("file", data.file);
  }

  const res = await api.put(`/admin/specialties/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// ============================
// DELETE
// ============================
export const deleteSpecialty = async (id: number): Promise<void> => {
  await api.delete(`/admin/specialties/${id}`);
};
