import { Group, Paper, SimpleGrid, Stack, Text, ThemeIcon } from "@mantine/core";
import { Calendar, Coins, Gauge } from "@phosphor-icons/react";
import { formatDateToDisplay } from "../../utils/plateUtils";

export default function MaintenanceMetricsGrid({ maintenance }) {
  const formattedMileage =
    maintenance.mileageAtMaintenance !== undefined &&
    maintenance.mileageAtMaintenance !== null &&
    maintenance.mileageAtMaintenance !== ""
      ? `${Number(maintenance.mileageAtMaintenance).toLocaleString("he-IL")} ק״מ`
      : "לא צוין";

  const formattedDate =
    formatDateToDisplay(maintenance.maintenanceDate) || "לא צוין";

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
      <Paper withBorder radius="lg" p="md" bg="gray.0">
        <Stack gap={4}>
          <Group gap={6} align="center">
            <ThemeIcon size="sm" variant="transparent" color="blue">
              <Coins size={18} aria-hidden="true" />
            </ThemeIcon>
            <Text size="xs" c="dimmed" fw={600}>
              עלות כוללת
            </Text>
          </Group>
          <Text fw={800} size="xl" c="blue.7">
            ₪{Number(maintenance.totalCost || 0).toLocaleString("he-IL")}
          </Text>
        </Stack>
      </Paper>

      <Paper withBorder radius="lg" p="md" bg="gray.0">
        <Stack gap={4}>
          <Group gap={6} align="center">
            <ThemeIcon size="sm" variant="transparent" color="gray.6">
              <Calendar size={18} aria-hidden="true" />
            </ThemeIcon>
            <Text size="xs" c="dimmed" fw={600}>
              תאריך טיפול
            </Text>
          </Group>
          <Text fw={700} size="md" c="gray.9">
            {formattedDate}
          </Text>
        </Stack>
      </Paper>

      <Paper withBorder radius="lg" p="md" bg="gray.0">
        <Stack gap={4}>
          <Group gap={6} align="center">
            <ThemeIcon size="sm" variant="transparent" color="gray.6">
              <Gauge size={18} aria-hidden="true" />
            </ThemeIcon>
            <Text size="xs" c="dimmed" fw={600}>
              קילומטראז'
            </Text>
          </Group>
          <Text fw={700} size="md" c="gray.9">
            {formattedMileage}
          </Text>
        </Stack>
      </Paper>
    </SimpleGrid>
  );
}

