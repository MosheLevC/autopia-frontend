import { createConversationTitle } from "../../utils/aiConversation.js";

export const CONVERSATION_STORAGE_KEY = "autopia.ai.conversations.v1";

const getDefaultStorage = () => {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
};

const toISOString = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const normalizeMessage = (message) => {
  if (!message || typeof message !== "object") return null;
  if (message.role !== "user" && message.role !== "assistant") return null;
  if (typeof message.id !== "string" || !message.id) return null;
  if (typeof message.content !== "string") return null;

  const createdAt = toISOString(message.createdAt);
  if (!createdAt) return null;

  return {
    id: message.id,
    role: message.role,
    content: message.content,
    createdAt,
  };
};

const normalizeConversation = (conversation) => {
  if (!conversation || typeof conversation !== "object") return null;
  if (typeof conversation.id !== "string" || !conversation.id) return null;

  const vehicleId = String(conversation.vehicleId || "");
  if (!vehicleId) return null;

  const messages = Array.isArray(conversation.messages)
    ? conversation.messages.map(normalizeMessage).filter(Boolean)
    : [];
  const firstUserMessage = messages.find(
    (message) => message.role === "user" && message.content.trim(),
  );

  if (!firstUserMessage) return null;

  const createdAt = toISOString(conversation.createdAt);
  const updatedAt = toISOString(conversation.updatedAt);
  if (!createdAt || !updatedAt) return null;

  const storedTitle =
    typeof conversation.title === "string" ? conversation.title.trim() : "";

  return {
    id: conversation.id,
    vehicleId,
    title: storedTitle || createConversationTitle(firstUserMessage.content),
    messages,
    createdAt,
    updatedAt,
  };
};

export const createLocalConversationRepository = (
  storage = getDefaultStorage(),
) => {
  const readAll = () => {
    if (!storage) return [];

    try {
      const storedValue = storage.getItem(CONVERSATION_STORAGE_KEY);
      if (!storedValue) return [];

      const parsedValue = JSON.parse(storedValue);
      if (!Array.isArray(parsedValue)) return [];

      return parsedValue.map(normalizeConversation).filter(Boolean);
    } catch {
      return [];
    }
  };

  const writeAll = (conversations) => {
    if (!storage) return false;

    try {
      storage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(conversations));
      return true;
    } catch {
      return false;
    }
  };

  return {
    listConversations(vehicleId) {
      const normalizedVehicleId = String(vehicleId || "");
      if (!normalizedVehicleId) return [];

      return readAll()
        .filter(
          (conversation) => conversation.vehicleId === normalizedVehicleId,
        )
        .sort(
          (first, second) =>
            new Date(second.updatedAt).getTime() -
            new Date(first.updatedAt).getTime(),
        );
    },

    getConversation(id) {
      const normalizedId = String(id || "");
      if (!normalizedId) return null;

      return (
        readAll().find(
          (conversation) => conversation.id === normalizedId,
        ) || null
      );
    },

    saveConversation(conversation) {
      const normalizedConversation = normalizeConversation(conversation);
      if (!normalizedConversation) return null;

      const conversations = readAll();
      const existingIndex = conversations.findIndex(
        (item) => item.id === normalizedConversation.id,
      );

      if (existingIndex >= 0) {
        conversations[existingIndex] = normalizedConversation;
      } else {
        conversations.push(normalizedConversation);
      }

      return writeAll(conversations) ? normalizedConversation : null;
    },

    deleteConversation(id) {
      const normalizedId = String(id || "");
      if (!normalizedId) return false;

      const conversations = readAll();
      const remainingConversations = conversations.filter(
        (conversation) => conversation.id !== normalizedId,
      );

      if (remainingConversations.length === conversations.length) {
        return false;
      }

      return writeAll(remainingConversations);
    },
  };
};

export const localConversationRepository =
  createLocalConversationRepository();
