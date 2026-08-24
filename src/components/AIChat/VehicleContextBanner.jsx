import {
  Button,
  Box,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  Car,
  ClockCounterClockwise,
  Gauge,
  Plus,
} from "@phosphor-icons/react";

const formatMileage = (value) => {
  const mileage = Number(value);
  return Number.isFinite(mileage) ? mileage.toLocaleString("he-IL") : null;
};

export default function VehicleContextBanner({
  vehicle,
  showClear = false,
  onClear,
  onOpenHistory,
}) {
  const vehicleName = [vehicle.manufacturer, vehicle.model, vehicle.year]
    .filter(Boolean)
    .join(" ");
  const mileage = formatMileage(vehicle.currentMileage);

  return (
    <Paper
      component="section"
      withBorder
      radius="md"
      p={{ base: "sm", sm: "md" }}
      bg="white"
      className="ai-context-card"
    >
      <Group
        className="ai-context-main"
        justify="space-between"
        gap="sm"
        wrap="nowrap"
      >
        <Group gap="sm" wrap="nowrap" miw={0}>
          <ThemeIcon radius="md" variant="light" color="gray" size={40}>
            <Car
              size={20}
              weight="fill"
              aria-hidden="true"
              style={{ color: "var(--mantine-primary-color-filled)" }}
            />
          </ThemeIcon>
          <Stack gap={0} miw={0}>
            <Text size="xs" c="dimmed" fw={600}>
              מדברים על
            </Text>
            <Text
              fw={700}
              size="sm"
              dir="auto"
              style={{ overflowWrap: "anywhere" }}
            >
              {vehicleName}
            </Text>
          </Stack>
        </Group>

        {mileage && (
          <Group gap={5} wrap="nowrap" c="dimmed" style={{ flexShrink: 0 }}>
            <Gauge size={16} aria-hidden="true" />
            <Text size="xs" fw={600} dir="ltr">
              {mileage} ק״מ
            </Text>
          </Group>
        )}
      </Group>

      <Box>
        <Group
          className="ai-context-actions"
          gap={4}
          wrap="nowrap"
          justify="flex-end"
        >
          <Button
            variant="subtle"
            color="gray"
            size="compact-sm"
            radius="md"
            onClick={onOpenHistory}
            leftSection={<ClockCounterClockwise size={16} aria-hidden="true" />}
          >
            שיחות קודמות
          </Button>
          {showClear && (
            <Button
              variant="subtle"
              color="gray"
              size="compact-sm"
              radius="md"
              onClick={onClear}
              leftSection={<Plus size={16} aria-hidden="true" />}
            >
              שיחה חדשה
            </Button>
          )}
        </Group>
      </Box>
    </Paper>
  );
}
