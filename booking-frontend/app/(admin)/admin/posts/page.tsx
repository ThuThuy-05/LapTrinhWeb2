"use client";

import { useEffect, useState } from "react";
import {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  Post,
} from "@/services/postService";
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
  FileText,
  Calendar,
  Tag,
  AlignLeft,
  Image as ImageIcon,
} from "lucide-react";

// Font style đồng bộ với các trang khác
const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800;14..32,900&display=swap');
  .posts-page * {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
`;

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [currentId, setCurrentId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    title: "",
    content: "",
    thumbnail: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAllPosts();
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const resetForm = () => {
    setCurrentId(null);
    setTitle("");
    setSlug("");
    setContent("");
    setFile(null);
    setPreview(null);
    setErrors({
      title: "",
      content: "",
      thumbnail: "",
    });
  };

  const handleAddNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (item: Post) => {
    resetForm();
    setCurrentId(item.id);
    setTitle(item.title);
    setSlug(item.slug);
    setContent(item.content);
    setPreview(item.thumbnail);
    setIsModalOpen(true);
  };

  const handleView = (item: Post) => {
    setSelectedPost(item);
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
      setErrors((prev) => ({ ...prev, thumbnail: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({
      title: "",
      content: "",
      thumbnail: "",
    });

    let hasError = false;

    if (!title.trim()) {
      setErrors((prev) => ({
        ...prev,
        title: "Vui lòng nhập tiêu đề bài viết",
      }));
      hasError = true;
    }

    if (!content.trim()) {
      setErrors((prev) => ({
        ...prev,
        content: "Vui lòng nhập nội dung bài viết",
      }));
      hasError = true;
    }

    if (!currentId && !file) {
      setErrors((prev) => ({
        ...prev,
        thumbnail: "Vui lòng chọn ảnh đại diện",
      }));
      hasError = true;
    }

    if (hasError) return;

    try {
      setSubmitLoading(true);

      const finalSlug = slug || generateSlug(title);

      if (currentId) {
        await updatePost(currentId, {
          file,
          title,
          slug: finalSlug,
          content,
        });
      } else {
        await createPost(file, title, finalSlug, content);
      }

      const data = await getAllPosts();
      setPosts(Array.isArray(data) ? data : []);
      closeModal();
      alert(
        currentId
          ? "Cập nhật bài viết thành công!"
          : "Thêm bài viết thành công!",
      );
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "";
      if (
        message.toLowerCase().includes("tồn tại") ||
        message.toLowerCase().includes("slug")
      ) {
        setErrors((prev) => ({
          ...prev,
          title: "Tiêu đề hoặc slug đã tồn tại",
        }));
      } else {
        alert("Lỗi khi lưu dữ liệu");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        await deletePost(id);
        const data = await getAllPosts();
        setPosts(Array.isArray(data) ? data : []);
        alert("Xóa bài viết thành công!");
      } catch (error) {
        alert("Lỗi khi xóa bài viết");
      }
    }
  };

  const filteredData = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (loading)
    return (
      <div className="posts-page w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E6F7F5] via-[#F0FDFA] to-[#E6F7F5]">
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
    <div className="posts-page w-full min-h-screen bg-gradient-to-br from-[#E6F7F5] via-[#F0FDFA] to-[#E6F7F5]">
      <style>{fontStyle}</style>
      <div className="w-full px-6 md:px-8 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2DD4BF] to-[#0EA5E9] shadow-lg flex items-center justify-center">
                <FileText className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-[#1F4A5C] tracking-tight">
                  Quản lý <span className="text-[#2DD4BF]">Bài viết</span>
                </h1>
                <p className="text-[#5B8C9E] text-sm mt-0.5 flex items-center gap-2 font-medium">
                  <Heart size={12} className="text-[#2DD4BF]" />
                  Tổng số:{" "}
                  <span className="font-extrabold text-[#2DD4BF]">
                    {filteredData.length}
                  </span>{" "}
                  bài viết
                </p>
              </div>
            </div>
          </div>

          {/* Thanh tìm kiếm + nút thêm mới */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
            <div className="relative flex-1 group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8D9E6] group-focus-within:text-[#2DD4BF] transition-colors duration-300"
                size={16}
              />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết theo tiêu đề hoặc slug..."
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
              Thêm bài viết mới
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
                      Tiêu đề
                    </th>
                    <th className="px-6 py-5 text-left text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-5 text-left text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-5 text-right text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6F7F5]">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center">
                        <FileText
                          size={56}
                          className="mx-auto mb-4 text-[#D0F0FD]"
                        />
                        <p className="text-[#5B8C9E] font-medium">
                          Không tìm thấy bài viết nào
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
                                item.thumbnail ||
                                "https://placehold.co/400x300?text=No+Image"
                              }
                              className="w-full h-full object-cover"
                              alt={item.title}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-extrabold text-[#1F4A5C] text-sm flex items-center gap-2">
                            <Shield size={12} className="text-[#2DD4BF]" />
                            {item.title.length > 50
                              ? item.title.slice(0, 50) + "..."
                              : item.title}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-mono text-[#5B8C9E]">
                            {item.slug}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-[#5B8C9E] flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDate(item.createdAt)}
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
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] px-6 py-5 flex justify-between items-center">
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <FileText size={20} />
                {currentId ? "✏️ Cập nhật" : "➕ Thêm mới"} Bài viết
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
                {/* Upload ảnh */}
                <div>
                  <label className="text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider mb-2 block">
                    Ảnh đại diện{" "}
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
                          <ImageIcon size={32} className="text-[#B8D9E6]" />
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
                      {errors.thumbnail && (
                        <p className="text-[#F43F5E] text-xs mt-1 font-medium">
                          {errors.thumbnail}
                        </p>
                      )}
                    </label>
                  </div>
                </div>

                {/* Tiêu đề */}
                <div>
                  <label className="text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider mb-2 block">
                    Tiêu đề <span className="text-[#F43F5E]">*</span>
                  </label>
                  <input
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!slug) {
                        setSlug(generateSlug(e.target.value));
                      }
                      setErrors((prev) => ({ ...prev, title: "" }));
                    }}
                    className={`w-full px-4 py-3 bg-[#F0FDFA] rounded-xl text-sm outline-none transition-all font-semibold
                      ${errors.title ? "border-2 border-[#F43F5E] focus:ring-[#F43F5E]/20" : "border border-[#D0F0FD] focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20"}`}
                    placeholder="VD: Những điều cần biết về bệnh tim mạch"
                  />
                  {errors.title && (
                    <p className="text-[#F43F5E] text-xs mt-1 font-medium">
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Slug */}
                <div>
                  <label className="text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider mb-2 block">
                    Slug (đường dẫn)
                  </label>
                  <div className="relative">
                    <Tag
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2DD4BF]"
                      size={16}
                    />
                    <input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#F0FDFA] rounded-xl border border-[#D0F0FD] focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 text-sm outline-none transition-all font-mono"
                      placeholder="tu-khoa-bai-viet"
                    />
                  </div>
                  <p className="text-xs text-[#5B8C9E] mt-1">
                    Slug được tạo tự động từ tiêu đề. Bạn có thể chỉnh sửa.
                  </p>
                </div>

                {/* Nội dung */}
                <div>
                  <label className="text-[11px] font-extrabold text-[#1F4A5C] uppercase tracking-wider mb-2 block">
                    Nội dung <span className="text-[#F43F5E]">*</span>
                  </label>
                  <textarea
                    rows={6}
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                      setErrors((prev) => ({ ...prev, content: "" }));
                    }}
                    className={`w-full px-4 py-3 bg-[#F0FDFA] rounded-xl text-sm outline-none transition-all resize-none font-medium
                      ${errors.content ? "border-2 border-[#F43F5E] focus:ring-[#F43F5E]/20" : "border border-[#D0F0FD] focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20"}`}
                    placeholder="Nội dung chi tiết của bài viết..."
                  />
                  {errors.content && (
                    <p className="text-[#F43F5E] text-xs mt-1 font-medium">
                      {errors.content}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white font-extrabold text-sm uppercase tracking-wider hover:from-[#14B8A6] hover:to-[#0284C7] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : currentId ? (
                    "Cập nhật bài viết"
                  ) : (
                    "Thêm bài viết"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {isViewModalOpen && selectedPost && (
        <div className="fixed inset-0 bg-[#1F4A5C]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 my-8">
            <div className="bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] px-6 py-5 flex justify-between items-center">
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <FileText size={20} />
                Chi tiết bài viết
              </h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X size={22} />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Ảnh đại diện */}
              <div className="flex flex-col items-center mb-5">
                <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-[#E6F7F5] to-[#F0FDFA] overflow-hidden shadow-md mb-4">
                  <img
                    src={
                      selectedPost.thumbnail ||
                      "https://placehold.co/400x300?text=No+Image"
                    }
                    className="w-full h-full object-cover"
                    alt={selectedPost.title}
                  />
                </div>
                <h3 className="text-xl font-extrabold text-[#1F4A5C] text-center">
                  {selectedPost.title}
                </h3>
                <span className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#E6F7F5] text-[#2DD4BF]">
                  <Activity size={10} />
                  Bài viết
                </span>
              </div>

              <div className="space-y-3 text-sm border-t border-[#E6F7F5] pt-4">
                <div className="flex justify-between items-center py-2 border-b border-[#E6F7F5]">
                  <span className="text-[#5B8C9E] font-semibold flex items-center gap-1">
                    <Shield size={14} /> ID:
                  </span>
                  <span className="font-mono font-extrabold text-[#2DD4BF]">
                    #{selectedPost.id}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#E6F7F5]">
                  <span className="text-[#5B8C9E] font-semibold flex items-center gap-1">
                    <Tag size={14} /> Slug:
                  </span>
                  <span className="font-mono font-medium text-[#1F4A5C]">
                    {selectedPost.slug}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#E6F7F5]">
                  <span className="text-[#5B8C9E] font-semibold flex items-center gap-1">
                    <Calendar size={14} /> Ngày tạo:
                  </span>
                  <span className="font-medium text-[#1F4A5C]">
                    {formatDate(selectedPost.createdAt)}
                  </span>
                </div>
                <div className="py-2">
                  <span className="text-[#5B8C9E] font-semibold block mb-2 flex items-center gap-1">
                    <AlignLeft size={14} /> Nội dung:
                  </span>
                  <div className="text-[#1F4A5C] bg-[#F0FDFA] p-4 rounded-xl leading-relaxed font-medium whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {selectedPost.content}
                  </div>
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
