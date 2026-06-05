"use client";

import { useEffect, useState } from "react";
import {
  getAllUsers,
  getUserById,
  changeUserStatus,
} from "@/services/userService";
import Pagination from "@/components/Pagination";
import {
  Search,
  UserCircle,
  Shield,
  Activity,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Lock,
  Unlock,
  X,
} from "lucide-react";

// Font style đồng bộ với các trang khác
const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800;14..32,900&display=swap');
  .users-page * {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
`;

function DetailBlock({ label, value, icon }: any) {
  return (
    <div className="group p-4 bg-gradient-to-br from-white to-[#F0F9FF] rounded-2xl border border-[#D0F0FD] hover:border-[#2DD4BF] hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[#14B8A6] group-hover:scale-110 transition-transform duration-200">
          {icon}
        </span>
        <p className="text-[11px] font-black text-[#5B8C9E] uppercase tracking-wider">
          {label}
        </p>
      </div>
      <p className="text-sm font-semibold text-[#1F4A5C] break-words">
        {value || "---"}
      </p>
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [searchPhone, setSearchPhone] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedRole, setSelectedRole] = useState("TẤT CẢ");

  useEffect(() => {
    let ignore = false;
    const loadUsers = async () => {
      try {
        const data = await getAllUsers();
        if (!ignore) setUsers(data || []);
      } catch (err) {
        console.log(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    loadUsers();
    return () => {
      ignore = true;
    };
  }, []);

  const handleViewUser = async (id: number) => {
    try {
      const data = await getUserById(id);
      setSelectedUser(data);
      setOpenDetail(true);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.phone?.includes(searchPhone.trim()) ||
      user.firstName?.toLowerCase().includes(searchPhone.toLowerCase());
    const matchesRole =
      selectedRole === "TẤT CẢ" ? true : user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleToggleUserStatus = async () => {
    try {
      const newStatus = !selectedUser.active;
      await changeUserStatus(selectedUser.id, newStatus);
      setSelectedUser({ ...selectedUser, active: newStatus });
      const updatedUsers = await getAllUsers();
      setUsers(updatedUsers);
      alert(`Đã ${newStatus ? "mở khóa" : "khóa"} tài khoản thành công!`);
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi cập nhật trạng thái.");
    }
  };

  if (loading) {
    return (
      <div className="users-page flex items-center justify-center min-h-screen bg-gradient-to-br from-[#E6F7F5] to-[#FFFFFF]">
        <style>{fontStyle}</style>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#2DD4BF] border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="font-bold text-[#2DD4BF] tracking-wide animate-pulse">
            ĐANG TẢI DỮ LIỆU...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="users-page min-h-screen bg-gradient-to-br from-[#E6F7F5] via-[#FFFFFF] to-[#F0FDFA] p-4 md:p-8">
      <style>{fontStyle}</style>
      <div className="max-w-7xl mx-auto">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-1 bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] rounded-full"></div>
              <span className="text-[12px] font-extrabold text-[#14B8A6] tracking-widest">
                ADMIN PORTAL
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1F4A5C] tracking-tight">
              Quản lý{" "}
              <span className="bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] bg-clip-text text-transparent">
                Người dùng
              </span>
            </h1>
            <p className="text-[#5B8C9E] mt-2 font-medium">
              Bệnh viện tươi sáng - Chăm sóc chu đáo
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["TẤT CẢ", "ADMIN", "PATIENT", "DOCTOR"].map((role) => (
              <button
                key={role}
                onClick={() => {
                  setSelectedRole(role);
                  setCurrentPage(1);
                }}
                className={`px-5 py-2.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider transition-all duration-300 ${
                  selectedRole === role
                    ? "bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white shadow-lg shadow-[#2DD4BF]/30 scale-105"
                    : "bg-white/80 backdrop-blur-sm text-[#5B8C9E] hover:bg-[#F0FDFA] hover:text-[#2DD4BF]"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* --- TOOLBAR --- */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative group flex-1">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-[#B8D9E6] group-focus-within:text-[#2DD4BF] transition-colors duration-300"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-[#D0F0FD] shadow-sm focus:ring-2 focus:ring-[#2DD4BF]/40 focus:border-[#2DD4BF] focus:outline-none font-medium text-[#1F4A5C] placeholder:text-[#B8D9E6] transition-all duration-300"
              value={searchPhone}
              onChange={(e) => {
                setSearchPhone(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-[#D0F0FD]">
            <span className="text-[11px] font-extrabold text-[#5B8C9E] uppercase tracking-wider">
              Tổng cộng
            </span>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] bg-clip-text text-transparent">
              {users.length}
            </span>
          </div>
        </div>

        {/* --- TABLE CARD --- */}
        <div className="bg-white rounded-3xl shadow-xl shadow-[#2DD4BF]/10 border border-[#D0F0FD] overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[#F0FDFA] to-white">
                  <th className="p-5 text-[10px] font-extrabold text-[#5B8C9E] uppercase tracking-wider border-b border-[#E6F7F5]">
                    ID
                  </th>
                  <th className="p-5 text-[10px] font-extrabold text-[#5B8C9E] uppercase tracking-wider border-b border-[#E6F7F5]">
                    Người dùng
                  </th>
                  <th className="p-5 text-[10px] font-extrabold text-[#5B8C9E] uppercase tracking-wider border-b border-[#E6F7F5]">
                    Vai trò
                  </th>
                  <th className="p-5 text-[10px] font-extrabold text-[#5B8C9E] uppercase tracking-wider border-b border-[#E6F7F5]">
                    Trạng thái
                  </th>
                  <th className="p-5 text-[10px] font-extrabold text-[#5B8C9E] uppercase tracking-wider border-b border-[#E6F7F5] text-center">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6F7F5]">
                {currentItems.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-[#F0FDFA] transition-all duration-200 group"
                  >
                    <td className="p-5 font-bold text-[#5B8C9E] text-sm">
                      #{user.id}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2DD4BF] to-[#0EA5E9] shadow-md flex items-center justify-center text-white font-bold text-lg">
                          {user.avatar && user.avatar !== "string" ? (
                            <img
                              src={user.avatar}
                              alt="avatar"
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            user.firstName?.charAt(0) || (
                              <UserCircle size={24} />
                            )
                          )}
                        </div>
                        <div>
                          <p className="font-extrabold text-[#1F4A5C] text-sm">
                            {user.lastName} {user.firstName}
                          </p>
                          <p className="text-xs text-[#5B8C9E] mt-0.5 font-medium">
                            {user.email}
                          </p>
                          <p className="text-[10px] font-bold text-[#2DD4BF] mt-0.5 flex items-center gap-1">
                            <Phone size={10} /> {user.phone || "Chưa có SĐT"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm ${
                          user.role === "ADMIN"
                            ? "bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white"
                            : user.role === "DOCTOR"
                              ? "bg-gradient-to-r from-[#2DD4BF] to-[#14B8A6] text-white"
                              : "bg-[#F0FDFA] text-[#5B8C9E]"
                        }`}
                      >
                        <Shield size={10} /> {user.role}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${user.active ? "bg-[#2DD4BF] animate-pulse" : "bg-[#F43F5E]"}`}
                        ></div>
                        <span
                          className={`text-[10px] font-extrabold uppercase tracking-wider ${user.active ? "text-[#14B8A6]" : "text-[#F43F5E]"}`}
                        >
                          {user.active ? "Hoạt động" : "Bị khóa"}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <button
                        onClick={() => handleViewUser(user.id)}
                        className="px-6 py-2.5 bg-gradient-to-r from-[#1F4A5C] to-[#2DD4BF] text-white rounded-full text-[10px] font-extrabold uppercase tracking-wider hover:shadow-lg hover:scale-105 transition-all duration-300"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {/* --- MODAL DETAIL --- */}
      {openDetail && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#1F4A5C]/60 backdrop-blur-sm"
            onClick={() => setOpenDetail(false)}
          />
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-y-auto animate-in fade-in zoom-in duration-300">
            {/* Gradient Header */}
            <div
              className={`h-36 w-full bg-gradient-to-r ${
                selectedUser.role === "ADMIN"
                  ? "from-[#0EA5E9] to-[#0284C7]"
                  : "from-[#2DD4BF] to-[#14B8A6]"
              }`}
            />

            <div className="px-8 pb-8">
              <div className="relative flex justify-between items-end -mt-16 mb-6">
                <div className="p-1.5 bg-white rounded-2xl shadow-xl">
                  <div className="w-28 h-28 rounded-xl overflow-hidden bg-gradient-to-br from-[#2DD4BF] to-[#0EA5E9] flex items-center justify-center text-4xl font-extrabold text-white border-4 border-white shadow-lg">
                    {selectedUser.avatar ? (
                      <img
                        src={selectedUser.avatar}
                        className="w-full h-full object-cover"
                        alt="avatar"
                      />
                    ) : (
                      selectedUser.firstName?.charAt(0) || (
                        <UserCircle size={48} />
                      )
                    )}
                  </div>
                </div>
                <div className="mb-2">
                  <span
                    className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow-md ${
                      selectedUser.active
                        ? "bg-[#2DD4BF] text-white"
                        : "bg-[#F43F5E] text-white"
                    }`}
                  >
                    {selectedUser.active ? (
                      <Activity size={12} />
                    ) : (
                      <Lock size={12} />
                    )}
                    {selectedUser.active ? "Hoạt động" : "Đã khóa"}
                  </span>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-[#1F4A5C]">
                  {selectedUser.fullName ||
                    `${selectedUser.lastName} ${selectedUser.firstName}`}
                </h2>
                <p className="text-[#5B8C9E] font-medium mt-1 flex items-center gap-2">
                  <Shield size={14} /> ID: #{selectedUser.id} •{" "}
                  {selectedUser.role}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[10px] font-extrabold text-[#5B8C9E] uppercase tracking-wider mb-4 flex items-center gap-2">
                      <UserCircle size={14} /> Thông tin cá nhân
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      <DetailBlock
                        label="Giới tính"
                        value={selectedUser.gender === "MALE" ? "Nam" : "Nữ"}
                        icon={<UserCircle size={16} />}
                      />
                      <DetailBlock
                        label="Ngày sinh"
                        value={
                          selectedUser.dateOfBirth
                            ? new Date(
                                selectedUser.dateOfBirth,
                              ).toLocaleDateString("vi-VN")
                            : "---"
                        }
                        icon={<Calendar size={16} />}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-[10px] font-extrabold text-[#5B8C9E] uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Phone size={14} /> Liên hệ
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      <DetailBlock
                        label="Số điện thoại"
                        value={selectedUser.phone}
                        icon={<Phone size={16} />}
                      />
                      <DetailBlock
                        label="Email"
                        value={selectedUser.email || "---"}
                        icon={<Mail size={16} />}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <DetailBlock
                  label="Địa chỉ cư trú"
                  value={selectedUser.address || "Chưa cập nhật"}
                  icon={<MapPin size={16} />}
                />
              </div>

              <div className="mt-6">
                <h3 className="text-[10px] font-extrabold text-[#5B8C9E] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Clock size={14} /> Thông tin hệ thống
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <DetailBlock
                    label="Ngày tạo"
                    value={
                      selectedUser.createdAt
                        ? new Date(selectedUser.createdAt).toLocaleString(
                            "vi-VN",
                          )
                        : "---"
                    }
                    icon={<Calendar size={16} />}
                  />
                  <DetailBlock
                    label="Cập nhật cuối"
                    value={
                      selectedUser.updatedAt
                        ? new Date(selectedUser.updatedAt).toLocaleString(
                            "vi-VN",
                          )
                        : "Chưa cập nhật"
                    }
                    icon={<Clock size={16} />}
                  />
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-[#E6F7F5] flex gap-4">
                <button
                  onClick={() => setOpenDetail(false)}
                  className="flex-1 py-4 bg-[#F0FDFA] hover:bg-[#E6F7F5] text-[#5B8C9E] font-extrabold rounded-2xl text-xs transition-all uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <X size={16} /> Đóng
                </button>
                <button
                  onClick={handleToggleUserStatus}
                  className={`flex-1 py-4 font-extrabold rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    selectedUser.active
                      ? "bg-[#FEF2F2] text-[#F43F5E] hover:bg-[#F43F5E] hover:text-white"
                      : "bg-[#F0FDFA] text-[#2DD4BF] hover:bg-[#2DD4BF] hover:text-white"
                  }`}
                >
                  {selectedUser.active ? (
                    <Lock size={14} />
                  ) : (
                    <Unlock size={14} />
                  )}
                  {selectedUser.active ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
