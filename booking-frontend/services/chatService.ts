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
  quickReplies?: string[];
};

export type ChatRequest = {
  message: string;
  sessionId?: string;
  userId?: number;
};

export type SessionResponse = {
  sessionId: string;
  message: string;
  success: boolean;
};

export type ResetResponse = {
  message: string;
  success: boolean;
};

// =========================
// CHAT SERVICE - KHỚP VỚI BE
// =========================

class ChatService {
  private sessionId: string = "";

  constructor() {
    this.sessionId = "";
  }

  /**
   * Khởi tạo session trong localStorage
   */
  initSession() {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("chatSessionId");
    if (stored) {
      this.sessionId = stored;
    } else {
      this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem("chatSessionId", this.sessionId);
    }
  }

  /**
   * Lấy session ID hiện tại
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Tạo session mới - POST /api/chat/session
   * BE trả về: { sessionId, message, success }
   */
  async createSession(): Promise<SessionResponse> {
    try {
      const res = await api.post<SessionResponse>("/chat/session");

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
   * Gửi tin nhắn đến chatbot - POST /api/chat/send
   * BE trả về: { message, sender, timestamp, success, error, quickReplies }
   */
  async sendMessage(message: string, userId?: number): Promise<ChatResponse> {
    const payload: ChatRequest = {
      message: message.trim(),
      sessionId: this.sessionId,
      userId: userId || 0,
    };

    try {
      const res = await api.post<ChatResponse>("/chat/send", payload);
      return res.data;
    } catch (error: any) {
      console.error("❌ Lỗi gửi tin nhắn:", error);

      // Xử lý lỗi từ BE
      if (error.response?.data) {
        return {
          success: false,
          message: "",
          sender: "BOT",
          timestamp: new Date().toISOString(),
          error:
            error.response.data.message ||
            error.response.data.error ||
            "Lỗi từ server",
        };
      }

      return {
        success: false,
        message: "",
        sender: "BOT",
        timestamp: new Date().toISOString(),
        error: "Không thể kết nối đến server",
      };
    }
  }

  /**
   * Reset conversation - POST /api/chat/reset
   * BE: userId truyền qua query params
   */
  async resetConversation(userId?: number): Promise<ResetResponse> {
    try {
      // Nếu không có userId thì gửi 0
      const params = new URLSearchParams();
      if (userId) {
        params.append("userId", userId.toString());
      } else {
        params.append("userId", "0");
      }

      const res = await api.post<ResetResponse>(
        `/chat/reset?${params.toString()}`,
      );

      // Tạo sessionId mới
      this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem("chatSessionId", this.sessionId);

      return res.data;
    } catch (error: any) {
      console.error("❌ Lỗi reset:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Không thể reset",
      };
    }
  }

  /**
   * Lấy lịch sử chat - GET /api/chat/history
   */
  async getHistory(userId?: number): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (userId) {
        params.append("userId", userId.toString());
      } else {
        params.append("userId", "0");
      }

      const res = await api.get(`/chat/history?${params.toString()}`);
      return res.data;
    } catch (error) {
      console.error("❌ Lỗi lấy lịch sử:", error);
      return {
        success: false,
        history: [],
        count: 0,
      };
    }
  }

  /**
   * Xóa lịch sử chat - DELETE /api/chat/history
   */
  async clearHistory(userId?: number): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (userId) {
        params.append("userId", userId.toString());
      } else {
        params.append("userId", "0");
      }

      const res = await api.delete(`/chat/history?${params.toString()}`);
      return res.data;
    } catch (error) {
      console.error("❌ Lỗi xóa lịch sử:", error);
      return {
        success: false,
        message: "Không thể xóa lịch sử",
      };
    }
  }

  /**
   * Kiểm tra trạng thái - GET /api/chat/status
   */
  async getStatus(): Promise<any> {
    try {
      const res = await api.get("/chat/status");
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
}

// =========================
// EXPORT SINGLETON
// =========================

export const chatService = new ChatService();
export default chatService;
