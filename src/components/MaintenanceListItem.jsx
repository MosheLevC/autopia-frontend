import {
  Badge,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { getMaintenanceTypeInfo } from "../constants/maintenanceConstants";
import { formatDateToDisplay } from "../utils/plateUtils";

function formatMileage(mileage) {
  if (mileage === undefined || mileage === null || mileage === "") return null;
  const numericMileage = Number(mileage);

  return Number.isNaN(numericMileage)
    ? `ב-${mileage} ק״מ`
    : `ב-${numericMileage.toLocaleString("he-IL")} ק״מ`;
}

export default function MaintenanceListItem({ maintenance, onClick }) {
  const typeInfo = getMaintenanceTypeInfo(maintenance.type);
  const displayDate =
    formatDateToDisplay(maintenance.maintenanceDate || maintenance.date) ||
    "תאריך לא צוין";
  const mileageText = formatMileage(
    maintenance.mileageAtMaintenance ?? maintenance.mileage,
  );

  return (
    <Paper
      component={UnstyledButton}
      type="button"
      onClick={onClick}
      withBorder
      radius="lg"
      p="md"
      bg="white"
      shadow="xs"
      w="100%"
      style={{
        transition: "all 150ms ease",
        display: "block",
      }}
      className="maintenance-item-card"
    >
      <Group justify="space-between" align="center" wrap="nowrap" gap="md">
        <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
          <Text fw={700} size="md" c="gray.9" truncate>
            {maintenance.title}
          </Text>
          <Group gap="xs">
            <Badge
              color={typeInfo.color}
              variant="light"
              size="sm"
              radius="sm"
            >
              {typeInfo.label}
            </Badge>
          </Group>
        </Stack>

        <Group
          gap="sm"
          align="center"
          wrap="nowrap"
          style={{ flexShrink: 0 }}
        >
          <Stack gap={2} align="flex-end">
            <Text size="sm" fw={600} c="gray.8">
              {displayDate}
            </Text>
            {mileageText && (
              <Text size="xs" c="dimmed">
                {mileageText}
              </Text>
            )}
          </Stack>

          <ThemeIcon
            variant="transparent"
            color="gray.5"
            size="sm"
            style={{ flexShrink: 0 }}
          >
            <i
              className="ph-caret-left"
              style={{ fontSize: "1.2rem" }}
              aria-hidden="true"
            />
          </ThemeIcon>
        </Group>
      </Group>
    </Paper>
  );
}
