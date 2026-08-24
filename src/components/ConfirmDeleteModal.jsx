import { Button, Group, Modal, Stack, Text, ThemeIcon } from "@mantine/core";
import { Trash, Warning } from "@phosphor-icons/react";

export default function ConfirmDeleteModal({
  opened,
  onClose,
  onConfirm,
  title = "מחיקה",
  message = "האם אתה בטוח שברצונך למחוק פריט זה?",
  description = "פעולה זו הינה בלתי הפיכה והפריט יוסר לצמיתות.",
  confirmLabel = "אישור ומחיקה",
  isDeleting = false,
}) {
  return (
    <Modal
      opened={opened}
      onClose={() => !isDeleting && onClose()}
      title={
        <Text fw={700} size="md">
          {title}
        </Text>
      }
      centered
      radius="xl"
      closeOnClickOutside={!isDeleting}
      closeOnEscape={!isDeleting}
      withCloseButton={!isDeleting}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Stack gap="lg" pt="xs">
        <Group gap="md" align="flex-start" wrap="nowrap">
          <ThemeIcon
            color="red"
            variant="light"
            size={44}
            radius="xl"
            style={{ flexShrink: 0 }}
          >
            <Warning size={24} aria-hidden="true" />
          </ThemeIcon>
          <Stack gap={4}>
            <Text fw={600} size="sm" c="gray.9">
              {message}
            </Text>
            {description && (
              <Text size="xs" c="dimmed" lh={1.5}>
                {description}
              </Text>
            )}
          </Stack>
        </Group>

        <Group justify="flex-end" gap="xs">
          <Button
            variant="default"
            onClick={onClose}
            disabled={isDeleting}
            radius="md"
          >
            ביטול
          </Button>
          <Button
            color="red"
            onClick={onConfirm}
            loading={isDeleting}
            radius="md"
            leftSection={<Trash size={18} aria-hidden="true" />}
          >
            {confirmLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

