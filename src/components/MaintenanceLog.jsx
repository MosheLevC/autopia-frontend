import { useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
import {
  Badge,
  Button,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  ClockCounterClockwise,
  PlusCircle,
  Wrench,
} from "@phosphor-icons/react";
import MaintenanceListItem from "./MaintenanceListItem";
import AddBottomButton from "./common/AddButton";

const MaintenanceLog = observer(function MaintenanceLog({
  vehicle,
  maintenances = [],
}) {
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
    <Stack
      gap="lg"
      pb={{ base: sortedMaintenances.length > 0 ? 80 : 0, sm: 0 }}
    >
      <Group justify="space-between" align="center">
        <Group gap="xs" align="center">
          <ThemeIcon size={36} radius="md" variant="light" color="blue">
            <ClockCounterClockwise size={20} aria-hidden="true" />
          </ThemeIcon>
          <Title order={2} size="h3" fw={700} c="gray.9">
            היסטוריית טיפולים
          </Title>
        </Group>

        <Group gap="sm" align="center">
          {sortedMaintenances.length > 0 && (
            <Badge variant="light" color="gray" size="lg" radius="md">
              {sortedMaintenances.length} טיפולים
            </Badge>
          )}

          {sortedMaintenances.length > 0 && (
            <Button
              visibleFrom="sm"
              variant="filled"
              size="sm"
              radius="md"
              onClick={handleAddClick}
              leftSection={<PlusCircle size={16} aria-hidden="true" />}
            >
              הוסף טיפול
            </Button>
          )}
        </Group>
      </Group>

      {sortedMaintenances.length === 0 ? (
        <Card withBorder radius="xl" shadow="xs" p="xl" bg="white">
          <Stack align="center" gap="md" py="xl" ta="center">
            <ThemeIcon size={64} radius="xl" variant="light" color="gray">
              <Wrench size={32} aria-hidden="true" />
            </ThemeIcon>
            <Stack gap={4} align="center">
              <Title order={4} fw={700} c="gray.9">
                אין טיפולים להצגה
              </Title>
              <Text c="dimmed" size="sm" maw={360}>
                עדיין לא נוספו טיפולים עבור רכב זה. הוסף את הטיפול הראשון כדי
                להתחיל לעקוב אחר היסטוריית התחזוקה.
              </Text>
            </Stack>
            <Button
              variant="light"
              onClick={handleAddClick}
              leftSection={<PlusCircle size={18} aria-hidden="true" />}
              mt="xs"
            >
              הוסף טיפול ראשון
            </Button>
          </Stack>
        </Card>
      ) : (
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          {sortedMaintenances.map((item) => (
            <MaintenanceListItem
              key={item._id}
              maintenance={item}
              onClick={() => handleItemClick(item._id)}
            />
          ))}
        </SimpleGrid>
      )}

      {sortedMaintenances.length > 0 && (
        <AddBottomButton label="הוסף טיפול" onClick={handleAddClick} />
      )}
    </Stack>
  );
});

export default MaintenanceLog;
