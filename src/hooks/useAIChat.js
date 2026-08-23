import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createMockAIService } from "../services/ai/mockAIService";
import { createAIEntityId } from "../utils/aiConversation";

const createMessage = (role, content) => ({
  id: createAIEntityId(role),
  role,
  content,
  createdAt: new Date().toISOString(),
});

export default function useAIChat({
  vehicle,
  responseSource,
  persistMessage,
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
          const persistedUserMessage = persistMessage
            ? await persistMessage(userMessage)
            : userMessage;

          if (
            requestIdRef.current !== requestId ||
            currentContextKeyRef.current !== contextKey
          ) {
            return;
          }

          setConversation((current) => ({
            contextKey,
            messages:
              current.contextKey === contextKey
                ? current.messages.map((message) =>
                    message.id === userMessage.id
                      ? persistedUserMessage
                      : message,
                  )
                : [persistedUserMessage],
          }));

          const response = await activeResponseSource.sendMessage({
            message: persistedUserMessage,
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
          const persistedAssistantMessage = persistMessage
            ? await persistMessage(assistantMessage)
            : assistantMessage;

          if (
            requestIdRef.current !== requestId ||
            currentContextKeyRef.current !== contextKey
          ) {
            return;
          }

          setConversation((current) => ({
            contextKey,
            messages:
              current.contextKey === contextKey
                ? [...current.messages, persistedAssistantMessage]
                : [persistedAssistantMessage],
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
    [activeResponseSource, contextKey, conversation, persistMessage],
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
