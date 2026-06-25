import api from "@/lib/api";

// =========================
// TYPE - KHỚP VỚI BACKEND
// =========================

export type ChatResponse = {
  message: string;
  sender: "BOT";
  timestamp: string;
  success: boolean;
  error?: string;
  sessionId?: string;

  responseType?: string;
  quickReplies?: string[];
  data?: any;
  intent?: string;
  confidence?: number;
};

export type ChatRequest = {
  message: string;
  sessionId?: string;
  userId?: number;
};

export type SessionResponse = {
  sessionId: string;
  message: string;
};

export type StatusResponse = {
  status: string;
  version: string;
  timestamp: string;
};

export type ResetResponse = {
  message: string;
};

// =========================
// CHAT SERVICE
// =========================

class ChatService {
  private sessionId: string = "";

  constructor() {
    this.sessionId = "";
  }

  initSession() {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("chatSessionId");

    this.sessionId =
      stored ||
      `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    localStorage.setItem("chatSessionId", this.sessionId);
  }

  /**
   * Lấy session ID hiện tại
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Tạo session mới - KHỚP VỚI API /api/chat/session
   */
  async createSession(): Promise<SessionResponse> {
    try {
      const res = await api.post<SessionResponse>("/chat/session");
      // Cập nhật sessionId mới
      if (res.data?.sessionId) {
        this.sessionId = res.data.sessionId;
        localStorage.setItem("chatSessionId", this.sessionId);
      }
      return res.data;
    } catch (error) {
      console.error("❌ Lỗi tạo session:", error);
      throw error;
    }
  }

  /**
   * Gửi tin nhắn đến chatbot - KHỚP VỚI API /api/chat/send
   * Backend trả về ChatResponse với message, sender, timestamp, success, error
   */
  async sendMessage(message: string, userId?: number): Promise<ChatResponse> {
    const payload: ChatRequest = {
      message: message.trim(),
      sessionId: this.sessionId,
      userId: userId || 0,
    };

    const res = await api.post<ChatResponse>("/chat/send", payload);

    return res.data;
  }

  /**
   * Reset conversation - KHỚP VỚI API /api/chat/reset
   * Backend: POST /api/chat/reset?userId=xxx
   */
  async resetConversation(userId?: number): Promise<ResetResponse> {
    const res = await api.post<ResetResponse>(" /chat/reset", null, {
      params: { userId: userId || 0 },
    });

    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    localStorage.setItem("chatSessionId", this.sessionId);

    return res.data;
  }

  /**
   * Kiểm tra trạng thái chatbot - KHỚP VỚI API /api/chat/status
   */
  async getStatus(): Promise<StatusResponse> {
    try {
      const res = await api.get<StatusResponse>("/chat/status");
      return res.data;
    } catch (error) {
      console.error("❌ Lỗi kiểm tra status:", error);
      return {
        status: "offline",
        version: "unknown",
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Xử lý lỗi từ response
   */
  handleError(error: any): string {
    if (error.response) {
      // Server trả về lỗi
      return (
        error.response.data?.error ||
        error.response.data?.message ||
        "Lỗi từ server"
      );
    } else if (error.request) {
      // Không nhận được response
      return "Không thể kết nối đến server. Vui lòng kiểm tra kết nối!";
    } else {
      // Lỗi khác
      return error.message || "Đã xảy ra lỗi!";
    }
  }
}

// =========================
// EXPORT SINGLETON
// =========================

export const chatService = new ChatService();
export default chatService;
