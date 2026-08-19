import { useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { formatDateToDisplay } from "../utils/plateUtils";

const TYPE_CONFIG = {
  periodic: { label: "תקופתי", color: "orange" },
  repair: { label: "תיקון", color: "red" },
  replacement: { label: "החלפה", color: "grape" },
  inspection: { label: "בדיקה", color: "blue" },
  other: { label: "אחר", color: "gray" },
};

function formatMileage(mileage) {
  if (mileage === undefined || mileage === null || mileage === "") return null;
  const num = Number(mileage);
  if (isNaN(num)) return `ב-${mileage} ק״מ`;
  return `ב-${num.toLocaleString("he-IL")} ק״מ`;
}

const MaintenanceLog = observer(function MaintenanceLog({ vehicle, maintenances = [] }) {
  const navigate = useNavigate();
  const vehicleId = vehicle?._id;

  const sortedMaintenances = [...maintenances].sort((a, b) => {
    const dateA = new Date(a.maintenanceDate || a.date || 0);
    const dateB = new Date(b.maintenanceDate || b.date || 0);
    return dateB - dateA;
  });

  const handleItemClick = (maintenanceId) => {
    if (vehicleId && maintenanceId) {
      navigate(`/vehicles/${vehicleId}/maintenances/${maintenanceId}`);
    }
  };

  const handleAddClick = () => {
    if (vehicleId) {
      navigate(`/vehicles/${vehicleId}/maintenances/add`);
    }
  };

  return (
    <Stack gap="lg" pb={sortedMaintenances.length > 0 ? 80 : 0}>
      <Group justify="space-between" align="center">
        <Group gap="xs" align="center">
          <ThemeIcon size={36} radius="md" variant="light" color="blue">
            <i className="ph-clock-counter-clockwise" style={{ fontSize: "1.3rem" }} aria-hidden="true" />
          </ThemeIcon>
          <Title order={2} size="h3" fw={700} c="gray.9">
            היסטוריית טיפולים
          </Title>
        </Group>

        {sortedMaintenances.length > 0 && (
          <Badge variant="light" color="gray" size="lg" radius="md">
            {sortedMaintenances.length} טיפולים
          </Badge>
        )}
      </Group>

      {sortedMaintenances.length === 0 ? (
        <Card withBorder radius="xl" shadow="xs" p="xl" bg="white">
          <Stack align="center" gap="md" py="xl" ta="center">
            <ThemeIcon size={64} radius="xl" variant="light" color="gray">
              <i className="ph-wrench" style={{ fontSize: "2rem" }} aria-hidden="true" />
            </ThemeIcon>
            <Stack gap={4} align="center">
              <Title order={4} fw={700} c="gray.9">
                אין טיפולים להצגה
              </Title>
              <Text c="dimmed" size="sm" maw={360}>
                עדיין לא נוספו טיפולים עבור רכב זה. הוסף את הטיפול הראשון כדי להתחיל לעקוב אחר היסטוריית התחזוקה.
              </Text>
            </Stack>
            <Button
              variant="light"
              onClick={handleAddClick}
              leftSection={<i className="ph-plus-circle" style={{ fontSize: "1.1rem" }} aria-hidden="true" />}
              mt="xs"
            >
              הוסף טיפול ראשון
            </Button>
          </Stack>
        </Card>
      ) : (
        <Stack gap="sm">
          {sortedMaintenances.map((item) => {
            const typeInfo = TYPE_CONFIG[item.type] || TYPE_CONFIG.other;
            const displayDate = formatDateToDisplay(item.maintenanceDate || item.date) || "תאריך לא צוין";
            const mileageText = formatMileage(item.mileageAtMaintenance || item.mileage);

            return (
              <Paper
                key={item._id}
                component={UnstyledButton}
                onClick={() => handleItemClick(item._id)}
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
                      {item.title}
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

                  <Group gap="sm" align="center" wrap="nowrap" style={{ flexShrink: 0 }}>
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
                      <i className="ph-caret-left" style={{ fontSize: "1.2rem" }} aria-hidden="true" />
                    </ThemeIcon>
                  </Group>
                </Group>
              </Paper>
            );
          })}
        </Stack>
      )}

      {sortedMaintenances.length > 0 && (
        <Box
          pos="sticky"
          bottom={{ base: "5.5rem", sm: "1rem" }}
          pt="xs"
          style={{ zIndex: 10 }}
        >
          <Button
            fullWidth
            size="lg"
            radius="lg"
            h={50}
            fw={700}
            onClick={handleAddClick}
            leftSection={<i className="ph-plus-circle" style={{ fontSize: "1.3rem" }} aria-hidden="true" />}
            shadow="sm"
          >
            הוסף טיפול
          </Button>
        </Box>
      )}
    </Stack>
  );
});

export default MaintenanceLog;
