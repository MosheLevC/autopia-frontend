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
  cancelLabel = "ביטול",
  confirmColor = "red",
  confirmIcon: ConfirmIcon = Trash,
  icon: Icon = Warning,
  iconColor = "red",
  isDeleting = false,
  zIndex,
  children,
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
      zIndex={zIndex}
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
          {Icon && (
            <ThemeIcon
              color={iconColor}
              variant="light"
              size={44}
              radius="xl"
              style={{ flexShrink: 0 }}
            >
              <Icon size={24} aria-hidden="true" />
            </ThemeIcon>
          )}
          <Stack gap={4}>
            {message && (
              <Text fw={600} size="sm" c="gray.9">
                {message}
              </Text>
            )}
            {description && (
              <Text size="xs" c="dimmed" lh={1.5}>
                {description}
              </Text>
            )}
          </Stack>
        </Group>

        {children}

        <Group justify="flex-end" gap="xs">
          <Button
            variant="default"
            onClick={onClose}
            disabled={isDeleting}
            radius="md"
          >
            {cancelLabel}
          </Button>
          <Button
            color={confirmColor}
            onClick={onConfirm}
            loading={isDeleting}
            radius="md"
            leftSection={
              ConfirmIcon ? <ConfirmIcon size={18} aria-hidden="true" /> : undefined
            }
          >
            {confirmLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
