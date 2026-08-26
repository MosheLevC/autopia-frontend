import { useCallback, useRef, useState } from "react";
import { createAIEntityId } from "../utils/aiConversation";

const CHAT_ERROR_MESSAGES = Object.freeze({
  generic: "לא הצלחתי להכין תשובה כרגע. אפשר לנסות שוב בעוד רגע.",
  network: "לא ניתן להתחבר לשרת כרגע. נסה שוב בעוד רגע.",
  rateLimit: "יש כרגע עומס על שירות ה-AI. נסה שוב בעוד רגע.",
  timeout: "התשובה לוקחת יותר מהרגיל. נסה שוב בעוד רגע.",
});

export const getChatErrorMessage = (error) => {
  if (
    error?.isTimeout === true ||
    error?.status === 408 ||
    error?.status === 504
  ) {
    return CHAT_ERROR_MESSAGES.timeout;
  }

  if (error?.isNetworkError === true) {
    return CHAT_ERROR_MESSAGES.network;
  }

  if (error?.status === 429) {
    return CHAT_ERROR_MESSAGES.rateLimit;
  }

  return CHAT_ERROR_MESSAGES.generic;
};

const createMessage = (role, content) => ({
  id: createAIEntityId(role),
  role,
  content,
  createdAt: new Date().toISOString(),
});

export default function useAIChat({ sendTurn } = {}) {
  const [messages, setMessages] = useState([]);
  const [isResponding, setIsResponding] = useState(false);
  const requestIdRef = useRef(0);
  const isRespondingRef = useRef(false);

  const clearConversation = useCallback(() => {
    requestIdRef.current += 1;
    isRespondingRef.current = false;
    setMessages([]);
    setIsResponding(false);
  }, []);

  const loadConversation = useCallback((storedMessages) => {
    requestIdRef.current += 1;
    isRespondingRef.current = false;
    setMessages(Array.isArray(storedMessages) ? storedMessages : []);
    setIsResponding(false);
  }, []);

  const sendMessage = useCallback(
    (rawContent) => {
      const content = String(rawContent || "").trim();
      if (!content || typeof sendTurn !== "function") return false;
      if (isRespondingRef.current) return false;

      const userMessage = createMessage("user", content);
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      isRespondingRef.current = true;

      setMessages((current) => [...current, userMessage]);
      setIsResponding(true);

      const getAssistantResponse = async () => {
        try {
          const completedTurn = await sendTurn(content);

          if (requestIdRef.current !== requestId) {
            return;
          }

          setMessages((current) => {
            const optimisticIndex = current.findIndex(
              (message) => message.id === userMessage.id,
            );
            if (optimisticIndex === -1) return current;

            const nextMessages = [...current];
            nextMessages[optimisticIndex] = completedTurn.userMessage;

            if (
              !nextMessages.some(
                (message) => message.id === completedTurn.assistantMessage.id,
              )
            ) {
              nextMessages.push(completedTurn.assistantMessage);
            }

            return nextMessages;
          });
        } catch (error) {
          if (requestIdRef.current === requestId) {
            setMessages((current) => [
              ...current,
              createMessage("assistant", getChatErrorMessage(error)),
            ]);
          }
        } finally {
          if (requestIdRef.current === requestId) {
            isRespondingRef.current = false;
            setIsResponding(false);
          }
        }
      };

      void getAssistantResponse();
      return true;
    },
    [sendTurn],
  );

  return {
    messages,
    isResponding,
    sendMessage,
    clearConversation,
    loadConversation,
  };
}
