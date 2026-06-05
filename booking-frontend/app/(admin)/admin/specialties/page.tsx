"use client";

import { useEffect, useState } from "react";
import {
  getAllSpecialties,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
} from "@/services/specialtyService";
import Pagination from "@/components/Pagination";
import {
  Trash2,
  Edit3,
  Plus,
  Search,
  X,
  Loader2,
  DollarSign,
  Stethoscope,
  Activity,
  Eye,
  Heart,
  Clock,
  Shield,
  Sparkles,
} from "lucide-react";

// Font style đồng bộ với các trang khác
const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800;14..32,900&display=swap');
  .specialties-page * {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
`;

export default function SpecialtiesPage() {
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editActive, setEditActive] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [currentId, setCurrentId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    file: "",
    price: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAllSpecialties();
        setSpecialties(data || []);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const resetForm = () => {
    setCurrentId(null);
    setName("");
    setDescription("");
    setPrice(0);
    setFile(null);
    setPreview(null);
    setEditActive(true);
    setErrors({
      name: "",
      description: "",
      file: "",
      price: "",
    });
  };

  const handleAddNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    resetForm();
    setCurrentId(item.id);
    setName(item.name);
    setDescription(item.description || "");
    setPrice(item.price || 0);
    setPreview(item.image || null);
    setEditActive(!!item.active);
    setIsModalOpen(true);
  };

  const handleView = (item: any) => {
    setSelectedSpecialty(item);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setErrors((prev) => ({ ...prev, file: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({
      name: "",
      description: "",
      file: "",
      price: "",
    });

    let hasError = false;

    if (!name.trim()) {
      setErrors((prev) => ({ ...prev, name: "Vui lòng nhập tên chuyên khoa" }));
      hasError = true;
    }

    if (!description.trim()) {
      setErrors((prev) => ({
        ...prev,
        description: "Vui lòng nhập mô tả chuyên khoa",
      }));
      hasError = true;
    }

    if (!price || Number(price) <= 0) {
      setErrors((prev) => ({
        ...prev,
        price: "Vui lòng nhập giá khám hợp lệ",
      }));
      hasError = true;
    }

    if (!currentId && !file) {
      setErrors((prev) => ({ ...prev, file: "Vui lòng chọn ảnh chuyên khoa" }));
      hasError = true;
    }

    if (hasError) return;

    try {
      setSubmitLoading(true);

      if (currentId) {
        await updateSpecialty(currentId, {
          name,
          description,
          active: editActive,
          price,
          file: file || undefined,
        });
      } else {
        await createSpecialty({
          name,
          description,
          active: editActive,
          price,
          file: file!,
        });
      }

      const data = await getAllSpecialties();
      setSpecialties(data || []);
      closeModal();
      alert("Lưu thành công!");
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "";

      if (
        message.toLowerCase().includes("tồn tại") ||
        message.toLowerCase().includes("chuyên khoa")
      ) {
        setErrors((prev) => ({ ...prev, name: "Tên chuyên khoa đã tồn tại" }));
      } else {
        alert("Lỗi khi lưu dữ liệu");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa chuyên khoa này?")) {
      try {
        await deleteSpecialty(id);
        const data = await getAllSpecialties();
        setSpecialties(data || []);
        alert("Xóa thành công!");
      } catch (error) {
        alert("Lỗi khi xóa chuyên khoa");
      }
    }
  };

  const filteredData = specialties.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (loading)
    return (
      <div className="specialties-page w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E6F7F5] via-[#F0FDFA] to-[#E6F7F5]">
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
    <div className="specialties-page w-full min-h-screen bg-gradient-to-br from-[#E6F7F5] via-[#F0FDFA] to-[#E6F7F5]">
      <style>{fontStyle}</style>
      <div className="w-full px-6 md:px-8 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2DD4BF] to-[#0EA5E9] shadow-lg flex items-center justify-center">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-[#1F4A5C] tracking-tight">
                  Quản lý <span className="text-[#2DD4BF]">Chuyên khoa</span>
                </h1>
                <p className="text-[#5B8C9E] text-sm mt-0.5 flex items-center gap-2 font-medium">
                  <Heart size={12} className="text-[#2DD4BF]" />
                  Tổng số:{" "}
                  <span className="font-extrabold text-[#2DD4BF]">
                    {filteredData.length}
                  </span>{" "}
                  chuyên khoa
                </p>
              </div>
            </div>
          </div>

          {/* Thanh tìm kiếm + nút thêm mới - FIXED SEARCH ICON */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
            <div className="relative flex-1 group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8D9E6] group-focus-within:text-[#2DD4BF] transition-colors duration-300"
                size={16}
              />
              <input
                type="text"
                placeholder="Tìm kiếm tên chuyên khoa..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#F0FDFA] border border-[#D0F0FD] focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 text-sm outline-none transition-all text-[#1F4A5C] placeholder:text-[#B8D9E6] placeholder:font-semibold font-semibold"
              />
            </div>

            <button
              onClick={handleAddNew}
              className="bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white px-6 py-3 rounded-2xl font-extrabold flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-sm"
            >
              <Plus size={18} />
              Thêm mới chuyên khoa
            </button>
          </div>

          {/* Table Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-[#2DD4BF]/10 border border-white/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#2DD4BF]/10 to-[#0EA5E9]/10 border-b border-[#D0F0FD]">
                    <th className="px-6 py-5 text-left text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-5 text-left text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                      Hình ảnh
                    </th>
                    <th className="px-6 py-5 text-left text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                      Tên chuyên khoa
                    </th>
                    <th className="px-6 py-5 text-left text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                      Mô tả
                    </th>
                    <th className="px-6 py-5 text-left text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                      Giá khám
                    </th>
                    <th className="px-6 py-5 text-left text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-5 text-right text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6F7F5]">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-20 text-center">
                        <Stethoscope
                          size={56}
                          className="mx-auto mb-4 text-[#D0F0FD]"
                        />
                        <p className="text-[#5B8C9E] font-medium">
                          Không tìm thấy chuyên khoa nào
                        </p>
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-[#2DD4BF]/5 transition-all duration-200 group"
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs font-extrabold text-[#2DD4BF]">
                            #{item.id}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#E6F7F5] to-[#F0FDFA] overflow-hidden shadow-sm ring-1 ring-white">
                            <img
                              src={
                                item.image ||
                                "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop"
                              }
                              className="w-full h-full object-cover"
                              alt={item.name}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-extrabold text-[#1F4A5C] text-sm flex items-center gap-2">
                            <Shield size={12} className="text-[#2DD4BF]" />
                            {item.name}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-[#5B8C9E] line-clamp-2 max-w-xs font-medium">
                            {item.description || "Chưa có mô tả"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-extrabold text-[#2DD4BF] flex items-center gap-1">
                            <DollarSign size={14} />
                            {formatPrice(item.price || 0)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold ${
                              item.active
                                ? "bg-[#E6F7F5] text-[#2DD4BF]"
                                : "bg-[#F1F5F9] text-[#94A3B8]"
                            }`}
                          >
                            <Activity size={10} />
                            {item.active ? "Hoạt động" : "Tạm dừng"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleView(item)}
                              className="p-2 text-[#5B8C9E] hover:text-[#2DD4BF] hover:bg-[#E6F7F5] rounded-xl transition-all"
                              title="Xem chi tiết"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 text-[#5B8C9E] hover:text-[#0EA5E9] hover:bg-[#E6F7F5] rounded-xl transition-all"
                              title="Sửa"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 text-[#5B8C9E] hover:text-[#F43F5E] hover:bg-[#FEF2F2] rounded-xl transition-all"
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
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1F4A5C]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] px-6 py-5 flex justify-between items-center">
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Stethoscope size={20} />
                {currentId ? "✏️ Cập nhật" : "➕ Thêm mới"} Chuyên khoa
              </h2>
              <button
                onClick={closeModal}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider mb-2 block">
                    Hình ảnh{" "}
                    {!currentId && <span className="text-[#F43F5E]">*</span>}
                  </label>
                  <div className="flex gap-4 items-start">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#E6F7F5] to-[#F0FDFA] overflow-hidden shadow-sm flex-shrink-0">
                      {preview ? (
                        <img
                          src={preview}
                          className="w-full h-full object-cover"
                          alt="Preview"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Stethoscope size={32} className="text-[#B8D9E6]" />
                        </div>
                      )}
                    </div>
                    <label className="flex-1 cursor-pointer">
                      <div className="px-4 py-3 bg-[#F0FDFA] rounded-xl border border-[#D0F0FD] text-center text-sm font-extrabold text-[#2DD4BF] hover:bg-[#E6F7F5] transition-all">
                        Chọn ảnh
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      {errors.file && (
                        <p className="text-[#F43F5E] text-xs mt-1 font-medium">
                          {errors.file}
                        </p>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider mb-2 block">
                    Tên chuyên khoa <span className="text-[#F43F5E]">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    className={`w-full px-4 py-3 bg-[#F0FDFA] rounded-xl text-sm outline-none transition-all font-semibold
                      ${errors.name ? "border-2 border-[#F43F5E] focus:ring-[#F43F5E]/20" : "border border-[#D0F0FD] focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20"}`}
                    placeholder="VD: Khoa Tim mạch"
                  />
                  {errors.name && (
                    <p className="text-[#F43F5E] text-xs mt-1 font-medium">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider mb-2 block">
                    Giá khám (VNĐ) <span className="text-[#F43F5E]">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2DD4BF]"
                      size={16}
                    />
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => {
                        setPrice(Number(e.target.value));
                        setErrors((prev) => ({ ...prev, price: "" }));
                      }}
                      className="w-full pl-10 pr-4 py-3 bg-[#F0FDFA] rounded-xl border border-[#D0F0FD] focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 text-sm outline-none transition-all font-semibold"
                      placeholder="0"
                    />
                    {errors.price && (
                      <p className="text-[#F43F5E] text-xs mt-1 font-medium">
                        {errors.price}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider mb-2 block">
                    Mô tả <span className="text-[#F43F5E]">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setErrors((prev) => ({ ...prev, description: "" }));
                    }}
                    className={`w-full px-4 py-3 bg-[#F0FDFA] rounded-xl text-sm outline-none transition-all resize-none font-medium
                      ${errors.description ? "border-2 border-[#F43F5E] focus:ring-[#F43F5E]/20" : "border border-[#D0F0FD] focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20"}`}
                    placeholder="Giới thiệu về chuyên khoa..."
                  />
                  {errors.description && (
                    <p className="text-[#F43F5E] text-xs mt-1 font-medium">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-[#F0FDFA] rounded-xl border border-[#D0F0FD]">
                  <label className="text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                    Trạng thái hoạt động
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditActive(!editActive)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${editActive ? "bg-[#2DD4BF]" : "bg-[#B8D9E6]"}`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${editActive ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white font-extrabold text-sm uppercase tracking-wider hover:from-[#14B8A6] hover:to-[#0284C7] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : currentId ? (
                    "Cập nhật"
                  ) : (
                    "Thêm mới"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {isViewModalOpen && selectedSpecialty && (
        <div className="fixed inset-0 bg-[#1F4A5C]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] px-6 py-5 flex justify-between items-center">
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Stethoscope size={20} />
                Chi tiết chuyên khoa
              </h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X size={22} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center mb-5">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#E6F7F5] to-[#F0FDFA] overflow-hidden shadow-md mb-4">
                  <img
                    src={
                      selectedSpecialty.image ||
                      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop"
                    }
                    className="w-full h-full object-cover"
                    alt={selectedSpecialty.name}
                  />
                </div>
                <h3 className="text-xl font-extrabold text-[#1F4A5C] text-center">
                  {selectedSpecialty.name}
                </h3>
                <span
                  className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold ${selectedSpecialty.active ? "bg-[#E6F7F5] text-[#2DD4BF]" : "bg-[#F1F5F9] text-[#94A3B8]"}`}
                >
                  <Activity size={10} />
                  {selectedSpecialty.active ? "Hoạt động" : "Tạm dừng"}
                </span>
              </div>

              <div className="space-y-3 text-sm border-t border-[#E6F7F5] pt-4">
                <div className="flex justify-between items-center py-2 border-b border-[#E6F7F5]">
                  <span className="text-[#5B8C9E] font-semibold">ID:</span>
                  <span className="font-mono font-extrabold text-[#2DD4BF]">
                    #{selectedSpecialty.id}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#E6F7F5]">
                  <span className="text-[#5B8C9E] font-semibold flex items-center gap-1">
                    <DollarSign size={14} /> Giá khám:
                  </span>
                  <span className="font-extrabold text-[#2DD4BF]">
                    {formatPrice(selectedSpecialty.price || 0)}
                  </span>
                </div>
                <div className="py-2">
                  <span className="text-[#5B8C9E] font-semibold block mb-2 flex items-center gap-1">
                    <Heart size={14} /> Mô tả:
                  </span>
                  <p className="text-[#1F4A5C] bg-[#F0FDFA] p-3 rounded-xl leading-relaxed font-medium">
                    {selectedSpecialty.description || "Chưa có mô tả"}
                  </p>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-[#E6F7F5] pt-3">
                  <span className="text-[#5B8C9E] text-xs flex items-center gap-1 font-medium">
                    <Clock size={12} /> Ngày tạo:
                  </span>
                  <span className="text-[#1F4A5C] text-xs font-semibold">
                    {new Date(selectedSpecialty.createdAt).toLocaleDateString(
                      "vi-VN",
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t border-[#E6F7F5] px-6 py-4 flex justify-end bg-[#F0FDFA]">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white text-sm font-extrabold uppercase tracking-wider hover:shadow-md transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
