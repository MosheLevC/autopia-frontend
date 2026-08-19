import { Button, Group, Modal, Stack, Text, ThemeIcon } from "@mantine/core";

export default function MaintenanceDeleteModal({
  opened,
  onClose,
  onConfirm,
  isDeleting,
}) {
  return (
    <Modal
      opened={opened}
      onClose={() => !isDeleting && onClose()}
      title={
        <Text fw={700} size="md">
          מחיקת טיפול
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
          <ThemeIcon color="red" variant="light" size={44} radius="xl" style={{ flexShrink: 0 }}>
            <i className="ph-warning" style={{ fontSize: "1.5rem" }} aria-hidden="true" />
          </ThemeIcon>
          <Stack gap={4}>
            <Text fw={600} size="sm" c="gray.9">
              האם אתה בטוח שברצונך למחוק טיפול זה?
            </Text>
            <Text size="xs" c="dimmed" lh={1.5}>
              פעולה זו הינה בלתי הפיכה והטיפול יוסר לצמיתות מיומן הטיפולים של הרכב.
            </Text>
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
            leftSection={<i className="ph-trash" aria-hidden="true" />}
          >
            אישור ומחיקה
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
