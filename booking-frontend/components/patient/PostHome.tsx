// components/patient/PostHome.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, User, ChevronRight, Newspaper } from "lucide-react";
import { getAllPosts, Post } from "@/services/postService";

export default function PostHome() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data.slice(0, 3));
      } catch (error) {
        console.error("Lỗi tải bài viết:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-12">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 rounded-full mb-3">
            <Newspaper className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
              Tin tức & Sự kiện
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">
            Bài viết mới nhất
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Cập nhật kiến thức sức khỏe và tin tức mới nhất
          </p>
        </div>

        {/* Grid bài viết */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.id}`}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 hover:border-teal-200"
            >
              {post.thumbnail ? (
                <div className="h-40 overflow-hidden">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
              ) : (
                <div className="h-40 bg-gradient-to-r from-blue-100 to-teal-100 flex items-center justify-center">
                  <Newspaper className="w-12 h-12 text-teal-500" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Admin
                  </span>
                </div>
                <h3 className="font-semibold text-slate-800 text-sm mb-1 group-hover:text-teal-600 transition line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {post.content?.substring(0, 80) ||
                    "Khám phá kiến thức bổ ích..."}
                </p>
                <div className="mt-3 flex items-center gap-1 text-teal-600 text-xs font-medium">
                  <span>Đọc thêm</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-8">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold shadow-sm hover:shadow-lg transition-all duration-300"
          >
            Xem tất cả bài viết
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
