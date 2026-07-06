"use client";

import { useState } from "react";
import { login } from "@/services/authService";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Phone, Lock, LogIn, AlertCircle } from "lucide-react";

type FormData = {
  phone: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage(""); // Clear message when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setMessage("");

    try {
      const res = await login(form);

      const data = res?.data?.data || res?.data || res;

      // 🔥 normalize role TRƯỚC
      const role = data.role?.trim()?.toUpperCase();

      // 🔥 lưu localStorage (CHỈ 1 LẦN)
      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          doctorId: data.doctorId,
          role: role,
          fullName: data.fullName,
          phone: data.phone,
        }),
      );

      setIsSuccess(true);
      setMessage("Đăng nhập thành công!");

      // 🔥 redirect theo role
      setTimeout(() => {
        switch (role) {
          case "ADMIN":
            router.push("/admin");
            break;

          case "DOCTOR":
            router.push("/doctor");
            break;

          default:
            router.push("/");
        }
      }, 100);
    } catch (err: any) {
      setIsSuccess(false);
      setMessage(err.response?.data || "Sai tài khoản hoặc mật khẩu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Gradient Header Bar */}
          <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

          <div className="p-8">
            {/* Logo / Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
                <LogIn className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Đăng nhập
              </h1>
              <p className="text-gray-500 mt-2">
                Đăng nhập để tiếp tục sử dụng hệ thống
              </p>
            </div>

            {/* Message Display */}
            {message && (
              <div
                className={`mb-6 p-3 rounded-xl flex items-center gap-2 ${
                  isSuccess
                    ? "bg-green-50 border border-green-200 text-green-600"
                    : "bg-red-50 border border-red-200 text-red-600"
                }`}
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Phone Field */}
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Phone className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  name="phone"
                  type="tel"
                  placeholder="Số điện thoại"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
                  required
                  autoComplete="username"
                />
              </div>

              {/* Password Field */}
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-9 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <a
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Quên mật khẩu?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group"
              >
                <span className="relative z-10">
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang đăng nhập...
                    </div>
                  ) : (
                    "Đăng nhập"
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white/80 text-gray-500"></span>
              </div>
            </div>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-600">
              {" "}
              Chưa có tài khoản?{" "}
              <a
                href="/register"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Tạo Tài Khoản
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
