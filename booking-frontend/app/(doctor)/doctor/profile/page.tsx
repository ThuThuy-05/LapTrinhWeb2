"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getDoctorById,
  updateMyDoctorProfile,
  getAllDoctors,
} from "@/services/doctorService";
import { getProfile, changePassword } from "@/services/authService";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  Briefcase,
  FileText,
  Save,
  Camera,
  Loader2,
  Venus,
  Mars,
  Stethoscope,
  Building2,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  Shield,
} from "lucide-react";

export default function DoctorProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [doctor, setDoctor] = useState<any>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  // State cho đổi mật khẩu
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "MALE",
    dateOfBirth: "",
    address: "",
    degree: "",
    experience: 0,
    description: "",
  });

  // Fetch doctor data
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const user = await getProfile();
        const doctors = await getAllDoctors();
        const currentDoctor = doctors.find((d: any) => d.user?.id === user.id);

        if (!currentDoctor) {
          alert("Không tìm thấy hồ sơ bác sĩ");
          return;
        }

        const data = await getDoctorById(currentDoctor.id);
        setDoctor(data);
        setForm({
          firstName: data.user?.firstName || "",
          lastName: data.user?.lastName || "",
          email: data.user?.email || "",
          phone: data.user?.phone || "",
          gender: data.user?.gender || "MALE",
          dateOfBirth: data.user?.dateOfBirth?.split("T")[0] || "",
          address: data.user?.address || "",
          degree: data.degree || "",
          experience: data.experience || 0,
          description: data.description || "",
        });
      } catch (error) {
        console.error("Lỗi:", error);
        alert("Không thể tải hồ sơ");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, []);

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      await updateMyDoctorProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        address: form.address,
        degree: form.degree,
        experience: form.experience,
        description: form.description,
        file: avatarFile,
      });

      alert("Cập nhật thành công");
      window.location.reload();
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  // Xử lý đổi mật khẩu
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    // Validate
    if (!passwordData.oldPassword) {
      setPasswordError("Vui lòng nhập mật khẩu cũ");
      return;
    }
    if (!passwordData.newPassword) {
      setPasswordError("Vui lòng nhập mật khẩu mới");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setChangingPassword(true);
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordSuccess("Đổi mật khẩu thành công!");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Tự động đóng form sau 2 giây
      setTimeout(() => {
        setShowChangePassword(false);
        setPasswordSuccess("");
      }, 2000);
    } catch (error: any) {
      console.error(error);
      setPasswordError(
        error?.response?.data?.message || "Đổi mật khẩu thất bại",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Hồ sơ bác sĩ
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý thông tin cá nhân và chuyên môn của bạn
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar - Avatar & Thông tin cố định */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-8">
              {/* Avatar Section */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full bg-white p-1 mx-auto">
                    <img
                      src={
                        avatarPreview ||
                        doctor?.user?.avatar ||
                        `https://ui-avatars.com/api/?name=${form.firstName}+${form.lastName}&background=3B82F6&color=fff&size=128`
                      }
                      alt="avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <label className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-100 transition">
                    <Camera className="w-4 h-4 text-gray-600" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                <h3 className="text-white font-semibold text-xl mt-4">
                  {form.firstName} {form.lastName}
                </h3>
                <p className="text-blue-100 text-sm">
                  {form.degree || "Bác sĩ"}
                </p>
              </div>

              {/* Fixed Info - Chuyên khoa & Chi nhánh */}
              <div className="p-6 space-y-4 border-b border-gray-100">
                <div className="flex items-center gap-3 text-gray-700">
                  <Stethoscope className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">Chuyên khoa</p>
                    <p className="font-medium">
                      {doctor?.specialty?.name || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Building2 className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-xs text-gray-500">Chi nhánh</p>
                    <p className="font-medium">
                      {doctor?.branch?.name || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bảo mật - Đổi mật khẩu */}
              <div className="p-6">
                <button
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition">
                      <Shield className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-700">
                        Bảo mật
                      </p>
                      <p className="text-xs text-gray-400">Đổi mật khẩu</p>
                    </div>
                  </div>
                  <KeyRound className="w-4 h-4 text-gray-400" />
                </button>

                {/* Form đổi mật khẩu */}
                {showChangePassword && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <form onSubmit={handlePasswordChange} className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Mật khẩu cũ
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.old ? "text" : "password"}
                            value={passwordData.oldPassword}
                            onChange={(e) =>
                              setPasswordData((prev) => ({
                                ...prev,
                                oldPassword: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                            placeholder="Nhập mật khẩu cũ"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                old: !prev.old,
                              }))
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                          >
                            {showPassword.old ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Mật khẩu mới
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.new ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData((prev) => ({
                                ...prev,
                                newPassword: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                            placeholder="Nhập mật khẩu mới"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                new: !prev.new,
                              }))
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                          >
                            {showPassword.new ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Xác nhận mật khẩu mới
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.confirm ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData((prev) => ({
                                ...prev,
                                confirmPassword: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                            placeholder="Xác nhận mật khẩu mới"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                confirm: !prev.confirm,
                              }))
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                          >
                            {showPassword.confirm ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Thông báo */}
                      {passwordError && (
                        <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-600 text-xs">
                            {passwordError}
                          </p>
                        </div>
                      )}
                      {passwordSuccess && (
                        <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-600 text-xs">
                            {passwordSuccess}
                          </p>
                        </div>
                      )}

                      {/* Lưu ý */}
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Mật khẩu mới phải có ít nhất 6 ký tự
                      </div>

                      <button
                        type="submit"
                        disabled={changingPassword}
                        className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {changingPassword ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            Đổi mật khẩu
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Form - Giữ nguyên phần còn lại */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Thông tin cá nhân
                </h2>
              </div>

              <div className="p-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" /> Họ
                      </label>
                      <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={form.firstName}
                        onChange={(e) =>
                          handleChange("firstName", e.target.value)
                        }
                        placeholder="Nhập họ"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" /> Tên
                      </label>
                      <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={form.lastName}
                        onChange={(e) =>
                          handleChange("lastName", e.target.value)
                        }
                        placeholder="Nhập tên"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" /> Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="example@email.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" /> Số điện thoại
                      </label>
                      <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="0123456789"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="inline-flex gap-1 mr-1">
                          <Mars className="w-4 h-4" />
                          <Venus className="w-4 h-4" />
                        </span>
                        Giới tính
                      </label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={form.gender}
                        onChange={(e) => handleChange("gender", e.target.value)}
                      >
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                      </select>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" /> Ngày sinh
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={form.dateOfBirth}
                        onChange={(e) =>
                          handleChange("dateOfBirth", e.target.value)
                        }
                      />
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" /> Địa chỉ
                      </label>
                      <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={form.address}
                        onChange={(e) =>
                          handleChange("address", e.target.value)
                        }
                        placeholder="Số nhà, đường, thành phố"
                      />
                    </div>

                    {/* Degree */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <GraduationCap className="w-4 h-4 inline mr-1" /> Học vị
                      </label>
                      <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={form.degree}
                        onChange={(e) => handleChange("degree", e.target.value)}
                        placeholder="Tiến sĩ, Thạc sĩ, Bác sĩ chuyên khoa..."
                      />
                    </div>

                    {/* Experience */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Briefcase className="w-4 h-4 inline mr-1" /> Kinh
                        nghiệm (năm)
                      </label>
                      <input
                        type="number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        value={form.experience}
                        onChange={(e) =>
                          handleChange("experience", Number(e.target.value))
                        }
                        min="0"
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FileText className="w-4 h-4 inline mr-1" /> Giới thiệu
                      </label>
                      <textarea
                        rows={5}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                        value={form.description}
                        onChange={(e) =>
                          handleChange("description", e.target.value)
                        }
                        placeholder="Giới thiệu về bản thân, chuyên môn, kinh nghiệm làm việc..."
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                      onClick={() => window.location.reload()}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Đang cập nhật...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Cập nhật hồ sơ
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
