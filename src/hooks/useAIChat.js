import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createMockAIService } from "../services/ai/mockAIService";

const createMessage = (role, content) => ({
  id:
    globalThis.crypto?.randomUUID?.() ||
    `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  role,
  content,
  createdAt: new Date().toISOString(),
});

export default function useAIChat({
  vehicle,
  responseSource,
} = {}) {
  const contextKey = vehicle?._id || vehicle?.id || null;
  const mockResponseSource = useMemo(
    () =>
      createMockAIService({
        vehicleName: [vehicle?.manufacturer, vehicle?.model, vehicle?.year]
          .filter(Boolean)
          .join(" "),
        mileage: vehicle?.currentMileage,
      }),
    [
      vehicle?.currentMileage,
      vehicle?.manufacturer,
      vehicle?.model,
      vehicle?.year,
    ],
  );
  const activeResponseSource = responseSource || mockResponseSource;
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

  const sendMessage = useCallback(
    (rawContent) => {
      const content = String(rawContent || "").trim();
      if (!content || !contextKey) return false;
      if (respondingContextKeyRef.current === contextKey) return false;

      const userMessage = createMessage("user", content);
      const history =
        conversation.contextKey === contextKey ? conversation.messages : [];
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
          const response = await activeResponseSource.sendMessage({
            message: userMessage,
            history,
            vehicleId: contextKey,
          });

          if (
            requestIdRef.current !== requestId ||
            currentContextKeyRef.current !== contextKey
          ) {
            return;
          }

          const assistantMessage = createMessage("assistant", response.content);
          setConversation((current) => ({
            contextKey,
            messages:
              current.contextKey === contextKey
                ? [...current.messages, assistantMessage]
                : [assistantMessage],
          }));
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
    [activeResponseSource, contextKey, conversation],
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
  };
}
