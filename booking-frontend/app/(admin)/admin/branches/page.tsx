"use client";

import { useEffect, useState } from "react";
import {
  getAllBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} from "@/services/branchService";
import Pagination from "@/components/Pagination";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  Building2,
  Activity,
  Eye,
  CheckCircle,
  XCircle,
  Sparkles,
} from "lucide-react";

// Font style đồng bộ với các trang khác
const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800;14..32,900&display=swap');
  .branch-page * {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
`;

type Branch = {
  id: number;
  name: string;
  active: boolean;
};

export default function BranchPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);

  // Error state
  const [error, setError] = useState("");

  // Fetch branches function
  const fetchBranches = async () => {
    try {
      setLoading(true);
      const data = await getAllBranches();
      setBranches(data || []);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
      alert("Không thể tải danh sách chi nhánh");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchBranches();
    };
    loadData();
  }, []);

  // Reset form function
  const resetForm = () => {
    setName("");
    setActive(true);
    setEditingId(null);
    setError("");
  };

  // Filter data
  const filteredData = branches.filter((branch) =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Open modal for add/edit
  const handleOpenModal = (branch?: Branch) => {
    resetForm();
    if (branch) {
      setEditingId(branch.id);
      setName(branch.name);
      setActive(branch.active);
    }
    setIsModalOpen(true);
  };

  // View detail
  const handleView = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsViewModalOpen(true);
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Vui lòng nhập tên chi nhánh");
      return;
    }

    setError("");

    try {
      setSubmitLoading(true);

      if (editingId) {
        await updateBranch(editingId, { name, active });
        alert("Cập nhật thành công!");
      } else {
        await createBranch({ name });
        alert("Thêm mới thành công!");
      }

      await fetchBranches();
      closeModal();
    } catch (err: any) {
      console.error("Lỗi khi lưu:", err);
      const message = err?.response?.data?.message || err?.message || "";
      alert(message || "Lỗi khi lưu dữ liệu");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa chi nhánh này?")) return;

    try {
      await deleteBranch(id);
      await fetchBranches();
      alert("Xóa thành công!");
    } catch (err: any) {
      console.error("Lỗi khi xóa:", err);
      const message = err?.response?.data?.message || err?.message || "";

      if (
        message.toLowerCase().includes("ràng buộc") ||
        message.toLowerCase().includes("foreign key")
      ) {
        alert("Không thể xóa chi nhánh này vì đang có dữ liệu liên quan!");
      } else {
        alert(message || "Xóa thất bại");
      }
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  if (loading)
    return (
      <div className="branch-page min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E6F7F5] via-[#F0FDFA] to-[#E6F7F5]">
        <style>{fontStyle}</style>
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#2DD4BF] animate-spin mx-auto mb-4" />
          <p className="text-[#14B8A6] font-extrabold tracking-wide">
            ĐANG TẢI DỮ LIỆU...
          </p>
        </div>
      </div>
    );

  return (
    <div className="branch-page min-h-screen bg-gradient-to-br from-[#E6F7F5] via-white to-[#F0FDFA] p-4 md:p-8">
      <style>{fontStyle}</style>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2DD4BF] to-[#0EA5E9] shadow-lg flex items-center justify-center">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1F4A5C]">
                  Quản lý <span className="text-[#2DD4BF]">Chi nhánh</span>
                </h1>
                <p className="text-[#5B8C9E] text-sm mt-0.5 flex items-center gap-2 font-medium">
                  <Activity size={12} className="text-[#2DD4BF]" />
                  Tổng số:{" "}
                  <span className="font-extrabold text-[#2DD4BF]">
                    {filteredData.length}
                  </span>{" "}
                  chi nhánh
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-1 max-w-md w-full gap-3">
            <div className="relative flex-1 group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8D9E6] group-focus-within:text-[#2DD4BF] transition-colors duration-300"
                size={16}
              />
              <input
                type="text"
                placeholder="Tìm kiếm chi nhánh..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#F0FDFA] border border-[#D0F0FD] focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 text-sm outline-none transition-all text-[#1F4A5C] placeholder:text-[#B8D9E6] placeholder:font-semibold font-semibold"
              />
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white px-5 py-2.5 rounded-2xl font-extrabold flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-sm"
            >
              <Plus size={16} />
              Thêm mới
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-[#2DD4BF]/10 border border-white/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#E6F7F5] to-[#F0FDFA] border-b border-[#D0F0FD]">
                  <th className="px-5 py-4 text-left text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                    Icon
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                    Tên chi nhánh
                  </th>
                  <th className="px-5 py-4 text-left text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-5 py-4 text-right text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6F7F5]">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <Building2
                        size={48}
                        className="mx-auto mb-4 text-[#D0F0FD]"
                      />
                      <p className="text-[#5B8C9E] font-medium">
                        Không tìm thấy chi nhánh nào
                      </p>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((branch) => (
                    <tr
                      key={branch.id}
                      className="hover:bg-[#2DD4BF]/5 transition-all duration-200 group"
                    >
                      <td className="px-5 py-3">
                        <span className="font-mono text-xs font-extrabold text-[#2DD4BF]">
                          #{branch.id}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E6F7F5] to-[#F0FDFA] flex items-center justify-center shadow-sm">
                          <Building2 size={20} className="text-[#2DD4BF]" />
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-extrabold text-[#1F4A5C] text-sm">
                          {branch.name}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold ${
                            branch.active
                              ? "bg-[#E6F7F5] text-[#2DD4BF]"
                              : "bg-[#F1F5F9] text-[#94A3B8]"
                          }`}
                        >
                          {branch.active ? (
                            <CheckCircle size={12} />
                          ) : (
                            <XCircle size={12} />
                          )}
                          {branch.active ? "Hoạt động" : "Tạm dừng"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => handleView(branch)}
                            className="p-1.5 text-[#5B8C9E] hover:text-[#2DD4BF] hover:bg-[#E6F7F5] rounded-lg transition-all"
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleOpenModal(branch)}
                            className="p-1.5 text-[#5B8C9E] hover:text-[#0EA5E9] hover:bg-[#E6F7F5] rounded-lg transition-all"
                            title="Sửa"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(branch.id)}
                            className="p-1.5 text-[#5B8C9E] hover:text-[#F43F5E] hover:bg-[#FEF2F2] rounded-lg transition-all"
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        )}

        {/* Add/Edit Modal - CÓ NÚT HỦY */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-[#1F4A5C]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] px-6 py-5 flex justify-between items-center">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Building2 size={18} />
                  {editingId ? "✏️ Cập nhật" : "➕ Thêm mới"} Chi nhánh
                </h2>
                <button
                  onClick={closeModal}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider mb-2 block">
                      Tên chi nhánh <span className="text-[#F43F5E]">*</span>
                    </label>
                    <input
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setError("");
                      }}
                      className={`w-full px-4 py-3 bg-[#F0FDFA] rounded-xl text-sm outline-none transition-all font-semibold
                        ${
                          error
                            ? "border-2 border-[#F43F5E] focus:ring-[#F43F5E]/20"
                            : "border border-[#D0F0FD] focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20"
                        }`}
                      placeholder="VD: 3T Hospital Quận 1"
                    />
                    {error && (
                      <p className="text-[#F43F5E] text-xs mt-1 flex items-center gap-1 font-medium">
                        <XCircle size={12} />
                        {error}
                      </p>
                    )}
                  </div>

                  {editingId && (
                    <div className="flex items-center justify-between p-3 bg-[#F0FDFA] rounded-xl border border-[#D0F0FD]">
                      <label className="text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider flex-1">
                        Trạng thái hoạt động
                      </label>
                      <button
                        type="button"
                        onClick={() => setActive(!active)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          active ? "bg-[#2DD4BF]" : "bg-[#B8D9E6]"
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            active ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  )}

                  {/* 2 nút: Hủy và Lưu */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 py-3.5 rounded-xl bg-[#F0FDFA] border-2 border-[#D0F0FD] text-[#5B8C9E] font-extrabold text-sm uppercase tracking-wider hover:bg-[#E6F7F5] transition-all"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white font-extrabold text-sm uppercase tracking-wider hover:from-[#14B8A6] hover:to-[#0284C7] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : editingId ? (
                        "Cập nhật"
                      ) : (
                        "Thêm mới"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* View Detail Modal */}
        {isViewModalOpen && selectedBranch && (
          <div className="fixed inset-0 bg-[#1F4A5C]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] px-6 py-5 flex justify-between items-center">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Building2 size={18} />
                  Chi tiết chi nhánh
                </h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="p-6">
                <div className="flex flex-col items-center mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E6F7F5] to-[#F0FDFA] flex items-center justify-center shadow-md mb-3">
                    <Building2 size={40} className="text-[#2DD4BF]" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#1F4A5C] text-center">
                    {selectedBranch.name}
                  </h3>
                  <span
                    className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                      selectedBranch.active
                        ? "bg-[#E6F7F5] text-[#2DD4BF]"
                        : "bg-[#F1F5F9] text-[#94A3B8]"
                    }`}
                  >
                    {selectedBranch.active ? (
                      <CheckCircle size={12} />
                    ) : (
                      <XCircle size={12} />
                    )}
                    {selectedBranch.active ? "Đang hoạt động" : "Tạm dừng"}
                  </span>
                </div>

                <div className="space-y-3 text-sm border-t border-[#E6F7F5] pt-4">
                  <div className="flex justify-between items-center py-2 border-b border-[#E6F7F5]">
                    <span className="text-[#5B8C9E] font-semibold">
                      ID chi nhánh:
                    </span>
                    <span className="font-mono font-extrabold text-[#2DD4BF]">
                      #{selectedBranch.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#E6F7F5]">
                    <span className="text-[#5B8C9E] font-semibold">
                      Tên chi nhánh:
                    </span>
                    <span className="font-semibold text-[#1F4A5C]">
                      {selectedBranch.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[#5B8C9E] font-semibold">
                      Trạng thái:
                    </span>
                    <span
                      className={`font-extrabold ${
                        selectedBranch.active
                          ? "text-[#2DD4BF]"
                          : "text-[#94A3B8]"
                      }`}
                    >
                      {selectedBranch.active ? "Hoạt động" : "Tạm dừng"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="border-t border-[#E6F7F5] px-6 py-4 flex justify-end bg-[#F0FDFA]">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white text-sm font-extrabold uppercase tracking-wider hover:shadow-md transition-all"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
