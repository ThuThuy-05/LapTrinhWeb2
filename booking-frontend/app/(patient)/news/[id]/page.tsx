"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPostById, getAllPosts, Post } from "@/services/postService";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Clock3,
  Newspaper,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function NewsDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      const data = await getPostById(Number(id));
      setPost(data);

      // Lấy bài viết tương tự (trừ bài hiện tại)
      await loadRelatedPosts(Number(id));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedPosts = async (currentPostId: number) => {
    try {
      const allPosts = await getAllPosts();
      // Lọc bài viết loại trừ bài hiện tại, lấy 4 bài mới nhất
      const filtered = allPosts
        .filter((p) => p.id !== currentPostId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 4);

      setRelatedPosts(filtered);
    } catch (error) {
      console.error("Lỗi tải bài viết liên quan:", error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Hàm loại bỏ HTML tags để lấy text thuần cho mô tả
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, "");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h2 className="text-2xl font-bold text-slate-700">
          Không tìm thấy bài viết
        </h2>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition"
          >
            <ArrowLeft size={18} />
            Quay lại
          </button>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Ảnh */}
            <div className="relative w-full h-[300px] rounded-2xl overflow-hidden bg-slate-100">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Nội dung tóm tắt */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full mb-5">
                <Newspaper size={16} />
                Tin tức bệnh viện
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 leading-tight mb-6">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-slate-500 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  {formatDate(post.createdAt)}
                </div>

                <div className="flex items-center gap-2">
                  <Clock3 size={16} />
                  Cập nhật mới nhất
                </div>
              </div>

              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6" />

              <p className="text-slate-600 leading-8 text-lg">
                {stripHtml(post.content).substring(0, 50000)}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bài viết liên quan */}
      {relatedPosts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-800">
                  📖 Bài viết liên quan
                </h2>
                <p className="text-slate-500 mt-2">
                  Những tin tức mới nhất dành cho bạn
                </p>
              </div>
              <button
                onClick={() => router.push("/news")}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition"
              >
                Xem tất cả
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/news/${relatedPost.id}`}
                  className="group bg-slate-50 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-200">
                    <Image
                      src={relatedPost.thumbnail}
                      alt={relatedPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                      <Calendar size={12} />
                      {formatDate(relatedPost.createdAt)}
                    </div>
                    <h3 className="font-bold text-slate-800 line-clamp-2 group-hover:text-blue-600 transition min-h-[56px]">
                      {relatedPost.title}
                    </h3>
                    <p className="text-slate-500 text-sm mt-2 line-clamp-2">
                      {stripHtml(relatedPost.content).substring(0, 80)}...
                    </p>
                    <div className="mt-3 text-blue-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Đọc tiếp
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-8 lg:p-12 text-center text-white">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Chăm sóc sức khỏe cùng 3T Hospital
            </h2>

            <p className="mb-8 text-blue-100 px-4">
              Đặt lịch khám ngay hôm nay để được đội ngũ bác sĩ chuyên môn cao
              tư vấn và hỗ trợ.
            </p>

            <button
              onClick={() => router.push("/booking")}
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:scale-105 transition shadow-lg"
            >
              Đặt lịch khám ngay
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
