import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  ArrowsClockwise,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react";
import {
  formatHebrewDate,
  getReminderFrequencyInfo,
  getReminderStatus,
  getReminderTypeInfo,
} from "../../constants/reminderConstants";

export default function ReminderCard({
  reminder,
  vehicleId,
  onRenewClick,
  onDeleteClick,
  onDetailClick,
  compact = false,
}) {
  const navigate = useNavigate();

  if (!reminder) return null;

  const typeInfo = getReminderTypeInfo(reminder.type);
  const TypeIcon = typeInfo.icon;
  const frequencyInfo = getReminderFrequencyInfo(reminder.frequency);
  const status = getReminderStatus(reminder.dueDate);
  const formattedDate = formatHebrewDate(reminder.dueDate);

  const handleEditClick = () => {
    if (vehicleId && reminder._id) {
      navigate(`/vehicles/${vehicleId}/reminders/${reminder._id}/edit`);
    }
  };

  const handleDetailClick = () => {
    if (onDetailClick) {
      onDetailClick(reminder);
    } else if (vehicleId) {
      navigate(`/vehicles/${vehicleId}/reminders`);
    }
  };

  if (compact) {
    return (
      <Paper
        withBorder
        radius="lg"
        p="md"
        bg="white"
        shadow="xs"
        h="100%"
      >
        <Stack justify="space-between" h="100%" gap="xs">
          <Stack gap="xs">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Group gap="sm" align="center" wrap="nowrap">
                <ThemeIcon
                  size={40}
                  radius="md"
                  variant="light"
                  color="blue"
                  style={{ flexShrink: 0 }}
                >
                  {TypeIcon ? (
                    <TypeIcon size={20} aria-hidden="true" />
                  ) : null}
                </ThemeIcon>
                <Stack gap={1}>
                  <Text size="sm" fw={700} c="gray.9">
                    {reminder.title || typeInfo.label}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {typeInfo.subtitle}
                  </Text>
                </Stack>
              </Group>

              <Badge
                size="sm"
                radius="md"
                variant={status.badgeVariant}
                color={status.color}
              >
                {status.statusLabel}
              </Badge>
            </Group>

            <Divider color="gray.2" />

            <Group justify="space-between" align="center" wrap="wrap" gap="xs">
              <Group gap="xs" align="center">
                <Text size="xs" c="dimmed" fw={500}>
                  תאריך יעד:
                </Text>
                <Text size="sm" fw={700} c="gray.9">
                  {formattedDate}
                </Text>
              </Group>

              <Badge size="xs" variant="dot" color={status.color}>
                {status.countdownText}
              </Badge>
            </Group>
          </Stack>

          <Group justify="space-between" align="center" pt="xs" mt="xs">
            <Button
              variant="subtle"
              color="gray"
              size="xs"
              radius="md"
              onClick={handleDetailClick}
              rightSection={<ArrowLeft size={14} aria-hidden="true" />}
            >
              פרטי תזכורת
            </Button>

            {status.canRenew && onRenewClick && (
              <Button
                variant="light"
                color={status.color === "red" ? "red" : "blue"}
                size="xs"
                radius="md"
                onClick={() => onRenewClick(reminder)}
                leftSection={<ArrowsClockwise size={16} aria-hidden="true" />}
              >
                חדש תזכורת
              </Button>
            )}
          </Group>
        </Stack>
      </Paper>
    );
  }

  return (
    <Card
      withBorder
      radius="xl"
      shadow="xs"
      p={{ base: "md", sm: "xl" }}
      bg="white"
      h="100%"
      mih={{ base: "auto", sm: 220 }}
    >
      <Stack gap="lg" justify="space-between" h="100%">
        <Stack gap="md">
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Group gap="sm" align="center" wrap="nowrap">
              <ThemeIcon
                size={48}
                radius="xl"
                variant="light"
                color="blue"
                style={{ flexShrink: 0 }}
              >
                {TypeIcon ? (
                  <TypeIcon size={24} aria-hidden="true" />
                ) : null}
              </ThemeIcon>

              <Stack gap={2}>
                <Group gap="xs" align="center">
                  <Text fw={700} size="lg" c="gray.9">
                    {reminder.title || typeInfo.label}
                  </Text>
                  {reminder.title && reminder.title !== typeInfo.label && (
                    <Badge size="xs" variant="outline" color="gray">
                      {typeInfo.label}
                    </Badge>
                  )}
                </Group>
                <Text size="sm" c="dimmed">
                  {typeInfo.subtitle}
                </Text>
              </Stack>
            </Group>

            <Badge
              size="md"
              radius="md"
              variant={status.badgeVariant}
              color={status.color}
            >
              {status.statusLabel}
            </Badge>
          </Group>

          <Divider color="gray.2" />

          <Group justify="space-between" align="center" wrap="wrap" gap="sm">
            <Stack gap={2}>
              <Text size="xs" c="dimmed" fw={500}>
                תאריך יעד
              </Text>
              <Group gap="xs" align="center">
                <Text fw={700} size="md" c="gray.9">
                  {formattedDate}
                </Text>
                <Badge size="sm" variant="dot" color={status.color}>
                  {status.countdownText}
                </Badge>
              </Group>
            </Stack>

            {reminder.type === "test" && (
              <Stack gap={2} align="flex-end">
                <Text size="xs" c="dimmed" fw={500}>
                  תדירות
                </Text>
                <Badge size="md" variant="light" color="gray">
                  {frequencyInfo.shortLabel}
                </Badge>
              </Stack>
            )}
          </Group>
        </Stack>

        <Group justify="space-between" align="center" pt="sm" gap="xs">
          <Group gap="xs">
            <Tooltip label="עריכת תזכורת" withArrow>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="lg"
                radius="md"
                onClick={handleEditClick}
                aria-label="עריכת תזכורת"
              >
                <PencilSimple size={18} aria-hidden="true" />
              </ActionIcon>
            </Tooltip>

            {onDeleteClick && (
              <Tooltip label="מחיקת תזכורת" withArrow>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  size="lg"
                  radius="md"
                  onClick={() => onDeleteClick(reminder)}
                  aria-label="מחיקת תזכורת"
                >
                  <Trash size={18} aria-hidden="true" />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>

          {status.canRenew && onRenewClick && (
            <Button
              variant="light"
              color={status.color === "red" ? "red" : "blue"}
              size="sm"
              radius="md"
              onClick={() => onRenewClick(reminder)}
              leftSection={<ArrowsClockwise size={18} aria-hidden="true" />}
            >
              חדש תזכורת
            </Button>
          )}
        </Group>
      </Stack>
    </Card>
  );
}
