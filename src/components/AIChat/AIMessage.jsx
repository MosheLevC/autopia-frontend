import { Box, Group, Loader, Paper, Text } from "@mantine/core";

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
        maw={{ base: "90%", sm: "min(78%, 40rem)" }}
        miw={0}
      >
        <Paper
          radius="lg"
          px="md"
          py="sm"
          bg={isUser ? "blue.6" : "white"}
          c={isUser ? "white" : "gray.9"}
          bd={isUser ? undefined : "1px solid var(--mantine-color-gray-2)"}
          miw={0}
          style={{
            borderRadius: isUser
              ? "16px 16px 5px 16px"
              : "14px 14px 14px 4px",
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
