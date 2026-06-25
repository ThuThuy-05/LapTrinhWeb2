"use client";

import React, { useState, useEffect, useRef } from "react";
import { chatService, ChatResponse } from "@/services/chatService";
import { useRouter } from "next/navigation";

type Message = {
  id: string;
  sender: "USER" | "BOT";
  content: string;
  timestamp?: string;
  isError?: boolean;
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input khi mở chat
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    chatService.initSession();
  }, []);
  // Tin nhắn chào mừng
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          sender: "BOT",
          content:
            "👋 Xin chào! Tôi là trợ lý ảo của bệnh viện.\n\nTôi có thể giúp bạn:\n• Tìm bác sĩ theo chuyên khoa\n• Xem lịch làm việc\n• Đặt lịch khám\n• Kiểm tra lịch đã đặt\n• Xem giá dịch vụ\n\n💡 Hãy hỏi tôi bất cứ điều gì!",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setError(null);
  };

  const handleSendMessage = async () => {
    const message = inputMessage.trim();
    if (!message || isLoading) return;

    // Thêm tin nhắn user
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      sender: "USER",
      content: message,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setIsTyping(true);
    setError(null);

    try {
      // Gọi API - Backend trả về ChatResponse
      const response: ChatResponse = await chatService.sendMessage(message);

      // Kiểm tra response từ backend
      if (response.success) {
        // Thêm tin nhắn bot thành công
        const botMessage: Message = {
          id: `bot_${Date.now()}`,
          sender: "BOT",
          content: response.message,
          timestamp: response.timestamp || new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        // Backend trả về lỗi
        const errorMsg = response.error || "Có lỗi xảy ra!";
        setError(errorMsg);
        const botMessage: Message = {
          id: `error_${Date.now()}`,
          sender: "BOT",
          content: "❌ " + errorMsg,
          timestamp: new Date().toISOString(),
          isError: true,
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (err: any) {
      console.error("Lỗi gửi tin nhắn:", err);

      // Xử lý lỗi từ service
      let errorMessage = "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau!";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      const botMessage: Message = {
        id: `error_${Date.now()}`,
        sender: "BOT",
        content: "❌ " + errorMessage,
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReset = async () => {
    try {
      // Gọi API reset - Backend: POST /api/chat/reset
      const result = await chatService.resetConversation();
      setMessages([
        {
          id: "reset",
          sender: "BOT",
          content: "🔄 Đã reset conversation. Hãy hỏi tôi bất cứ điều gì!",
          timestamp: new Date().toISOString(),
        },
      ]);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Không thể reset. Vui lòng thử lại!");
    }
  };

  const router = useRouter();

  const renderMessage = (text: string) => {
    const urlRegex = /(\/booking\/\d+)/g;

    return text.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <span
            key={index}
            onClick={() => router.push(part)}
            className="text-blue-500 underline cursor-pointer"
          >
            👉 Đặt lịch ngay
          </span>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Nếu chat đóng
  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all duration-300 z-50 group"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
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
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <div>
            <span className="font-semibold">Trợ lý ảo</span>
            <div className="text-xs text-blue-200">Đang hoạt động</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="hover:bg-white/20 p-1.5 rounded transition text-sm"
            title="Reset conversation"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
          <button
            onClick={toggleChat}
            className="hover:bg-white/20 p-1.5 rounded transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "USER" ? "justify-end" : "justify-start"} mb-3`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                msg.sender === "USER"
                  ? "bg-blue-600 text-white"
                  : msg.isError
                    ? "bg-red-100 text-red-700 border border-red-300"
                    : "bg-white text-gray-800 shadow-sm border border-gray-100"
              }`}
            >
              <div className="text-sm whitespace-pre-wrap break-words">
                {renderMessage(msg.content)}
              </div>
              <div
                className={`text-xs mt-1 ${
                  msg.sender === "USER" ? "text-blue-200" : "text-gray-400"
                }`}
              >
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start mb-3">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200">
          <div className="text-sm text-red-600 flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 p-3 bg-white flex-shrink-0">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none text-sm"
              rows={1}
              disabled={isLoading}
              style={{ minHeight: "44px", maxHeight: "100px" }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className={`px-4 py-2 rounded-xl transition-all ${
              inputMessage.trim() && !isLoading
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <svg
                className="w-5 h-5 animate-spin"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
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
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="text-xs text-gray-400 mt-1.5 text-center">
          Nhấn Enter để gửi • Shift + Enter để xuống dòng
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
