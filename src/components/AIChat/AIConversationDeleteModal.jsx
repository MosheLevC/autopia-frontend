import { Button, Group, Modal, Stack, Text } from "@mantine/core";

export default function AIConversationDeleteModal({
  conversation,
  isDeleting = false,
  onClose,
  onConfirm,
}) {
  const opened = Boolean(conversation);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700} size="md">
          מחיקת שיחה
        </Text>
      }
      centered
      size="sm"
      radius="lg"
      padding={{ base: "md", sm: "lg" }}
      zIndex={230}
      removeScrollProps={{ removeScrollBar: false }}
    >
      <Stack gap="lg">
        <Stack gap={4}>
          <Text size="sm" fw={600}>
            האם למחוק את השיחה הזו?
          </Text>
          <Text size="sm" c="dimmed">
            לא ניתן לשחזר אותה לאחר המחיקה.
          </Text>
        </Stack>

        {conversation?.title && (
          <Text
            size="sm"
            fw={650}
            p="sm"
            bg="gray.0"
            bd="1px solid var(--mantine-color-gray-2)"
            style={{ borderRadius: "var(--mantine-radius-md)" }}
            dir="auto"
          >
            {conversation.title}
          </Text>
        )}

        <Group justify="flex-end" gap="xs">
          <Button
            type="button"
            variant="default"
            disabled={isDeleting}
            onClick={onClose}
          >
            ביטול
          </Button>
          <Button
            type="button"
            color="red"
            loading={isDeleting}
            onClick={onConfirm}
            leftSection={<i className="ph-trash" aria-hidden="true" />}
          >
            מחיקה
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
