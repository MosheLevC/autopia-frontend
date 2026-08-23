import {
  ActionIcon,
  Box,
  Center,
  Drawer,
  Group,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { formatConversationTimestamp } from "../../utils/aiConversation";

export default function AIConversationHistory({
  opened,
  onClose,
  conversations,
  activeConversationId,
  onConversationSelect,
}) {
  const isMobile = useMediaQuery("(max-width: 47.99em)");

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size={isMobile ? "100%" : 360}
      padding={0}
      radius={0}
      zIndex={210}
      withCloseButton={false}
      overlayProps={{ backgroundOpacity: isMobile ? 0 : 0.14 }}
      styles={{
        content: {
          display: "flex",
          flexDirection: "column",
        },
        body: {
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          padding: 0,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Group
        component="header"
        justify="space-between"
        wrap="nowrap"
        px={{ base: "md", sm: "lg" }}
        h="var(--app-header-height)"
        bdb="1px solid var(--mantine-color-gray-2)"
        style={{ flexShrink: 0 }}
      >
        <Group gap="xs" wrap="nowrap">
          <ThemeIcon variant="light" color="gray" radius="md" size="md">
            <i className="ph-clock-counter-clockwise" aria-hidden="true" />
          </ThemeIcon>
          <Text fw={700} size="lg">
            שיחות קודמות
          </Text>
        </Group>

        <ActionIcon
          type="button"
          variant="subtle"
          color="gray"
          size={40}
          radius="md"
          onClick={onClose}
          aria-label={isMobile ? "חזרה לצ׳אט" : "סגירת שיחות קודמות"}
        >
          <i
            className={isMobile ? "ph-arrow-right" : "ph-x"}
            aria-hidden="true"
            style={{ fontSize: "1.2rem" }}
          />
        </ActionIcon>
      </Group>

      <Box style={{ flex: 1, minHeight: 0, overflow: "hidden" }} p="md">
        {conversations.length === 0 ? (
          <Center h="100%" mih={180} px="md">
            <Stack align="center" gap="xs" ta="center">
              <ThemeIcon size={44} radius="md" variant="light" color="gray">
                <i
                  className="ph-chat-circle-dots"
                  aria-hidden="true"
                  style={{ fontSize: "1.35rem" }}
                />
              </ThemeIcon>
              <Text size="sm" c="dimmed">
                אין שיחות קודמות לרכב הזה
              </Text>
            </Stack>
          </Center>
        ) : (
          <ScrollArea h="100%" type="auto" offsetScrollbars>
            <Stack gap="xs" pb="md">
              {conversations.map((conversation) => {
                const isActive = conversation.id === activeConversationId;

                return (
                  <UnstyledButton
                    key={conversation.id}
                    type="button"
                    w="100%"
                    onClick={() => onConversationSelect(conversation.id)}
                    aria-current={isActive ? "true" : undefined}
                    aria-label={`טעינת השיחה: ${conversation.title}`}
                    className="ai-history-item"
                    data-active={isActive ? "true" : undefined}
                    p="sm"
                    style={{ borderRadius: "var(--mantine-radius-md)" }}
                  >
                    <Group gap="sm" wrap="nowrap" align="flex-start">
                      <Box style={{ flex: 1, minWidth: 0 }}>
                        <Text
                          size="sm"
                          fw={650}
                          lineClamp={2}
                          dir="auto"
                          style={{ overflowWrap: "anywhere" }}
                        >
                          {conversation.title}
                        </Text>
                        <Text size="xs" c="dimmed" mt={4}>
                          {formatConversationTimestamp(
                            conversation.updatedAt,
                          )}
                        </Text>
                      </Box>
                      <i
                        className="ph-caret-left"
                        aria-hidden="true"
                        style={{
                          color: "var(--mantine-color-gray-5)",
                          marginTop: 4,
                          flexShrink: 0,
                        }}
                      />
                    </Group>
                  </UnstyledButton>
                );
              })}
            </Stack>
          </ScrollArea>
        )}
      </Box>
    </Drawer>
  );
}
