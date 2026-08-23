import { useCallback, useEffect, useRef, useState } from "react";
import { localConversationRepository } from "../services/ai/localConversationRepository";
import {
  createAIEntityId,
  createConversationTitle,
} from "../utils/aiConversation";

const getMessageSignature = (messages) =>
  JSON.stringify(
    messages.map(({ id, role, content, createdAt }) => ({
      id,
      role,
      content,
      createdAt,
    })),
  );

export default function useAIConversationHistory({
  vehicleId,
  repository = localConversationRepository,
}) {
  const contextKey = vehicleId ? String(vehicleId) : null;
  const activeConversationRef = useRef({
    contextKey,
    id: null,
  });
  const [activeConversation, setActiveConversation] = useState({
    contextKey,
    id: null,
  });
  const [history, setHistory] = useState(() => ({
    contextKey,
    conversations: contextKey
      ? repository.listConversations(contextKey)
      : [],
  }));

  const refreshConversations = useCallback(() => {
    const conversations = contextKey
      ? repository.listConversations(contextKey)
      : [];
    setHistory({ contextKey, conversations });
    return conversations;
  }, [contextKey, repository]);

  useEffect(() => {
    const nextActiveConversation = { contextKey, id: null };
    activeConversationRef.current = nextActiveConversation;
    setActiveConversation(nextActiveConversation);
    refreshConversations();
  }, [contextKey, refreshConversations]);

  const startNewConversation = useCallback(() => {
    const nextActiveConversation = { contextKey, id: null };
    activeConversationRef.current = nextActiveConversation;
    setActiveConversation(nextActiveConversation);
  }, [contextKey]);

  const loadConversation = useCallback(
    (conversationId) => {
      if (!contextKey) return null;

      const conversation = repository.getConversation(conversationId);
      if (!conversation || conversation.vehicleId !== contextKey) return null;

      const nextActiveConversation = {
        contextKey,
        id: conversation.id,
      };
      activeConversationRef.current = nextActiveConversation;
      setActiveConversation(nextActiveConversation);
      return conversation;
    },
    [contextKey, repository],
  );

  const deleteConversation = useCallback(
    (conversationId) => {
      if (!contextKey) return { deleted: false, wasActive: false };

      const conversation = repository.getConversation(conversationId);
      if (!conversation || conversation.vehicleId !== contextKey) {
        return { deleted: false, wasActive: false };
      }

      const activeRecord = activeConversationRef.current;
      const wasActive =
        activeRecord.contextKey === contextKey &&
        activeRecord.id === conversation.id;
      const deleted = repository.deleteConversation(conversation.id);

      if (!deleted) return { deleted: false, wasActive: false };

      if (wasActive) {
        const nextActiveConversation = { contextKey, id: null };
        activeConversationRef.current = nextActiveConversation;
        setActiveConversation(nextActiveConversation);
      }

      refreshConversations();
      return { deleted: true, wasActive };
    },
    [contextKey, refreshConversations, repository],
  );

  const persistMessages = useCallback(
    (messages) => {
      if (!contextKey || !Array.isArray(messages) || messages.length === 0) {
        return null;
      }

      const firstUserMessage = messages.find(
        (message) => message.role === "user" && message.content?.trim(),
      );
      if (!firstUserMessage) return null;

      const activeRecord = activeConversationRef.current;
      let conversationId =
        activeRecord.contextKey === contextKey ? activeRecord.id : null;
      let existingConversation = conversationId
        ? repository.getConversation(conversationId)
        : null;

      if (
        existingConversation &&
        existingConversation.vehicleId !== contextKey
      ) {
        conversationId = null;
        existingConversation = null;
      }

      if (!conversationId) {
        conversationId = createAIEntityId("conversation");
        const nextActiveConversation = { contextKey, id: conversationId };
        activeConversationRef.current = nextActiveConversation;
        setActiveConversation(nextActiveConversation);
      }

      if (
        existingConversation &&
        getMessageSignature(existingConversation.messages) ===
          getMessageSignature(messages)
      ) {
        return existingConversation;
      }

      const now = new Date().toISOString();
      const conversation = {
        id: conversationId,
        vehicleId: contextKey,
        title:
          existingConversation?.title ||
          createConversationTitle(firstUserMessage.content),
        messages,
        createdAt:
          existingConversation?.createdAt || firstUserMessage.createdAt || now,
        updatedAt: now,
      };
      const savedConversation = repository.saveConversation(conversation);

      if (savedConversation) {
        refreshConversations();
      }

      return savedConversation;
    },
    [contextKey, refreshConversations, repository],
  );

  return {
    activeConversationId:
      activeConversation.contextKey === contextKey
        ? activeConversation.id
        : null,
    conversations:
      history.contextKey === contextKey ? history.conversations : [],
    deleteConversation,
    loadConversation,
    persistMessages,
    refreshConversations,
    startNewConversation,
  };
}
