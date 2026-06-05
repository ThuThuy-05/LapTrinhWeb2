import api from "@/lib/api";

// =========================
// TYPE
// =========================

export type Doctor = {
  id: number;

  user: {
    id: number;

    firstName: string;

    lastName: string;

    email?: string;

    avatar?: string;

    gender?: string;

    phone?: string;

    dateOfBirth?: string;

    address?: string;
  };

  specialty: {
    id: number;

    name: string;

    price?: number;
  };

  branch?: {
    id: number;

    name: string;

    address?: string;

    phone?: string;
  };

  experience: number;

  description?: string;

  degree?: string;

  active?: boolean;
};

// =========================
// GET ALL
// =========================

export const getAllDoctors = async (): Promise<Doctor[]> => {
  const response = await api.get("/doctors");

  return response.data;
};

// =========================
// GET BY ID
// =========================

export const getDoctorById = async (id: string | number): Promise<Doctor> => {
  const response = await api.get(`/doctors/${id}`);

  return response.data;
};

// =========================
// CREATE
// =========================

export const createDoctor = async (data: any): Promise<Doctor> => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (key === "file") {
      if (data[key]) {
        formData.append("file", data[key]);
      }
    } else {
      formData.append(key, String(data[key]));
    }
  });

  const response = await api.post("/admin/doctors", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// =========================
// UPDATE
// =========================

export const updateDoctor = async (id: number, data: any): Promise<Doctor> => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (key === "file") {
      if (data[key]) {
        formData.append("file", data[key]);
      }
    } else {
      formData.append(key, String(data[key]));
    }
  });

  const response = await api.put(`/admin/doctors/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// =========================
// FILTER
// =========================

export const getDoctorsByFilter = async (
  branchId?: string,
  specialtyId?: string,
): Promise<Doctor[]> => {
  const response = await api.get("/doctors", {
    params: {
      branch_id: branchId,
      specialty_id: specialtyId,
    },
  });

  return response.data;
};

// =========================
// DELETE
// =========================

export const deleteDoctor = async (id: number) => {
  const response = await api.delete(`/admin/doctors/${id}`);

  return response.data;
};

// =========================
// EXPORT TO EXCEL
// =========================

export const exportDoctorsToExcel = async (): Promise<Blob> => {
  const response = await api.get("/admin/doctors/export", {
    responseType: "blob",
  });
  return response.data;
};

// =========================
// IMPORT FROM EXCEL
// =========================

export const importDoctorsFromExcel = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/admin/doctors/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
