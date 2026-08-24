import { Box, Group, Loader, Paper, Text } from "@mantine/core";
import ReactMarkdown from "react-markdown";
import { formatLicensePlate } from "../../utils/plateUtils";

const assistantMarkdownElements = [
  "p",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "br",
];

const assistantMarkdownComponents = {
  p: ({ children }) => (
    <Text
      component="p"
      size="sm"
      m={0}
      mb="xs"
      style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
    >
      {children}
    </Text>
  ),
  strong: ({ children }) => (
    <Text component="strong" inherit fw={700}>
      {children}
    </Text>
  ),
  em: ({ children }) => (
    <Text component="em" inherit fs="italic">
      {children}
    </Text>
  ),
  ul: ({ children }) => (
    <Box component="ul" my="xs" ps="xl">
      {children}
    </Box>
  ),
  ol: ({ children }) => (
    <Box component="ol" my="xs" ps="xl">
      {children}
    </Box>
  ),
  li: ({ children }) => (
    <Text component="li" size="sm" mb={2}>
      {children}
    </Text>
  ),
};

const AssistantMarkdown = ({ content }) => (
  <Box dir="auto" fz="sm" style={{ overflowWrap: "anywhere" }}>
    <ReactMarkdown
      allowedElements={assistantMarkdownElements}
      components={assistantMarkdownComponents}
      skipHtml
      unwrapDisallowed
    >
      {content}
    </ReactMarkdown>
  </Box>
);

const formatMessageTime = (createdAt) => {
  if (!createdAt) return "";

  return new Date(createdAt).toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AIMessage({
  message,
  isLoading = false,
  isTouchInteraction = false,
  isVehicleContextRevealed = false,
  onVehicleContextReveal,
  onVehicleContextToggle,
}) {
  const isUser = message.role === "user";
  const timestamp = formatMessageTime(message.createdAt);
  const focusedVehicle = isUser ? message.focusedVehicle : null;
  const vehicleName = focusedVehicle
    ? [focusedVehicle.manufacturer, focusedVehicle.model]
        .filter(Boolean)
        .join(" ")
    : "";
  const vehicleContextLabel = focusedVehicle
    ? `${vehicleName} · ${formatLicensePlate(focusedVehicle.licensePlate)}`
    : "";
  const vehicleContextHandlers = focusedVehicle
    ? {
        onMouseEnter: () => {
          if (!isTouchInteraction) {
            onVehicleContextReveal?.(message.id, true);
          }
        },
        onMouseLeave: () => {
          if (!isTouchInteraction) {
            onVehicleContextReveal?.(message.id, false);
          }
        },
        onClick: () => {
          if (isTouchInteraction) {
            onVehicleContextToggle?.(message.id);
          }
        },
      }
    : {};

  return (
    <Box
      w="100%"
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-start" : "flex-end",
        minWidth: 0,
      }}
    >
      <Box
        maw={{ base: "90%", sm: "min(78%, 40rem)" }}
        miw={0}
        w={isUser ? "fit-content" : undefined}
        {...vehicleContextHandlers}
        aria-expanded={
          focusedVehicle && isTouchInteraction
            ? isVehicleContextRevealed
            : undefined
        }
      >
        <Paper
          radius="lg"
          px="md"
          py="sm"
          w={isUser ? "fit-content" : undefined}
          maw={isUser ? "100%" : undefined}
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
          ) : isUser ? (
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
          ) : (
            <AssistantMarkdown content={message.content} />
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

        {focusedVehicle && isVehicleContextRevealed && (
          <Text
            size="xs"
            c="dimmed"
            mt={4}
            px="xs"
            dir="auto"
            style={{ overflowWrap: "anywhere" }}
          >
            {vehicleContextLabel}
          </Text>
        )}
      </Box>
    </Box>
  );
}
