import { Box, Group, Loader, Paper, Text, ThemeIcon } from "@mantine/core";

const formatMessageTime = (createdAt) => {
  if (!createdAt) return "";

  return new Date(createdAt).toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AIMessage({ message, isLoading = false }) {
  const isUser = message.role === "user";
  const timestamp = formatMessageTime(message.createdAt);

  return (
    <Box
      w="100%"
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-start" : "flex-end",
        minWidth: 0,
      }}
    >
      <Group
        gap="xs"
        wrap="nowrap"
        align="flex-start"
        maw="min(82%, 42rem)"
        miw={0}
      >
        {!isUser && (
          <ThemeIcon size={32} radius="xl" variant="light" mt={2}>
            <i className="ph-sparkle-fill" aria-hidden="true" />
          </ThemeIcon>
        )}

        <Paper
          radius="xl"
          px="md"
          py="sm"
          bg={isUser ? "blue.6" : "white"}
          c={isUser ? "white" : "gray.9"}
          bd={isUser ? undefined : "1px solid var(--mantine-color-gray-2)"}
          shadow={isUser ? undefined : "xs"}
          miw={0}
          style={{
            borderRadius: isUser
              ? "18px 18px 6px 18px"
              : "18px 18px 18px 6px",
          }}
        >
          {isLoading ? (
            <Group gap="xs" wrap="nowrap" role="status">
              <Loader size="xs" />
              <Text size="sm" c="dimmed">
                חושב על זה...
              </Text>
            </Group>
          ) : (
            <Text
              size="sm"
              dir="auto"
              style={{
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
              }}
            >
              {message.content}
            </Text>
          )}

          {timestamp && (
            <Text
              size="xs"
              mt={4}
              ta="end"
              style={{
                color: isUser
                  ? "rgba(255, 255, 255, 0.72)"
                  : "var(--mantine-color-gray-5)",
              }}
            >
              {timestamp}
            </Text>
          )}
        </Paper>
      </Group>
    </Box>
  );
}
