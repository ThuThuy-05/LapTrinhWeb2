"use client";

import { useEffect, useState } from "react";
import { getAllPosts, Post } from "@/services/postService";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Heart,
  ChevronRight,
  Newspaper,
} from "lucide-react";

export default function NewsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const allPosts = await getAllPosts();
      const filteredPosts = allPosts.filter((post) => post.id !== 4);
      setPosts(filteredPosts);
    } catch (error) {
      console.error("Lỗi khi tải tin tức:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getExcerpt = (content: string, maxLength: number = 100) => {
    if (!content) return "";
    const plainText = content.replace(/\n/g, " ").replace(/[•-]/g, "");
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + "...";
  };

  const getRandomViews = () => {
    return Math.floor(Math.random() * 5000) + 100;
  };

  const getRandomLikes = () => {
    return Math.floor(Math.random() * 200) + 10;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Đang tải tin tức...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero + Nút quay lại - tông màu xanh dương */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        {/* Nút quay lại - đặt ở góc trên bên trái trong hero */}
        <div className="absolute top-6 left-4 md:left-8 z-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all rounded-full px-4 py-2 text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Quay lại
          </button>
        </div>

        {/* Nội dung hero */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Tin tức & Sự kiện
          </h1>
          <p className="text-white/80 text-sm md:text-base">
            Cập nhật những thông tin mới nhất về sức khỏe và bệnh viện
          </p>
        </div>
      </div>

      {/* News Grid - 4 cột trên hàng */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Newspaper className="text-slate-300" size={40} />
              </div>
              <h2 className="text-xl font-bold text-slate-700 mb-2">
                Không có bài viết nào
              </h2>
              <p className="text-slate-500">
                Hiện tại chưa có tin tức nào để hiển thị
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {posts.map((post) => {
                const views = getRandomViews();
                const likes = getRandomLikes();

                return (
                  <div
                    key={post.id}
                    onClick={() => router.push(`/news/${post.id}`)}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-slate-100"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                      {post.thumbnail &&
                      !post.thumbnail.startsWith("blob:") &&
                      post.thumbnail.startsWith("http") ? (
                        <Image
                          src={post.thumbnail}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Newspaper size={40} className="text-slate-300" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Meta info */}
                      <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye size={12} />
                          <span>{views.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-slate-500 text-xs leading-relaxed mb-3 line-clamp-2">
                        {getExcerpt(post.content, 80)}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                          Đọc thêm
                          <ChevronRight
                            size={14}
                            className="group-hover:translate-x-0.5 transition-transform"
                          />
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                          <Heart size={12} />
                          <span>{likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
