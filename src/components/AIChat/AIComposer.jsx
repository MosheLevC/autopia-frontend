import {
  ActionIcon,
  Box,
  Group,
  Loader,
  Paper,
  Text,
  Textarea,
} from "@mantine/core";
import { useState } from "react";

export default function AIComposer({ onSend, isResponding = false }) {
  const [draft, setDraft] = useState("");
  const canSend = draft.trim().length > 0 && !isResponding;

  const handleSend = () => {
    if (!canSend) return;

    const wasAccepted = onSend(draft);
    if (wasAccepted) {
      setDraft("");
    }
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent?.isComposing
    ) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box component="form" onSubmit={(event) => event.preventDefault()}>
      <Paper withBorder radius="lg" p={6} bg="white">
        <Group gap="xs" wrap="nowrap" align="flex-end">
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.currentTarget.value)}
            onKeyDown={handleKeyDown}
            disabled={isResponding}
            placeholder={
              isResponding ? "העוזר מכין תשובה..." : "כתבו שאלה על הרכב..."
            }
            aria-label="הודעה לעוזר AI"
            autosize
            minRows={1}
            maxRows={5}
            w="100%"
            styles={{
              input: {
                border: 0,
                background: "transparent",
                paddingInline: "0.75rem",
                paddingBlock: "0.65rem",
                lineHeight: 1.5,
              },
            }}
          />

          <ActionIcon
            type="button"
            size={40}
            radius="md"
            disabled={!canSend}
            onClick={handleSend}
            aria-label={isResponding ? "ממתין לתשובת העוזר" : "שליחת הודעה"}
            style={{ flexShrink: 0 }}
          >
            {isResponding ? (
              <Loader size="xs" color="gray" />
            ) : (
              <i
                className="ph-paper-plane-tilt-fill"
                aria-hidden="true"
                style={{ fontSize: "1.15rem" }}
              />
            )}
          </ActionIcon>
        </Group>
      </Paper>
      <Text size="xs" c="dimmed" ta="center" mt={4} visibleFrom="xs">
        Enter לשליחה · Shift+Enter לשורה חדשה
      </Text>
    </Box>
  );
}
