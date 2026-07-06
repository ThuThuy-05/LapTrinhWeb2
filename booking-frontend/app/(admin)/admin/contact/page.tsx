"use client";

import { useEffect, useState } from "react";
import {
  Contact,
  getContacts,
  getContactById,
} from "@/services/contactService";
import { getMessages, sendMessage } from "@/services/messageService";
import {
  MessageCircle,
  Search,
  Filter,
  X,
  Send,
  Phone,
  Mail,
  User,
  Clock,
  Tag,
  CheckCircle,
  AlertCircle,
  Loader2,
  MessageSquare,
  ChevronRight,
  Eye,
  Reply,
} from "lucide-react";

const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800;14..32,900&display=swap');
  .admin-contact * {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
`;

export default function AdminContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "DONE">(
    "ALL",
  );
  const [messages, setMessages] = useState<any[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  const loadContacts = async () => {
    try {
      const data = await getContacts();
      setContacts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      loadContacts();
    });
  }, []);

  const handleSelect = async (id: number) => {
    try {
      const contact = await getContactById(id);
      setSelected(contact);
      const msgs = await getMessages(id);
      setMessages(msgs);
      setReply("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!selected) return;

    const interval = setInterval(async () => {
      try {
        const msgs = await getMessages(selected.id);

        setMessages((prev) => {
          // chỉ cập nhật khi có thay đổi
          if (JSON.stringify(prev) !== JSON.stringify(msgs)) {
            return msgs;
          }
          return prev;
        });

        // cập nhật lại trạng thái contact
        const contact = await getContactById(selected.id);
        setSelected(contact);

        // cập nhật danh sách bên trái
        loadContacts();
      } catch (error) {
        console.error(error);
      }
    }, 3000); // 3 giây

    return () => clearInterval(interval);
  }, [selected]);

  const handleReply = async () => {
    if (!selected) return;
    if (!reply.trim()) {
      alert("Vui lòng nhập nội dung phản hồi");
      return;
    }

    try {
      setLoading(true);
      await sendMessage(selected.id, "ADMIN", reply);

      // lấy lại danh sách mới
      const msgs = await getMessages(selected.id);
      setMessages(msgs);

      await loadContacts();

      setReply("");
    } catch (error) {
      console.error(error);
      alert("Phản hồi thất bại");
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm);
    const matchesStatus =
      filterStatus === "ALL" || contact.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = contacts.filter((c) => c.status === "PENDING").length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return formatDate(dateString);
  };

  return (
    <div className="admin-contact w-full min-h-screen bg-gradient-to-br from-[#E6F7F5] via-[#F0FDFA] to-[#E6F7F5]">
      <style>{fontStyle}</style>
      <div className="w-full px-6 md:px-8 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2DD4BF] to-[#0EA5E9] shadow-lg flex items-center justify-center">
                <MessageCircle className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-[#1F4A5C] tracking-tight">
                  Quản lý <span className="text-[#2DD4BF]">Liên hệ</span>
                </h1>
                <p className="text-[#5B8C9E] text-sm mt-0.5 flex items-center gap-2 font-medium">
                  <MessageSquare size={12} className="text-[#2DD4BF]" />
                  Tổng số:{" "}
                  <span className="font-extrabold text-[#2DD4BF]">
                    {filteredContacts.length}
                  </span>{" "}
                  yêu cầu
                </p>
              </div>
            </div>
          </div>

          {/* Thanh tìm kiếm + bộ lọc */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
            <div className="relative flex-1 group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8D9E6] group-focus-within:text-[#2DD4BF] transition-colors duration-300"
                size={16}
              />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#F0FDFA] border border-[#D0F0FD] focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 text-sm outline-none transition-all text-[#1F4A5C] placeholder:text-[#B8D9E6] font-medium"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="bg-white border border-[#D0F0FD] px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-[#F0FDFA] transition-all text-[#1F4A5C] font-semibold text-sm"
              >
                <Filter size={16} className="text-[#2DD4BF]" />
                Lọc theo trạng thái
                {filterStatus !== "ALL" && (
                  <span className="ml-1 w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse"></span>
                )}
              </button>
              {showFilter && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-[#D0F0FD] overflow-hidden z-10 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => {
                      setFilterStatus("ALL");
                      setShowFilter(false);
                    }}
                    className="block w-full text-left px-4 py-2.5 hover:bg-[#E6F7F5] text-sm font-medium text-[#1F4A5C] transition"
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => {
                      setFilterStatus("PENDING");
                      setShowFilter(false);
                    }}
                    className="block w-full text-left px-4 py-2.5 hover:bg-[#E6F7F5] text-sm font-medium text-[#1F4A5C] transition"
                  >
                    <span className="flex items-center gap-2">
                      <AlertCircle size={14} className="text-[#F59E0B]" />
                      Chờ xử lý
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setFilterStatus("DONE");
                      setShowFilter(false);
                    }}
                    className="block w-full text-left px-4 py-2.5 hover:bg-[#E6F7F5] text-sm font-medium text-[#1F4A5C] transition"
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-[#2DD4BF]" />
                      Đã xử lý
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* DANH SÁCH LIÊN HỆ */}
            <div className="col-span-12 lg:col-span-5">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-[#2DD4BF]/10 border border-white/50 overflow-hidden">
                <div className="p-5 border-b border-[#D0F0FD] bg-gradient-to-r from-[#2DD4BF]/10 to-[#0EA5E9]/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-extrabold text-[#1F4A5C] text-lg">
                        Danh sách yêu cầu
                      </h2>
                      <p className="text-xs text-[#5B8C9E] mt-1 font-medium">
                        {filteredContacts.length} yêu cầu
                      </p>
                    </div>
                    {pendingCount > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div className="w-2 h-2 bg-[#F59E0B] rounded-full animate-pulse"></div>
                        </div>
                        <span className="text-xs font-extrabold text-[#F59E0B] bg-amber-50 px-2.5 py-1 rounded-full">
                          {pendingCount} chưa xử lý
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="max-h-[700px] overflow-y-auto divide-y divide-[#E6F7F5]">
                  {filteredContacts.length === 0 ? (
                    <div className="p-12 text-center">
                      <MessageCircle
                        size={56}
                        className="mx-auto mb-4 text-[#D0F0FD]"
                      />
                      <p className="text-[#5B8C9E] font-medium">
                        Không có yêu cầu nào
                      </p>
                    </div>
                  ) : (
                    filteredContacts.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelect(item.id)}
                        className={`p-5 cursor-pointer transition-all duration-200 hover:bg-[#2DD4BF]/5 ${
                          selected?.id === item.id
                            ? "bg-[#2DD4BF]/10 border-l-4 border-[#2DD4BF]"
                            : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2DD4BF] to-[#0EA5E9] flex items-center justify-center text-white text-sm font-extrabold shadow-md">
                                {item.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h3 className="font-extrabold text-[#1F4A5C] text-sm">
                                  {item.name}
                                </h3>
                                <p className="text-xs text-[#5B8C9E] font-medium flex items-center gap-1">
                                  <Tag size={10} className="text-[#2DD4BF]" />
                                  {item.subject}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-[#5B8C9E] mt-2">
                              <span className="flex items-center gap-1 font-medium">
                                <Phone size={11} />
                                {item.phone || "Chưa có"}
                              </span>
                              <span className="flex items-center gap-1 font-medium">
                                <Clock size={11} />
                                {formatRelativeTime(item.createdAt)}
                              </span>
                            </div>
                          </div>
                          <div>
                            {item.status === "PENDING" ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-[#F59E0B]">
                                <AlertCircle size={10} />
                                Chờ xử lý
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-[#2DD4BF]">
                                <CheckCircle size={10} />
                                Đã xử lý
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* CHI TIẾT LIÊN HỆ */}
            <div className="col-span-12 lg:col-span-7">
              {!selected ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-[#2DD4BF]/10 border border-white/50 p-12 text-center">
                  <div className="max-w-sm mx-auto">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#E6F7F5] to-[#F0FDFA] flex items-center justify-center mx-auto mb-4">
                      <MessageCircle size={48} className="text-[#B8D9E6]" />
                    </div>
                    <h3 className="text-lg font-extrabold text-[#1F4A5C] mb-2">
                      Chưa chọn yêu cầu
                    </h3>
                    <p className="text-[#5B8C9E] text-sm font-medium">
                      Vui lòng chọn một yêu cầu từ danh sách bên trái
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-[#2DD4BF]/10 border border-white/50 overflow-hidden">
                  {/* Header */}
                  <div className="p-5 border-b border-[#D0F0FD] bg-gradient-to-r from-[#2DD4BF]/10 to-[#0EA5E9]/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-extrabold text-[#1F4A5C]">
                          Chi tiết yêu cầu
                        </h2>
                        <p className="text-sm text-[#5B8C9E] mt-0.5 font-medium">
                          Mã: #{selected.id}
                        </p>
                      </div>
                      {selected.status === "PENDING" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-extrabold bg-amber-50 text-[#F59E0B]">
                          <AlertCircle size={14} />
                          Chờ xử lý
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-extrabold bg-emerald-50 text-[#2DD4BF]">
                          <CheckCircle size={14} />
                          Đã xử lý
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-5">
                    {/* Thông tin khách hàng */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-[#F0FDFA] rounded-xl">
                        <label className="text-[10px] font-extrabold text-[#5B8C9E] uppercase tracking-wider flex items-center gap-1">
                          <User size={10} /> Họ tên
                        </label>
                        <p className="font-bold text-[#1F4A5C] text-sm mt-1">
                          {selected.name}
                        </p>
                      </div>
                      <div className="p-3 bg-[#F0FDFA] rounded-xl">
                        <label className="text-[10px] font-extrabold text-[#5B8C9E] uppercase tracking-wider flex items-center gap-1">
                          <Mail size={10} /> Email
                        </label>
                        <p className="font-bold text-[#1F4A5C] text-sm mt-1 break-words">
                          {selected.email}
                        </p>
                      </div>
                      <div className="p-3 bg-[#F0FDFA] rounded-xl">
                        <label className="text-[10px] font-extrabold text-[#5B8C9E] uppercase tracking-wider flex items-center gap-1">
                          <Phone size={10} /> Số điện thoại
                        </label>
                        <p className="font-bold text-[#1F4A5C] text-sm mt-1">
                          {selected.phone || "Chưa cung cấp"}
                        </p>
                      </div>
                      <div className="p-3 bg-[#F0FDFA] rounded-xl">
                        <label className="text-[10px] font-extrabold text-[#5B8C9E] uppercase tracking-wider flex items-center gap-1">
                          <Tag size={10} /> Chủ đề
                        </label>
                        <p className="font-bold text-[#1F4A5C] text-sm mt-1">
                          {selected.subject}
                        </p>
                      </div>
                    </div>

                    {/* Nội dung */}
                    <div>
                      <label className="block text-xs font-extrabold text-[#1F4A5C] uppercase tracking-wider mb-2">
                        Nội dung yêu cầu
                      </label>
                      <div className="bg-[#F0FDFA] p-4 rounded-xl border border-[#D0F0FD]">
                        <p className="text-[#1F4A5C] leading-relaxed font-medium whitespace-pre-wrap">
                          {selected.message}
                        </p>
                        <p className="text-xs text-[#5B8C9E] mt-3 font-medium flex items-center gap-1">
                          <Clock size={10} />
                          Gửi lúc: {formatDate(selected.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Lịch sử trao đổi */}
                    <div>
                      <label className="block text-xs font-extrabold text-[#1F4A5C] uppercase tracking-wider mb-2">
                        Lịch sử trao đổi
                      </label>
                      <div className="border border-[#D0F0FD] rounded-xl p-4 bg-[#F0FDFA] max-h-[320px] overflow-y-auto">
                        {messages.length === 0 ? (
                          <p className="text-center text-[#5B8C9E] text-sm py-6 font-medium">
                            Chưa có tin nhắn nào
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {messages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`flex ${msg.sender === "ADMIN" ? "justify-end" : "justify-start"}`}
                              >
                                <div
                                  className={`px-4 py-2.5 rounded-2xl max-w-[80%] ${
                                    msg.sender === "ADMIN"
                                      ? "bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] text-white"
                                      : "bg-white border border-[#D0F0FD] text-[#1F4A5C] shadow-sm"
                                  }`}
                                >
                                  <div className="text-xs font-bold opacity-80 mb-0.5">
                                    {msg.sender === "ADMIN"
                                      ? "Admin"
                                      : "Khách hàng"}
                                  </div>
                                  <div className="text-sm font-medium">
                                    {msg.content}
                                  </div>
                                  <div className="text-[10px] opacity-60 mt-1">
                                    {formatDate(msg.createdAt)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Form phản hồi */}
                    <div className="border-t border-[#D0F0FD] pt-5">
                      <label className="block text-xs font-extrabold text-[#1F4A5C] uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Reply size={12} /> Phản hồi khách hàng
                      </label>
                      <textarea
                        rows={3}
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        className="w-full border border-[#D0F0FD] rounded-xl p-3 bg-[#F0FDFA] focus:border-[#2DD4BF] focus:ring-2 focus:ring-[#2DD4BF]/20 outline-none transition-all resize-none text-[#1F4A5C] font-medium placeholder:text-[#B8D9E6]"
                        placeholder="Nhập nội dung phản hồi..."
                      />
                      <div className="flex justify-end mt-3">
                        <button
                          onClick={handleReply}
                          disabled={loading || !reply.trim()}
                          className="bg-gradient-to-r from-[#2DD4BF] to-[#0EA5E9] hover:from-[#14B8A6] hover:to-[#0284C7] text-white px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Đang gửi...
                            </>
                          ) : (
                            <>
                              <Send size={14} />
                              Gửi phản hồi
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
