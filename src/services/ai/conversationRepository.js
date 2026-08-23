import apiClient from "../apiClient";

const toId = (value) => {
  const id = value?._id || value?.id || value;
  return id ? String(id) : null;
};

const toISOString = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const normalizeMessage = (message) => {
  if (!message || typeof message !== "object") return null;
  if (message.role !== "user" && message.role !== "assistant") return null;
  if (typeof message.content !== "string") return null;

  const id = toId(message);
  const createdAt = toISOString(message.createdAt);
  if (!id || !createdAt) return null;

  return {
    id,
    role: message.role,
    content: message.content,
    createdAt,
  };
};

const normalizeConversation = (conversation, messages) => {
  if (!conversation || typeof conversation !== "object") return null;

  const id = toId(conversation);
  const createdAt = toISOString(conversation.createdAt);
  const updatedAt = toISOString(
    conversation.updatedAt || conversation.lastMessageAt,
  );
  const lastMessageAt = toISOString(
    conversation.lastMessageAt || conversation.updatedAt,
  );
  const title =
    typeof conversation.title === "string" ? conversation.title.trim() : "";

  if (!id || !title || !createdAt || !updatedAt || !lastMessageAt) {
    return null;
  }

  const normalized = {
    id,
    vehicleId: toId(conversation.primaryVehicleId),
    title,
    lastMessageAt,
    createdAt,
    updatedAt,
  };

  if (Array.isArray(messages)) {
    normalized.messages = messages.map(normalizeMessage).filter(Boolean);
  }

  return normalized;
};

const repositoryError = (error, fallbackMessage) => {
  const normalizedError = new Error(
    error.response?.data?.message || fallbackMessage,
  );
  normalizedError.status = error.response?.status;
  return normalizedError;
};

export const createConversationRepository = (client = apiClient) => ({
  async createConversation({ title, vehicleId }) {
    try {
      const response = await client.post("/chat/conversations", {
        title,
        primaryVehicleId: vehicleId || null,
      });
      const conversation = normalizeConversation(
        response.data?.data?.conversation,
      );

      if (!conversation) {
        throw new Error("Invalid conversation response");
      }

      return conversation;
    } catch (error) {
      throw repositoryError(error, "שגיאה ביצירת השיחה");
    }
  },

  async listConversations(vehicleId) {
    if (!vehicleId) return [];

    try {
      const response = await client.get("/chat/conversations");
      const normalizedVehicleId = String(vehicleId);

      return (response.data?.data?.conversations || [])
        .map((conversation) => normalizeConversation(conversation))
        .filter(
          (conversation) =>
            conversation?.vehicleId === normalizedVehicleId,
        );
    } catch (error) {
      throw repositoryError(error, "שגיאה בטעינת השיחות הקודמות");
    }
  },

  async getConversation(conversationId) {
    try {
      const response = await client.get(
        `/chat/conversations/${conversationId}`,
      );
      const conversation = normalizeConversation(
        response.data?.data?.conversation,
        response.data?.data?.messages,
      );

      if (!conversation) {
        throw new Error("Invalid conversation response");
      }

      return conversation;
    } catch (error) {
      throw repositoryError(error, "שגיאה בטעינת השיחה");
    }
  },

  async appendMessage(conversationId, { role, content }) {
    try {
      const response = await client.post(
        `/chat/conversations/${conversationId}/messages`,
        { role, content },
      );
      const message = normalizeMessage(response.data?.data?.message);

      if (!message) {
        throw new Error("Invalid message response");
      }

      return message;
    } catch (error) {
      throw repositoryError(error, "שגיאה בשמירת ההודעה");
    }
  },

  async deleteConversation(conversationId) {
    try {
      await client.delete(`/chat/conversations/${conversationId}`);
      return true;
    } catch (error) {
      throw repositoryError(error, "שגיאה במחיקת השיחה");
    }
  },
});

export const conversationRepository = createConversationRepository();
