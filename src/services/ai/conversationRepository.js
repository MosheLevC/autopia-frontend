import apiClient from "../apiClient";

const toId = (value) => {
  const id = value?._id || value?.id || value;
  return id ? String(id) : null;
};

const toISOString = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const normalizeFocusedVehicle = (vehicle) => {
  if (!vehicle || typeof vehicle !== "object") return null;

  const id = toId(vehicle.id);
  const manufacturer =
    typeof vehicle.manufacturer === "string"
      ? vehicle.manufacturer.trim()
      : "";
  const model = typeof vehicle.model === "string" ? vehicle.model.trim() : "";
  const licensePlate =
    typeof vehicle.licensePlate === "string"
      ? vehicle.licensePlate.trim()
      : "";

  if (!id || !manufacturer || !model || !licensePlate) {
    return null;
  }

  return { id, manufacturer, model, licensePlate };
};

const normalizeMessage = (message) => {
  if (!message || typeof message !== "object") return null;
  if (message.role !== "user" && message.role !== "assistant") return null;
  if (typeof message.content !== "string") return null;

  const id = toId(message);
  const createdAt = toISOString(message.createdAt);
  if (!id || !createdAt) return null;

  const normalized = {
    id,
    role: message.role,
    content: message.content,
    createdAt,
  };

  const focusedVehicle = normalizeFocusedVehicle(message.focusedVehicle);

  if (focusedVehicle) {
    normalized.focusedVehicle = focusedVehicle;
  }

  return normalized;
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
  async sendMessage({ message, conversationId, title, vehicleId }) {
    try {
      const payload = conversationId
        ? {
            message,
            conversationId,
            focusedVehicleId: vehicleId || null,
          }
        : {
            message,
            title,
            primaryVehicleId: vehicleId || null,
            focusedVehicleId: vehicleId || null,
          };
      const response = await client.post("/chat", payload);
      const conversation = normalizeConversation(
        response.data?.data?.conversation,
      );
      const userMessage = normalizeMessage(
        response.data?.data?.userMessage,
      );
      const assistantMessage = normalizeMessage(
        response.data?.data?.assistantMessage,
      );

      if (!conversation || !userMessage || !assistantMessage) {
        throw new Error("Invalid chat response");
      }

      return { conversation, userMessage, assistantMessage };
    } catch (error) {
      throw repositoryError(error, "שגיאה בשליחת ההודעה");
    }
  },

  async listConversations() {
    try {
      const response = await client.get("/chat/conversations");

      return (response.data?.data?.conversations || [])
        .map((conversation) => normalizeConversation(conversation))
        .filter(Boolean);
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
