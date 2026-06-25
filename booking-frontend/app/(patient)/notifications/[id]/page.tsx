"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ArrowLeft,
  Clock,
  MessageCircle,
  User,
  Mail,
  Phone,
  Send,
  RefreshCw,
} from "lucide-react";

import { getProfile } from "@/services/authService";
import {
  getNotifications,
  markNotificationAsRead,
  type Notification,
} from "@/services/notificationService";
import { getContactById, type Contact } from "@/services/contactService";
import {
  getMessages,
  sendMessage,
  type Message,
} from "@/services/messageService";

export default function NotificationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<{
    notification: Notification;
    contact: Contact | null;
  } | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Load user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const data = await getProfile();
        setUser(data);
      } catch (error) {
        console.error("Profile fetch error:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // Hàm load notifications
  const loadNotifications = useCallback(
    async (showRefreshIndicator = false) => {
      const userId = Number(localStorage.getItem("userId"));
      if (!userId) return;

      try {
        if (showRefreshIndicator) setRefreshing(true);
        const data = await getNotifications(userId);

        // Kiểm tra xem có thông báo mới không
        const oldIds = new Set(notifications.map((n) => n.id));
        const newNotifications = data.filter((n) => !oldIds.has(n.id));

        if (newNotifications.length > 0) {
          console.log("Có thông báo mới:", newNotifications.length);

          // Phát âm thanh nếu muốn
          // const audio = new Audio('/notification.mp3');
          // audio.play().catch(e => console.log('Audio play failed:', e));
        }

        setNotifications(data);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      } finally {
        if (showRefreshIndicator) setRefreshing(false);
      }
    },
    [notifications],
  );

  // Polling: tự động refresh mỗi 5 giây
  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        const data = await getNotifications(user.id);
        if (isMounted) setNotifications(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user]);

  // Khi component focus (tab đang active) thì refresh
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadNotifications();
      }
    };

    const handleFocus = () => {
      loadNotifications();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [loadNotifications]);

  const loadMessages = async (contactId: number) => {
    try {
      const msgs = await getMessages(contactId);
      setMessages(msgs);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  // Auto refresh messages khi đang xem detail
  useEffect(() => {
    if (!selectedNotification?.contact?.id) return;

    const messageInterval = setInterval(async () => {
      try {
        const msgs = await getMessages(selectedNotification.contact!.id);
        if (msgs.length !== messages.length) {
          setMessages(msgs);
          // Scroll to bottom nếu có tin nhắn mới
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      } catch (error) {
        console.error("Failed to refresh messages:", error);
      }
    }, 3000); // 3 giây refresh tin nhắn 1 lần

    return () => clearInterval(messageInterval);
  }, [selectedNotification?.contact?.id, messages.length]);

  const handleViewDetail = async (notification: Notification) => {
    try {
      // Đánh dấu đã đọc
      if (!notification.isRead) {
        await markNotificationAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n,
          ),
        );
      }

      setLoadingDetail(true);

      if (!notification.contactId) {
        console.error("Notification không có contactId:", notification);
        setSelectedNotification({
          notification,
          contact: null,
        });
        setLoadingDetail(false);
        return;
      }

      const contact = await getContactById(notification.contactId);
      await loadMessages(notification.contactId);

      setSelectedNotification({
        notification,
        contact,
      });
    } catch (error) {
      console.error("Failed to load contact detail:", error);
      setSelectedNotification({
        notification,
        contact: null,
      });
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!selectedNotification?.contact?.id) {
      alert("Không thể gửi tin nhắn lúc này");
      return;
    }

    try {
      setSendingMessage(true);

      // Gửi tin nhắn với sender là "USER"
      await sendMessage(selectedNotification.contact.id, "USER", newMessage);

      // Refresh messages
      await loadMessages(selectedNotification.contact.id);

      // Refresh notifications để cập nhật trạng thái
      await loadNotifications();

      // Clear input
      setNewMessage("");

      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Gửi tin nhắn thất bại, vui lòng thử lại");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleManualRefresh = () => {
    loadNotifications(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCloseDetail = () => {
    setSelectedNotification(null);
    setMessages([]);
    setNewMessage("");
  };

  const formatDate = (dateString: string) => {
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
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSenderName = (sender: string) => {
    switch (sender) {
      case "ADMIN":
        return "Admin";
      case "USER":
        return "Bạn";
      default:
        return sender;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <Bell className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-800">
                  Thông báo của tôi
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Danh sách thông báo */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-800">Danh sách</h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Tự động cập nhật mỗi 5 giây
                    </p>
                  </div>
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    {notifications.filter((n) => !n.isRead).length} mới
                  </span>
                </div>
              </div>

              <div className="max-h-[calc(100vh-180px)] overflow-y-auto divide-y divide-gray-100">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Bell className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">
                      Không có thông báo
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Bạn chưa có thông báo nào
                    </p>
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleViewDetail(item)}
                      className={`p-4 cursor-pointer transition-all duration-200 hover:bg-blue-50/50 ${
                        selectedNotification?.notification.id === item.id
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : !item.isRead
                            ? "bg-blue-50/30"
                            : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            A
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 text-sm line-clamp-2">
                            {item.content}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(item.createdAt)}
                            </p>
                            {!item.isRead && (
                              <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                                Mới
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Chi tiết thông báo */}
          <div className="lg:col-span-2">
            {!selectedNotification ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="max-w-sm mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-12 h-12 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Chưa chọn thông báo
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Chọn một thông báo bên trái để xem chi tiết
                  </p>
                </div>
              </div>
            ) : loadingDetail ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Đang tải chi tiết...</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-[calc(100vh-120px)]">
                {/* Header */}
                <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
                        A
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          {selectedNotification.contact?.subject ||
                            "Phản hồi từ Admin"}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatFullDate(
                            selectedNotification.notification.createdAt,
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleCloseDetail}
                      className="text-gray-400 hover:text-gray-600 transition p-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {/* Tin nhắn đầu tiên từ contact */}
                  {selectedNotification.contact && (
                    <div className="flex justify-start">
                      <div className="bg-white border px-4 py-3 rounded-2xl max-w-[80%] shadow-sm">
                        <div className="text-xs text-gray-500 mb-1">
                          Yêu cầu của bạn
                        </div>
                        <div className="text-gray-700">
                          {selectedNotification.contact.message}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {formatFullDate(
                            selectedNotification.contact.createdAt,
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Các tin nhắn trao đổi */}
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === "USER" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-3 rounded-2xl max-w-[80%] ${
                          msg.sender === "USER"
                            ? "bg-blue-500 text-white"
                            : msg.sender === "ADMIN"
                              ? "bg-white border shadow-sm"
                              : "bg-yellow-100"
                        }`}
                      >
                        <div
                          className={`text-xs mb-1 ${
                            msg.sender === "USER"
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {getSenderName(msg.sender)}
                        </div>
                        <div className="whitespace-pre-wrap break-words">
                          {msg.content}
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            msg.sender === "USER"
                              ? "text-blue-200"
                              : "text-gray-400"
                          }`}
                        >
                          {formatFullDate(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
                  <div className="flex gap-2">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Nhập tin nhắn của bạn..."
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                      rows={2}
                      disabled={sendingMessage}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={sendingMessage || !newMessage.trim()}
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-5 py-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 self-end"
                    >
                      {sendingMessage ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Gửi
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Nhấn Enter để gửi, Shift+Enter để xuống dòng
                  </p>
                </div>

                {/* Thông tin chi tiết khách hàng (collapsible) */}
                {selectedNotification.contact && (
                  <details className="p-4 border-t border-gray-100 bg-gray-50">
                    <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                      📋 Xem thông tin chi tiết
                    </summary>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          <strong>Họ tên:</strong>{" "}
                          {selectedNotification.contact.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          <strong>Email:</strong>{" "}
                          {selectedNotification.contact.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          <strong>SĐT:</strong>{" "}
                          {selectedNotification.contact.phone || "Không có"}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MessageCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-sm text-gray-600">
                          <strong>Chủ đề:</strong>{" "}
                          {selectedNotification.contact.subject}
                        </span>
                      </div>
                    </div>
                  </details>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
