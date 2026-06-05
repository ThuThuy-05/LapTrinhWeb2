"use client";

import { useEffect, useState } from "react";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  Banner,
} from "@/services/bannerService";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  PlusCircle,
  Loader2,
  XCircle,
  CheckCircle2,
  Pencil,
  X,
  Sparkles,
  Activity,
} from "lucide-react";
import Image from "next/image";
import Pagination from "@/components/Pagination";

// Font style đồng bộ
const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800;14..32,900&display=swap');
  .banner-page * {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
`;

export default function BannerPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  // FORM
  const [isAdding, setIsAdding] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editActive, setEditActive] = useState(true);
  const [editLoading, setEditLoading] = useState(false);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(banners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBanners = banners.slice(startIndex, startIndex + itemsPerPage);

  const fetchBannersData = async () => {
    try {
      setFetching(true);
      const data = await getBanners();
      setBanners(data || []);
    } catch (error) {
      console.error("Load banner error:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchBannersData();
    };
    loadData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Vui lòng chọn ảnh");
      return;
    }
    if (!title.trim()) {
      alert("Vui lòng nhập tiêu đề");
      return;
    }

    try {
      setLoading(true);
      await createBanner(file, title, description);
      setFile(null);
      setPreview(null);
      setTitle("");
      setDescription("");
      setIsAdding(false);
      await fetchBannersData();
      alert("Thêm banner thành công!");
    } catch (error) {
      console.error("Upload banner error:", error);
      alert("Upload banner thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setEditTitle(banner.title);
    setEditDescription(banner.description || "");
    setEditPreview(banner.imageUrl);
    setEditActive(banner.active);
  };

  const handleEditFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEditFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    if (!editingBanner) return;
    try {
      setEditLoading(true);
      await updateBanner(editingBanner.id, {
        file: editFile || undefined,
        title: editTitle,
        description: editDescription,
        active: editActive,
      });
      setEditingBanner(null);
      setEditFile(null);
      setEditPreview(null);
      await fetchBannersData();
      alert("Cập nhật banner thành công!");
    } catch (err) {
      console.error(err);
      alert("Update thất bại!");
    } finally {
      setEditLoading(false);
    }
  };

  const closeModal = () => {
    setIsAdding(false);
    setEditingBanner(null);
    setFile(null);
    setPreview(null);
    setTitle("");
    setDescription("");
    setEditFile(null);
    setEditPreview(null);
    setEditLoading(false);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xoá banner?");
    if (!confirmDelete) return;
    try {
      await deleteBanner(id);
      setBanners((prev) => prev.filter((b) => b.id !== id));
      alert("Xoá banner thành công!");
    } catch (error) {
      console.error("Delete banner error:", error);
      alert("Xoá banner thất bại!");
    }
  };

  return (
    <div className="banner-page min-h-screen bg-gradient-to-br from-[#E6F7F5] via-white to-[#F0FDFA] p-4 md:p-8">
      <style>{fontStyle}</style>
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2DD4BF] to-[#0EA5E9] shadow-lg flex items-center justify-center">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1F4A5C]">
                  Quản lý <span className="text-[#2DD4BF]">Banner</span>
                </h1>
                <p className="text-[#5B8C9E] text-sm mt-0.5 flex items-center gap-2 font-medium">
                  <Activity size={12} className="text-[#2DD4BF]" />
                  Tổng số:{" "}
                  <span className="font-extrabold text-[#2DD4BF]">
                    {banners.length}
                  </span>{" "}
                  banner
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsAdding(true)}
            className="bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white px-6 py-3 rounded-2xl font-extrabold flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-sm"
          >
            <PlusCircle size={18} />
            Thêm Banner Mới
          </button>
        </div>

        {fetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 space-y-4 animate-pulse shadow-lg shadow-[#2DD4BF]/10 border border-white/50"
              >
                <div className="aspect-video bg-[#E6F7F5] rounded-2xl" />
                <div className="h-6 bg-[#E6F7F5] rounded-lg w-2/3" />
                <div className="h-4 bg-[#F0FDFA] rounded-lg w-full" />
              </div>
            ))}
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-[#D0F0FD] shadow-lg shadow-[#2DD4BF]/10">
            <ImageIcon className="mx-auto text-[#D0F0FD] w-20 h-20 mb-4" />
            <h3 className="text-xl font-extrabold text-[#5B8C9E]">
              Chưa có banner nào được tạo
            </h3>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentBanners.map((banner) => (
                <div
                  key={banner.id}
                  className="group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/50 shadow-lg shadow-[#2DD4BF]/10 hover:shadow-xl transition-all duration-500"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={banner.imageUrl || "/images/no-image.png"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt=""
                    />
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEdit(banner)}
                        className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white flex items-center justify-center hover:shadow-lg transition-all"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="w-10 h-10 rounded-xl bg-[#F43F5E] text-white flex items-center justify-center hover:bg-red-600 transition-all shadow-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          banner.active
                            ? "bg-[#E6F7F5] text-[#2DD4BF]"
                            : "bg-[#F1F5F9] text-[#94A3B8]"
                        }`}
                      >
                        {banner.active ? "Đang hiển thị" : "Tạm ẩn"}
                      </span>
                      <span className="text-[10px] font-extrabold text-[#B8D9E6]">
                        ID #{banner.id}
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-[#1F4A5C] line-clamp-1">
                      {banner.title}
                    </h3>
                    <p className="text-sm text-[#5B8C9E] mt-2 line-clamp-2 italic font-medium">
                      {banner.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
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
          </>
        )}

        {/* MODAL THÊM / SỬA */}
        {(isAdding || editingBanner) && (
          <div className="fixed inset-0 bg-[#1F4A5C]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
              {/* Modal Header */}
              <div className="relative px-8 py-6 text-center border-b border-[#E6F7F5] bg-gradient-to-r from-[#2DD4BF]/5 to-[#0EA5E9]/5">
                <button
                  onClick={closeModal}
                  className="absolute right-6 top-6 text-[#5B8C9E] hover:text-[#F43F5E] transition-colors"
                >
                  <X size={24} />
                </button>
                <h2 className="text-2xl font-extrabold uppercase tracking-tight text-[#1F4A5C]">
                  {isAdding ? "Tạo mới" : "Cập nhật"}{" "}
                  <span className="text-[#2DD4BF]">Banner</span>
                </h2>
                <p className="text-[#5B8C9E] text-[10px] font-extrabold uppercase tracking-[0.2em] mt-2">
                  Cung cấp hình ảnh và thông tin chi tiết
                </p>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Image Upload Area */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#1F4A5C] ml-2">
                    Hình ảnh banner
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-2xl overflow-hidden transition-all ${
                      preview || editPreview
                        ? "border-[#2DD4BF]"
                        : "border-[#D0F0FD] bg-[#F0FDFA] hover:border-[#2DD4BF]"
                    }`}
                  >
                    {preview || editPreview ? (
                      <div className="relative aspect-[21/9]">
                        <img
                          src={preview || editPreview || ""}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => {
                            setPreview(null);
                            setEditPreview(null);
                          }}
                          className="absolute inset-0 bg-[#1F4A5C]/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="text-white" size={32} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center py-12 cursor-pointer">
                        <div className="w-16 h-16 bg-[#E6F7F5] text-[#2DD4BF] rounded-2xl flex items-center justify-center mb-4">
                          <ImageIcon size={32} />
                        </div>
                        <span className="text-xs font-extrabold uppercase tracking-wider text-[#5B8C9E]">
                          Nhấp để tải ảnh lên
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={
                            isAdding ? handleFileChange : handleEditFile
                          }
                          accept="image/*"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Input Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#1F4A5C] ml-2">
                      Tiêu đề Banner
                    </label>
                    <input
                      type="text"
                      className="w-full mt-2 px-5 py-3.5 rounded-xl bg-[#F0FDFA] border border-[#D0F0FD] focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 outline-none font-semibold text-[#1F4A5C] transition-all"
                      placeholder="VD: Khuyến mãi hè rực rỡ..."
                      value={isAdding ? title : editTitle}
                      onChange={(e) =>
                        isAdding
                          ? setTitle(e.target.value)
                          : setEditTitle(e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#1F4A5C] ml-2">
                      Mô tả chi tiết
                    </label>
                    <textarea
                      rows={3}
                      className="w-full mt-2 px-5 py-3.5 rounded-xl bg-[#F0FDFA] border border-[#D0F0FD] focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 outline-none font-medium text-[#1F4A5C] transition-all resize-none"
                      placeholder="Nhập nội dung mô tả ngắn cho banner..."
                      value={isAdding ? description : editDescription}
                      onChange={(e) =>
                        isAdding
                          ? setDescription(e.target.value)
                          : setEditDescription(e.target.value)
                      }
                    />
                  </div>

                  {/* Nút bật/tắt trạng thái hiển thị (Chỉ hiện khi Sửa) */}
                  {!isAdding && (
                    <div className="flex items-center justify-between p-4 bg-[#F0FDFA] rounded-xl border border-[#D0F0FD]">
                      <div>
                        <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#1F4A5C]">
                          Trạng thái hiển thị
                        </p>
                        <p className="text-[10px] text-[#5B8C9E] font-medium mt-1">
                          Cho phép banner xuất hiện trên trang chủ
                        </p>
                      </div>
                      <button
                        onClick={() => setEditActive(!editActive)}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
                          editActive ? "bg-[#2DD4BF]" : "bg-[#B8D9E6]"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            editActive ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 bg-[#F0FDFA] flex gap-4 border-t border-[#E6F7F5]">
                <button
                  onClick={isAdding ? handleUpload : handleUpdate}
                  disabled={isAdding ? loading : editLoading}
                  className="flex-1 bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] hover:from-[#14B8A6] hover:to-[#0284C7] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-3 shadow-md"
                >
                  {(isAdding ? loading : editLoading) ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={20} />
                  )}
                  {isAdding ? "Lưu Banner" : "Cập nhật ngay"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
