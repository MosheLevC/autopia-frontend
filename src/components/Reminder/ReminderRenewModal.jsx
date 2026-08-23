import {
  Badge,
  Button,
  Card,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  calculateRenewedDate,
  formatHebrewDate,
  getReminderFrequencyInfo,
  getReminderTypeInfo,
} from "../../constants/reminderConstants";

export default function ReminderRenewModal({
  opened,
  onClose,
  onConfirm,
  reminder,
  vehicle,
  isRenewing = false,
}) {
  if (!reminder) return null;

  const typeInfo = getReminderTypeInfo(reminder.type);
  const frequencyInfo = getReminderFrequencyInfo(reminder.frequency);
  const currentFormatted = formatHebrewDate(reminder.dueDate);
  const nextDate = calculateRenewedDate(reminder.dueDate, reminder.frequency);
  const nextFormatted = formatHebrewDate(nextDate);

  return (
    <Modal
      opened={opened}
      onClose={() => !isRenewing && onClose()}
      title={
        <Text fw={700} size="md">
          חידוש תזכורת
        </Text>
      }
      centered
      radius="xl"
      closeOnClickOutside={!isRenewing}
      closeOnEscape={!isRenewing}
      withCloseButton={!isRenewing}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Stack gap="lg" pt="xs">
        <Group gap="md" align="flex-start" wrap="nowrap">
          <ThemeIcon
            color="blue"
            variant="light"
            size={44}
            radius="xl"
            style={{ flexShrink: 0 }}
          >
            <i
              className="ph-arrows-clockwise"
              style={{ fontSize: "1.5rem" }}
              aria-hidden="true"
            />
          </ThemeIcon>
          <Stack gap={4}>
            <Text fw={600} size="sm" c="gray.9">
              חידוש {reminder.title || typeInfo.label}
            </Text>
            <Text size="xs" c="dimmed" lh={1.5}>
              תאריך היעד יתעדכן קדימה בהתאם לתדירות ({frequencyInfo.shortLabel}).
            </Text>
          </Stack>
        </Group>

        <Card withBorder radius="lg" p="md" bg="gray.0">
          <SimpleGrid cols={2} spacing="md">
            <Stack gap={2}>
              <Text size="xs" c="dimmed" fw={500}>
                תאריך נוכחי
              </Text>
              <Text size="sm" fw={600} c="gray.8">
                {currentFormatted}
              </Text>
            </Stack>

            <Stack gap={2}>
              <Text size="xs" c="dimmed" fw={500}>
                תאריך חדש לאחר חידוש
              </Text>
              <Group gap="xs">
                <Text size="sm" fw={700} c="blue.7">
                  {nextFormatted}
                </Text>
                <Badge size="xs" color="blue" variant="light">
                  +{frequencyInfo.months} חודשים
                </Badge>
              </Group>
            </Stack>
          </SimpleGrid>
        </Card>

        {vehicle && (
          <Text size="xs" c="dimmed" ta="center">
            עבור: {vehicle.manufacturer} {vehicle.model} ({vehicle.licensePlate})
          </Text>
        )}

        <Group justify="flex-end" gap="xs">
          <Button
            variant="default"
            onClick={onClose}
            disabled={isRenewing}
            radius="md"
          >
            ביטול
          </Button>
          <Button
            color="blue"
            onClick={onConfirm}
            loading={isRenewing}
            radius="md"
            leftSection={
              <i className="ph-arrows-clockwise" aria-hidden="true" />
            }
          >
            אישור וחידוש תזכורת
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
