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
  const focusedVehicleId = vehicleId ? String(vehicleId) : null;
  const focusedVehicleIdRef = useRef(focusedVehicleId);
  const activeConversationRef = useRef(null);
  const operationVersionRef = useRef(0);
  const historyRequestIdRef = useRef(0);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);

  focusedVehicleIdRef.current = focusedVehicleId;

  const setActiveConversation = useCallback((conversationId) => {
    activeConversationRef.current = conversationId;
    setActiveConversationId(conversationId);
  }, []);

  const refreshConversations = useCallback(async () => {
    const requestId = historyRequestIdRef.current + 1;
    historyRequestIdRef.current = requestId;

    try {
      const records = await repository.listConversations();

      if (historyRequestIdRef.current !== requestId) {
        return [];
      }

      setConversations(records);
      return records;
    } catch {
      if (historyRequestIdRef.current === requestId) {
        setConversations([]);
      }

      return [];
    }
  }, [repository]);

  useEffect(() => {
    void refreshConversations();
  }, [refreshConversations]);

  const startNewConversation = useCallback(() => {
    operationVersionRef.current += 1;
    setActiveConversation(null);
  }, [setActiveConversation]);

  const loadConversation = useCallback(
    async (conversationId) => {
      const operationVersion = operationVersionRef.current + 1;
      operationVersionRef.current = operationVersion;

      try {
        const conversation = await repository.getConversation(conversationId);

        if (operationVersionRef.current !== operationVersion) {
          return null;
        }

        setActiveConversation(conversation.id);
        return conversation;
      } catch {
        return null;
      }
    },
    [repository, setActiveConversation],
  );

  const sendMessage = useCallback(
    async (content) => {
      const currentFocusedVehicleId = focusedVehicleIdRef.current;

      if (!currentFocusedVehicleId) {
        throw new Error("A vehicle is required to send a message");
      }

      const operationVersion = operationVersionRef.current;
      const conversationId = activeConversationRef.current;

      try {
        const result = await repository.sendMessage({
          message: content,
          vehicleId: currentFocusedVehicleId,
          ...(conversationId
            ? { conversationId }
            : { title: createConversationTitle(content) }),
        });

        if (
          !conversationId &&
          result.conversation.vehicleId !== currentFocusedVehicleId
        ) {
          throw new Error("Chat response vehicle does not match active vehicle");
        }

        if (operationVersionRef.current === operationVersion) {
          setActiveConversation(result.conversation.id);
          setConversations((current) => {
            const withoutCurrent = current.filter(
              (conversation) => conversation.id !== result.conversation.id,
            );

            return sortByRecentActivity([
              result.conversation,
              ...withoutCurrent,
            ]);
          });
        }

        return result;
      } catch (error) {
        if (operationVersionRef.current === operationVersion) {
          void refreshConversations();
        }

        throw error;
      }
    },
    [refreshConversations, repository, setActiveConversation],
  );

  const deleteConversation = useCallback(
    async (conversationId) => {
      if (!conversationId) return { deleted: false, wasActive: false };

      try {
        await repository.deleteConversation(conversationId);
      } catch {
        return { deleted: false, wasActive: false };
      }

      const wasActive = activeConversationRef.current === conversationId;

      if (wasActive) {
        operationVersionRef.current += 1;
        setActiveConversation(null);
      }

      setConversations((current) =>
        current.filter((conversation) => conversation.id !== conversationId),
      );

      return { deleted: true, wasActive };
    },
    [repository, setActiveConversation],
  );

  return {
    activeConversationId,
    conversations,
    deleteConversation,
    loadConversation,
    refreshConversations,
    sendMessage,
    startNewConversation,
  };
}
