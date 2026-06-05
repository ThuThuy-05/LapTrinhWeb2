"use client";

import { useEffect, useState } from "react";
import { getPostById, Post } from "@/services/postService";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Heart,
  Sparkles,
  Clock,
  MapPin,
  Phone,
  Mail,
  Shield,
  Users,
  Building2,
  Stethoscope,
  CheckCircle2,
  Target,
  Award,
  Star,
  Quote,
  ChevronRight,
  Hospital,
  BadgeCheck,
} from "lucide-react";

export default function AboutPage() {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, []);

  const loadPost = async () => {
    try {
      setLoading(true);
      const postData = await getPostById(4);
      setPost(postData);
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
    } finally {
      setLoading(false);
    }
  };

  const getVisionContent = () => {
    if (!post) return "";
    const content = post.content;
    const visionIndex = content.indexOf("Tầm nhìn");
    if (visionIndex === -1) return "";
    const missionIndex = content.indexOf("Sứ mệnh", visionIndex);
    if (missionIndex === -1) return content.substring(visionIndex + 9).trim();
    return content.substring(visionIndex + 9, missionIndex).trim();
  };

  const getMissionContent = () => {
    if (!post) return "";
    const content = post.content;
    const missionIndex = content.indexOf("Sứ mệnh");
    if (missionIndex === -1) return "";
    const teamIndex = content.indexOf("Đội ngũ chuyên gia", missionIndex);
    if (teamIndex === -1) return content.substring(missionIndex + 9).trim();
    return content.substring(missionIndex + 9, teamIndex).trim();
  };

  const getTeamContent = () => {
    if (!post) return "";
    const content = post.content;
    const teamIndex = content.indexOf("Đội ngũ chuyên gia");
    if (teamIndex === -1) return "";
    const facilityIndex = content.indexOf("Cơ sở vật chất", teamIndex);
    if (facilityIndex === -1) return content.substring(teamIndex + 19).trim();
    return content.substring(teamIndex + 19, facilityIndex).trim();
  };

  const getFacilityItems = () => {
    if (!post) return [];
    const content = post.content;
    const facilityIndex = content.indexOf("Cơ sở vật chất");
    if (facilityIndex === -1) return [];
    const servicesIndex = content.indexOf("Dịch vụ nổi bật", facilityIndex);
    let facilityText = "";
    if (servicesIndex === -1) {
      facilityText = content.substring(facilityIndex + 17).trim();
    } else {
      facilityText = content
        .substring(facilityIndex + 17, servicesIndex)
        .trim();
    }
    return facilityText
      .split("\n")
      .filter(
        (line) =>
          line.trim().startsWith("•") ||
          line.trim().startsWith("-") ||
          line.trim().startsWith("3T"),
      )
      .map((line) => line.replace(/^[•-]\s*/, "").trim());
  };

  const stats = [
    { value: "500+", label: "Bác sĩ chuyên khoa", icon: <Users size={28} /> },
    { value: "20+", label: "Năm kinh nghiệm", icon: <Award size={28} /> },
    { value: "15", label: "Cơ sở toàn quốc", icon: <Building2 size={28} /> },
    { value: "98%", label: "Hài lòng", icon: <Heart size={28} /> },
  ];

  const facilityItems = getFacilityItems();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="text-slate-300" size={40} />
          </div>
          <h2 className="text-xl font-bold text-slate-700 mb-2">
            Đang cập nhật
          </h2>
          <p className="text-slate-500 mb-6">
            Nội dung giới thiệu đang được cập nhật
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-all duration-200"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            <span className="text-sm font-medium">Quay lại</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Giới thiệu chung */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Hospital className="text-white" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                Giới thiệu chung
              </h2>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">
              {post.content.split("\n\n")[0]}
            </p>
            <p className="text-slate-600 leading-relaxed">
              {post.content.split("\n\n")[1]}
            </p>
          </div>

          {/* 3 cột nội dung */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Tầm nhìn */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <Target className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Tầm nhìn
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {getVisionContent()}
              </p>
            </div>

            {/* Sứ mệnh */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <Shield className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Sứ mệnh</h3>
              <div className="space-y-2">
                {getMissionContent()
                  .split("\n")
                  .filter((line) => line.trim())
                  .map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-sm text-slate-600"
                    >
                      <CheckCircle2
                        size={14}
                        className="text-blue-500 mt-0.5 shrink-0"
                      />
                      <span>{item.replace(/^[•-]\s*/, "").trim()}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Đội ngũ chuyên gia */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <Users className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Đội ngũ chuyên gia
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {getTeamContent()}
              </p>
            </div>
          </div>

          {/* Dịch vụ nổi bật và Cam kết - 2 cột */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Dịch vụ nổi bật */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Stethoscope className="text-white" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Dịch vụ nổi bật
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "Khám bệnh tổng quát",
                  "Khám chuyên khoa",
                  "Tư vấn sức khỏe trực tuyến",
                  "Đặt lịch khám nhanh chóng",
                  "Xét nghiệm và chẩn đoán hình ảnh",
                  "Điều trị nội trú và ngoại trú",
                  "Theo dõi và chăm sóc sau điều trị",
                ].map((service, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"
                  >
                    <CheckCircle2
                      size={14}
                      className="text-blue-500 shrink-0"
                    />
                    <span className="text-slate-600 text-sm">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cam kết của chúng tôi */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <BadgeCheck className="text-white" size={20} />
                </div>
                <h2 className="text-2xl font-bold">Cam kết của chúng tôi</h2>
              </div>
              <div className="space-y-2">
                {[
                  "Chất lượng điều trị an toàn và hiệu quả",
                  "Thái độ phục vụ tận tâm, chu đáo",
                  "Quy trình khám chữa bệnh nhanh chóng",
                  "Minh bạch trong chi phí và thông tin",
                  "Không ngừng cải tiến nâng cao trải nghiệm",
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 bg-white/10 rounded-lg"
                  >
                    <CheckCircle2 size={14} className="shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Thông điệp và Liên hệ - 2 cột */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Thông điệp */}
            <div className="bg-slate-800 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>
              <Quote size={40} className="text-blue-400 mb-3 opacity-50" />
              <p className="text-lg italic leading-relaxed mb-3 relative z-10">
                "Sức khỏe của bạn là ưu tiên hàng đầu của chúng tôi."
              </p>
              <p className="text-xs text-slate-400 mt-3 relative z-10">
                - 3T Hospital -
              </p>
            </div>

            {/* Liên hệ */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Phone size={16} className="text-white" />
                </div>
                Thông tin liên hệ
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <MapPin size={16} className="text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-1">
                      Địa chỉ
                    </p>
                    <p className="text-slate-600 text-sm">
                      123 Đường Nguyễn Trãi, Quận 1, TP.HCM
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Phone size={16} className="text-blue-500 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-1">
                      Điện thoại
                    </p>
                    <p className="text-slate-600 text-sm">(028) 1234 5678</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Mail size={16} className="text-blue-500 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-1">
                      Email
                    </p>
                    <p className="text-slate-600 text-sm">
                      contact@3thospital.vn
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Clock size={16} className="text-blue-500 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-1">
                      Giờ làm việc
                    </p>
                    <p className="text-slate-600 text-sm">
                      T2 - T6: 07:00 - 17:00
                    </p>
                    <p className="text-slate-600 text-sm">T7: 07:00 - 12:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sẵn sàng chăm sóc sức khỏe cho bạn?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Đặt lịch khám ngay hôm nay để được tư vấn miễn phí và nhận ưu đãi
            đặc biệt
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => router.push("/booking")}
              className="px-8 py-3 bg-white text-blue-600 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Đặt lịch ngay
            </button>
            <button
              onClick={() => router.push("/doctors")}
              className="px-8 py-3 border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transition-all"
            >
              Xem danh sách bác sĩ
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg">
                  <div className="text-blue-500">{stat.icon}</div>
                </div>
                <p className="text-3xl md:text-4xl font-bold text-slate-800">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
