import { Box, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import AIMessage from "./AIMessage";

export default function AIMessageList({ messages, isResponding }) {
  const viewportRef = useRef(null);
  const isTouchInteraction = useMediaQuery("(hover: none), (pointer: coarse)");
  const [revealedMessageId, setRevealedMessageId] = useState(null);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: messages.length > 1 ? "smooth" : "auto",
      });
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [messages.length, isResponding]);

  useEffect(() => {
    if (
      revealedMessageId &&
      !messages.some((message) => message.id === revealedMessageId)
    ) {
      setRevealedMessageId(null);
    }
  }, [messages, revealedMessageId]);

  const revealVehicleContext = (messageId, revealed) => {
    setRevealedMessageId((current) => {
      if (!revealed) {
        return current === messageId ? null : current;
      }

      return messageId;
    });
  };

  const toggleVehicleContext = (messageId) => {
    setRevealedMessageId((current) =>
      current === messageId ? null : messageId,
    );
  };

  return (
    <Box
      ref={viewportRef}
      className="ai-local-scroll"
      h="100%"
      role="log"
      aria-live="polite"
      aria-busy={isResponding}
      style={{ overflowY: "auto", overflowX: "hidden" }}
    >
      <Stack gap="md" px={{ base: 0, sm: "md" }} py="md">
        {messages.map((message) => (
          <AIMessage
            key={message.id}
            message={message}
            isTouchInteraction={Boolean(isTouchInteraction)}
            isVehicleContextRevealed={revealedMessageId === message.id}
            onVehicleContextReveal={revealVehicleContext}
            onVehicleContextToggle={toggleVehicleContext}
          />
        ))}

        {isResponding && (
          <AIMessage
            message={{ id: "assistant-loading", role: "assistant" }}
            isLoading
          />
        )}
      </Stack>
    </Box>
  );
}
