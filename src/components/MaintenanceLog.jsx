import { useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import MaintenanceListItem from "./MaintenanceListItem";

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
          {sortedMaintenances.map((item) => (
            <MaintenanceListItem
              key={item._id}
              maintenance={item}
              onClick={() => handleItemClick(item._id)}
            />
          ))}
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
