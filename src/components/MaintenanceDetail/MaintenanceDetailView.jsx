import {
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { getMaintenanceTypeInfo } from "../../constants/maintenanceConstants";
import VehicleBanner from "../VehicleBanner";
import MaintenanceMetricsGrid from "./MaintenanceMetricsGrid";
import MaintenancePartsList from "./MaintenancePartsList";

export default function MaintenanceDetailView({
  maintenance,
  vehicle,
  onEdit,
  onBack,
}) {
  const typeInfo = getMaintenanceTypeInfo(maintenance?.type);

  return (
    <Stack gap="md">
      <VehicleBanner vehicle={vehicle} />

      <Card withBorder radius="xl" shadow="xs" p={{ base: "md", sm: "xl" }} bg="white">
        <Stack gap="lg">
          <Group justify="space-between" align="flex-start" wrap="nowrap" gap="md">
            <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
              <Text size="xs" c="dimmed" fw={600}>
                כותרת הטיפול
              </Text>
              <Title order={3} fw={700} c="gray.9" style={{ wordBreak: "break-word" }}>
                {maintenance.title}
              </Title>
            </Stack>
            <Badge
              color={typeInfo.color}
              variant="light"
              size="lg"
              radius="md"
              leftSection={
                typeInfo.icon ? (
                  <i className={typeInfo.icon} style={{ fontSize: "1rem" }} aria-hidden="true" />
                ) : undefined
              }
            >
              {typeInfo.label}
            </Badge>
          </Group>

          <Divider />

          <MaintenanceMetricsGrid maintenance={maintenance} />

          <MaintenancePartsList parts={maintenance.parts} />

          {maintenance.description && (
            <Stack gap="xs">
              <Group gap="xs" align="center">
                <ThemeIcon size="sm" variant="transparent" color="blue">
                  <i className="ph-note-pencil" style={{ fontSize: "1.1rem" }} aria-hidden="true" />
                </ThemeIcon>
                <Text fw={700} size="sm" c="gray.9">
                  הערות ותיאור
                </Text>
              </Group>
              <Paper withBorder radius="md" p="md" bg="gray.0">
                <Text size="sm" c="gray.8" style={{ whiteSpace: "pre-wrap" }}>
                  {maintenance.description}
                </Text>
              </Paper>
            </Stack>
          )}

          <Stack gap="xs" mt="md">
            <Button
              size="lg"
              radius="lg"
              h={50}
              fw={700}
              onClick={onEdit}
              leftSection={<i className="ph-pencil-simple" style={{ fontSize: "1.2rem" }} aria-hidden="true" />}
              shadow="sm"
            >
              עריכת טיפול
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              radius="lg"
              h={50}
              onClick={onBack}
            >
              חזרה ליומן הטיפולים
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
