// services/authService.ts
import api from "@/lib/api";

// REGISTER
export const register = async (data: any) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

// LOGIN
export const login = async (data: any) => {
  const res = await api.post("/auth/login", data);

  const token = res.data.token;
  const role = res.data.role;

  if (token) {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
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
