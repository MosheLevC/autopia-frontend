import { Box, Stack } from "@mantine/core";
import { useEffect, useRef } from "react";
import AIMessage from "./AIMessage";

export default function AIMessageList({ messages, isResponding }) {
  const viewportRef = useRef(null);

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
          <AIMessage key={message.id} message={message} />
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
