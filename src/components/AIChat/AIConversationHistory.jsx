import {
  ActionIcon,
  Box,
  Center,
  Drawer,
  Group,
  Menu,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import {
  ArrowRight,
  ChatCircleDots,
  ClockCounterClockwise,
  DotsThreeVertical,
  Trash,
  X,
} from "@phosphor-icons/react";
import { formatConversationTimestamp } from "../../utils/aiConversation";
import ConfirmDeleteModal from "../ConfirmDeleteModal";

export default function AIConversationHistory({
  opened,
  onClose,
  conversations,
  activeConversationId,
  onConversationSelect,
  onConversationDelete,
}) {
  const isMobile = useMediaQuery("(max-width: 47.99em)");
  const [conversationToDelete, setConversationToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClose = () => {
    if (isDeleting) return;

    setConversationToDelete(null);
    onClose();
  };

  const handleDeleteConfirm = async () => {
    if (!conversationToDelete || isDeleting) return;

    setIsDeleting(true);

    try {
      const deleted = await onConversationDelete(conversationToDelete.id);
      if (deleted) {
        setConversationToDelete(null);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Drawer
        opened={opened}
        onClose={handleClose}
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
              <ClockCounterClockwise size={18} aria-hidden="true" />
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
            onClick={handleClose}
            aria-label={isMobile ? "חזרה לצ׳אט" : "סגירת שיחות קודמות"}
          >
            {isMobile ? (
              <ArrowRight size={20} aria-hidden="true" />
            ) : (
              <X size={20} aria-hidden="true" />
            )}
          </ActionIcon>
        </Group>

        <Box style={{ flex: 1, minHeight: 0, overflow: "hidden" }} p="md">
          {conversations.length === 0 ? (
            <Center h="100%" mih={180} px="md">
              <Stack align="center" gap="xs" ta="center">
                <ThemeIcon size={44} radius="md" variant="light" color="gray">
                  <ChatCircleDots size={24} aria-hidden="true" />
                </ThemeIcon>
                <Text size="sm" c="dimmed">
                  אין שיחות קודמות לרכב הזה
                </Text>
              </Stack>
            </Center>
          ) : (
            <ScrollArea
              h="100%"
              type="auto"
              offsetScrollbars
              scrollbarSize={5}
              classNames={{ viewport: "ai-local-scroll" }}
            >
              <Stack gap="xs" pb="md">
                {conversations.map((conversation) => {
                  const isActive = conversation.id === activeConversationId;

                  return (
                    <Box
                      key={conversation.id}
                      className="ai-history-item"
                      data-active={isActive ? "true" : undefined}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "var(--mantine-radius-md)",
                      }}
                    >
                      <UnstyledButton
                        type="button"
                        onClick={() => onConversationSelect(conversation.id)}
                        aria-current={isActive ? "true" : undefined}
                        aria-label={`טעינת השיחה: ${conversation.title}`}
                        p="sm"
                        style={{ flex: 1, minWidth: 0, alignSelf: "stretch" }}
                      >
                        <Box style={{ minWidth: 0 }}>
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
                      </UnstyledButton>

                      <Menu position="bottom-start" width={150} shadow="md">
                        <Menu.Target>
                          <ActionIcon
                            type="button"
                            variant="subtle"
                            color="gray"
                            size={36}
                            radius="md"
                            me="xs"
                            className="ai-history-menu"
                            aria-label={`פעולות עבור השיחה: ${conversation.title}`}
                          >
                            <DotsThreeVertical size={20} aria-hidden="true" />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown dir="rtl">
                          <Menu.Item
                            color="red"
                            leftSection={<Trash size={16} aria-hidden="true" />}
                            onClick={() =>
                              setConversationToDelete(conversation)
                            }
                          >
                            מחק שיחה
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Box>
                  );
                })}
              </Stack>
            </ScrollArea>
          )}
        </Box>
      </Drawer>

      <ConfirmDeleteModal
        opened={Boolean(conversationToDelete)}
        onClose={() => setConversationToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="מחיקת שיחה"
        message="האם למחוק את השיחה הזו?"
        description="לא ניתן לשחזר אותה לאחר המחיקה."
        confirmLabel="מחיקה"
        isDeleting={isDeleting}
        zIndex={230}
      >
        {conversationToDelete?.title && (
          <Text
            size="sm"
            fw={650}
            p="sm"
            bg="gray.0"
            bd="1px solid var(--mantine-color-gray-2)"
            style={{ borderRadius: "var(--mantine-radius-md)" }}
            dir="auto"
          >
            {conversationToDelete.title}
          </Text>
        )}
      </ConfirmDeleteModal>
    </>
  );
}
