// services/authService.ts
import api from "@/lib/api";

// REGISTER
export const register = async (data: any) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

// LOGIN
// export const login = async (data: any) => {
//   const res = await api.post("/auth/login", data);

//   const token = res.data.token;
//   const role = res.data.role;

//   if (token) {
//     localStorage.setItem("token", token);
//     localStorage.setItem("role", role);
//   }

//   return res.data;
// };

// LOGIN
export const login = async (data: any) => {
  const res = await api.post("/auth/login", data);

  const { token, role, id, doctorId, fullName, phone } = res.data;

  if (token) {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    // ✅ Lưu ID thật của user
    localStorage.setItem("userId", id.toString());

    // (Không bắt buộc nhưng nên lưu)
    localStorage.setItem("fullName", fullName);

    if (doctorId) {
      localStorage.setItem("doctorId", doctorId.toString());
    }

    if (phone) {
      localStorage.setItem("phone", phone);
    }
  }

  return res.data;
};

export const getProfile = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

export const updateProfile = async (formData: FormData) => {
  const res = await api.put("/patient", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const changePassword = async (data: any) => {
  const res = await api.put("/change-password", data);
  return res.data;
};
