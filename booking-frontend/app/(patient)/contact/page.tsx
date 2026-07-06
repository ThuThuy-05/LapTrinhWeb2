"use client";

import { useState, useEffect } from "react";
import { createContact, type ContactData } from "@/services/contactService";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  useEffect(() => {
    const fetchUserId = () => {
      const id = localStorage.getItem("userId");
      if (id) {
        setUserId(Number(id));
      }
    };

    fetchUserId();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      setStatus({
        type: "error",
        message: "Vui lòng nhập đầy đủ thông tin",
      });
      setTimeout(() => setStatus({ type: "", message: "" }), 3000);
      return;
    }

    if (!userId) {
      setStatus({
        type: "error",
        message: "Bạn cần đăng nhập để gửi liên hệ",
      });
      setTimeout(() => setStatus({ type: "", message: "" }), 3000);
      return;
    }

    try {
      setLoading(true);

      const data: ContactData & { userId: number } = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: form.message,
        userId: userId,
      };

      const response = await createContact(data);

      if (response.id) {
        setStatus({
          type: "success",
          message:
            "Gửi yêu cầu thành công! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.",
        });

        setForm({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });

        setTimeout(() => setStatus({ type: "", message: "" }), 5000);
      }
    } catch (error) {
      console.error(error);
      setStatus({
        type: "error",
        message: "Gửi thất bại! Vui lòng thử lại sau.",
      });
      setTimeout(() => setStatus({ type: "", message: "" }), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Thông tin liên hệ
  const contactInfo = [
    {
      icon: "📍",
      title: "Địa chỉ",
      content: "Tòa nhà ABC, 123 Đường Nguyễn Huệ, Quận 1, TP.HCM",
    },
    {
      icon: "📞",
      title: "Hotline 24/7",
      content: "1900 1234",
    },
    {
      icon: "✉️",
      title: "Email",
      content: "support@3THospital.com",
    },
    {
      icon: "⏰",
      title: "Giờ làm việc",
      content: "Thứ 2 - Thứ 7: 07:30 - 18:00",
    },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-12 px-4 sm:px-6 relative"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Hỗ trợ trực tuyến 24/7
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại thông
            tin, đội ngũ tư vấn sẽ phản hồi trong vòng 24h.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT COLUMN: CONTACT FORM */}
          <div className="group">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-white/50 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Gửi yêu cầu hỗ trợ
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Điền thông tin bên dưới, chúng tôi sẽ phản hồi sớm nhất
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50"
                        style={{
                          fontFamily: "'Times New Roman', Times, serif",
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="090 123 4567"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50"
                        style={{
                          fontFamily: "'Times New Roman', Times, serif",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@gmail.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50"
                      style={{ fontFamily: "'Times New Roman', Times, serif" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chủ đề
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50/50 appearance-none"
                      style={{ fontFamily: "'Times New Roman', Times, serif" }}
                    >
                      <option value="">Chọn chủ đề</option>
                      <option value="Tư vấn bác sĩ">🏥 Tư vấn bác sĩ</option>
                      <option value="Đặt lịch khám">📅 Đặt lịch khám</option>
                      <option value="Khiếu nại">📝 Khiếu nại</option>
                      <option value="Khác">💬 Khác</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Vui lòng mô tả chi tiết yêu cầu của bạn..."
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none bg-gray-50/50"
                      style={{ fontFamily: "'Times New Roman', Times, serif" }}
                    />
                  </div>
                </div>

                {status.message && (
                  <div
                    className={`p-4 rounded-xl text-sm ${
                      status.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-600 border border-red-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {status.type === "success" ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                      {status.message}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang gửi...
                    </span>
                  ) : (
                    "Gửi yêu cầu tư vấn"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: MAP & INFO */}
          <div className="space-y-6">
            {/* Map Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white/50 transition-all duration-300 hover:shadow-2xl">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    Vị trí của chúng tôi
                  </h3>
                </div>
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  Xem bản đồ
                </span>
              </div>
              <div className="h-[320px] w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.319357065355!2d106.6640835153347!3d10.786507462017772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ed2392c447d%3A0x6b4c1064d715949d!2s3T%20Hospital!5e0!3m2!1svi!2s!4v1680000000000!5m2!1svi!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  title="Office Location"
                />
              </div>
            </div>

            {/* Contact Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">
                        {info.title}
                      </h4>
                      <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                        {info.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
              <p className="text-sm font-semibold text-gray-800 mb-3 text-center">
                Kết nối với chúng tôi
              </p>
              <div className="flex justify-center gap-4">
                {[
                  { name: "Facebook", icon: "📘", color: "hover:bg-blue-50" },
                  { name: "Zalo", icon: "💬", color: "hover:bg-blue-50" },
                  { name: "TikTok", icon: "🎵", color: "hover:bg-pink-50" },
                  { name: "YouTube", icon: "📺", color: "hover:bg-red-50" },
                ].map((social) => (
                  <button
                    key={social.name}
                    className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl transition-all duration-300 ${social.color} hover:scale-110`}
                  >
                    {social.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
