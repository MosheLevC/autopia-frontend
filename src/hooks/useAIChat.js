import { useCallback, useEffect, useRef, useState } from "react";
import { createAIEntityId } from "../utils/aiConversation";

const createMessage = (role, content) => ({
  id: createAIEntityId(role),
  role,
  content,
  createdAt: new Date().toISOString(),
});

export default function useAIChat({ vehicle, sendTurn } = {}) {
  const contextKey = vehicle?._id || vehicle?.id || null;
  const [conversation, setConversation] = useState(() => ({
    contextKey,
    messages: [],
  }));
  const [responseState, setResponseState] = useState({
    contextKey: null,
    active: false,
  });
  const requestIdRef = useRef(0);
  const currentContextKeyRef = useRef(contextKey);
  const respondingContextKeyRef = useRef(null);
  const previousContextKeyRef = useRef(contextKey);

  currentContextKeyRef.current = contextKey;

  useEffect(() => {
    if (previousContextKeyRef.current === contextKey) return;

    previousContextKeyRef.current = contextKey;
    requestIdRef.current += 1;
    respondingContextKeyRef.current = null;
    setConversation({ contextKey, messages: [] });
    setResponseState({ contextKey: null, active: false });
  }, [contextKey]);

  const clearConversation = useCallback(() => {
    requestIdRef.current += 1;
    respondingContextKeyRef.current = null;
    setConversation({ contextKey, messages: [] });
    setResponseState({ contextKey: null, active: false });
  }, [contextKey]);

  const loadConversation = useCallback(
    (messages) => {
      requestIdRef.current += 1;
      respondingContextKeyRef.current = null;
      setConversation({
        contextKey,
        messages: Array.isArray(messages) ? messages : [],
      });
      setResponseState({ contextKey: null, active: false });
    },
    [contextKey],
  );

  const sendMessage = useCallback(
    (rawContent) => {
      const content = String(rawContent || "").trim();
      if (!content || !contextKey) return false;
      if (typeof sendTurn !== "function") return false;
      if (respondingContextKeyRef.current === contextKey) return false;

      const userMessage = createMessage("user", content);
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      respondingContextKeyRef.current = contextKey;

      setConversation((current) => ({
        contextKey,
        messages:
          current.contextKey === contextKey
            ? [...current.messages, userMessage]
            : [userMessage],
      }));
      setResponseState({ contextKey, active: true });

      const getAssistantResponse = async () => {
        try {
          const completedTurn = await sendTurn(content);

          if (
            requestIdRef.current !== requestId ||
            currentContextKeyRef.current !== contextKey
          ) {
            return;
          }

          setConversation((current) => {
            if (current.contextKey !== contextKey) return current;

            const optimisticIndex = current.messages.findIndex(
              (message) => message.id === userMessage.id,
            );
            if (optimisticIndex === -1) return current;

            const messages = [...current.messages];
            messages[optimisticIndex] = completedTurn.userMessage;

            if (
              !messages.some(
                (message) => message.id === completedTurn.assistantMessage.id,
              )
            ) {
              messages.push(completedTurn.assistantMessage);
            }

            return { contextKey, messages };
          });
        } catch {
          if (
            requestIdRef.current === requestId &&
            currentContextKeyRef.current === contextKey
          ) {
            setConversation((current) => ({
              contextKey,
              messages: [
                ...(current.contextKey === contextKey ? current.messages : []),
                createMessage(
                  "assistant",
                  "לא הצלחתי להכין תשובה כרגע. אפשר לנסות שוב בעוד רגע.",
                ),
              ],
            }));
          }
        } finally {
          if (
            requestIdRef.current === requestId &&
            currentContextKeyRef.current === contextKey
          ) {
            respondingContextKeyRef.current = null;
            setResponseState({ contextKey, active: false });
          }
        }
      };

      void getAssistantResponse();
      return true;
    },
    [contextKey, sendTurn],
  );

  const messages =
    conversation.contextKey === contextKey ? conversation.messages : [];
  const isResponding =
    responseState.contextKey === contextKey && responseState.active;

  return {
    messages,
    isResponding,
    sendMessage,
    clearConversation,
    loadConversation,
  };
}
