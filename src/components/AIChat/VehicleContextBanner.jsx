import {
  Badge,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";

const formatMileage = (value) => {
  const mileage = Number(value);
  return Number.isFinite(mileage) ? mileage.toLocaleString("he-IL") : null;
};

export default function VehicleContextBanner({
  vehicle,
  showClear = false,
  onClear,
}) {
  const vehicleName = [vehicle.manufacturer, vehicle.model, vehicle.year]
    .filter(Boolean)
    .join(" ");
  const mileage = formatMileage(vehicle.currentMileage);

  return (
    <Paper component="section" withBorder radius="lg" p="sm" bg="blue.0">
      <Group justify="space-between" gap="sm" wrap="wrap">
        <Group gap="sm" wrap="nowrap" miw={0}>
          <ThemeIcon radius="xl" variant="filled" size="lg">
            <i className="ph-car-fill" aria-hidden="true" />
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

        <Group gap="xs" wrap="nowrap">
          {mileage && (
            <Badge variant="white" size="lg" radius="md" color="blue">
              <span dir="ltr">{mileage} ק״מ</span>
            </Badge>
          )}
          {showClear && (
            <Button
              variant="subtle"
              color="gray"
              size="xs"
              onClick={onClear}
              leftSection={
                <i
                  className="ph-arrow-counter-clockwise"
                  aria-hidden="true"
                />
              }
            >
              שיחה חדשה
            </Button>
          )}
        </Group>
      </Group>
    </Paper>
  );
}
