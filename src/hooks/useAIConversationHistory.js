import { useCallback, useEffect, useRef, useState } from "react";
import { conversationRepository } from "../services/ai/conversationRepository";
import { createConversationTitle } from "../utils/aiConversation";

const sortByRecentActivity = (conversations) =>
  [...conversations].sort(
    (first, second) =>
      new Date(second.lastMessageAt).getTime() -
      new Date(first.lastMessageAt).getTime(),
  );

export default function useAIConversationHistory({
  vehicleId,
  repository = conversationRepository,
}) {
  const contextKey = vehicleId ? String(vehicleId) : null;
  const contextKeyRef = useRef(contextKey);
  const activeConversationRef = useRef({ contextKey, id: null });
  const operationVersionRef = useRef(0);
  const historyRequestIdRef = useRef(0);
  const [activeConversation, setActiveConversation] = useState({
    contextKey,
    id: null,
  });
  const [history, setHistory] = useState({
    contextKey,
    conversations: [],
  });

  contextKeyRef.current = contextKey;

  const setActiveConversationRecord = useCallback((record) => {
    activeConversationRef.current = record;
    setActiveConversation(record);
  }, []);

  const refreshConversations = useCallback(async () => {
    const requestId = historyRequestIdRef.current + 1;
    historyRequestIdRef.current = requestId;

    if (!contextKey) {
      setHistory({ contextKey, conversations: [] });
      return [];
    }

    try {
      const conversations = await repository.listConversations(contextKey);

      if (
        historyRequestIdRef.current !== requestId ||
        contextKeyRef.current !== contextKey
      ) {
        return [];
      }

      setHistory({ contextKey, conversations });
      return conversations;
    } catch {
      if (
        historyRequestIdRef.current === requestId &&
        contextKeyRef.current === contextKey
      ) {
        setHistory({ contextKey, conversations: [] });
      }

      return [];
    }
  }, [contextKey, repository]);

  useEffect(() => {
    operationVersionRef.current += 1;
    setActiveConversationRecord({ contextKey, id: null });
    setHistory({ contextKey, conversations: [] });
    void refreshConversations();
  }, [contextKey, refreshConversations, setActiveConversationRecord]);

  const startNewConversation = useCallback(() => {
    operationVersionRef.current += 1;
    setActiveConversationRecord({ contextKey, id: null });
  }, [contextKey, setActiveConversationRecord]);

  const loadConversation = useCallback(
    async (conversationId) => {
      if (!contextKey) return null;

      const operationVersion = operationVersionRef.current + 1;
      operationVersionRef.current = operationVersion;

      try {
        const conversation = await repository.getConversation(conversationId);

        if (
          operationVersionRef.current !== operationVersion ||
          contextKeyRef.current !== contextKey ||
          conversation.vehicleId !== contextKey
        ) {
          return null;
        }

        setActiveConversationRecord({
          contextKey,
          id: conversation.id,
        });
        return conversation;
      } catch {
        return null;
      }
    },
    [contextKey, repository, setActiveConversationRecord],
  );

  const persistMessage = useCallback(
    async ({ role, content }) => {
      if (!contextKey) {
        throw new Error("A vehicle is required to persist a conversation");
      }

      const operationVersion = operationVersionRef.current;
      const activeRecord = activeConversationRef.current;
      let conversationId =
        activeRecord.contextKey === contextKey ? activeRecord.id : null;
      let createdConversation = null;

      if (!conversationId) {
        if (role !== "user") {
          throw new Error("A conversation must begin with a user message");
        }

        createdConversation = await repository.createConversation({
          title: createConversationTitle(content),
          vehicleId: contextKey,
        });
        conversationId = createdConversation.id;

        if (
          operationVersionRef.current === operationVersion &&
          contextKeyRef.current === contextKey
        ) {
          setActiveConversationRecord({ contextKey, id: conversationId });
          setHistory((current) => {
            if (current.contextKey !== contextKey) return current;

            const conversations = current.conversations.filter(
              (conversation) => conversation.id !== conversationId,
            );

            return {
              contextKey,
              conversations: sortByRecentActivity([
                createdConversation,
                ...conversations,
              ]),
            };
          });
        }
      }

      const message = await repository.appendMessage(conversationId, {
        role,
        content,
      });

      if (
        operationVersionRef.current === operationVersion &&
        contextKeyRef.current === contextKey
      ) {
        setHistory((current) => {
          if (current.contextKey !== contextKey) return current;

          const existingConversation = current.conversations.find(
            (conversation) => conversation.id === conversationId,
          );
          const conversation = {
            ...(createdConversation || existingConversation),
            id: conversationId,
            vehicleId: contextKey,
            lastMessageAt: message.createdAt,
            updatedAt: message.createdAt,
          };
          const conversations = current.conversations.filter(
            (item) => item.id !== conversationId,
          );

          return {
            contextKey,
            conversations: sortByRecentActivity([
              conversation,
              ...conversations,
            ]),
          };
        });
      }

      return message;
    },
    [contextKey, repository, setActiveConversationRecord],
  );

  const deleteConversation = useCallback(
    async (conversationId) => {
      if (!conversationId) return { deleted: false, wasActive: false };

      try {
        await repository.deleteConversation(conversationId);
      } catch {
        return { deleted: false, wasActive: false };
      }

      const activeRecord = activeConversationRef.current;
      const wasActive = activeRecord.id === conversationId;

      if (wasActive) {
        operationVersionRef.current += 1;
        setActiveConversationRecord({ contextKey, id: null });
      }

      setHistory((current) => ({
        ...current,
        conversations: current.conversations.filter(
          (conversation) => conversation.id !== conversationId,
        ),
      }));

      return { deleted: true, wasActive };
    },
    [contextKey, repository, setActiveConversationRecord],
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
    persistMessage,
    refreshConversations,
    startNewConversation,
  };
}
