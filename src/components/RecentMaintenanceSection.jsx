import { useEffect } from "react";
import { useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
import {
  Button,
  Card,
  Center,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  ArrowClockwise,
  CaretLeft,
  ClockCounterClockwise,
  PlusCircle,
  WarningCircle,
  Wrench,
} from "@phosphor-icons/react";
import MaintenanceListItem from "./MaintenanceListItem";
import { useMaintenanceStore, useVehicleStore } from "../stores";


const SECTION_CARD_PROPS = {
  withBorder: true,
  radius: "xl",
  shadow: "sm",
  p: { base: "md", sm: "xl" },
  w: "100%",
};

const RecentMaintenanceSection = observer(function RecentMaintenanceSection() {
  const navigate = useNavigate();
  const vehicleStore = useVehicleStore();
  const maintenanceStore = useMaintenanceStore();
  const activeVehicle = vehicleStore.activeVehicle;
  const vehicleId = activeVehicle?._id || activeVehicle?.id;
  const hasCurrentVehicleData =
    Boolean(vehicleId) &&
    maintenanceStore.maintenancesVehicleId === vehicleId;

  useEffect(() => {
    if (
      vehicleId &&
      maintenanceStore.maintenancesVehicleId !== vehicleId
    ) {
      maintenanceStore.fetchMaintenances(vehicleId).catch(() => {});
    }
  }, [vehicleId, maintenanceStore, maintenanceStore.maintenancesVehicleId]);

  if (!activeVehicle || !vehicleId) {
    return null;
  }

  const recentMaintenances = hasCurrentVehicleData
    ? maintenanceStore.maintenances.slice(0, 3)
    : [];
  const isLoading =
    (maintenanceStore.isLoading &&
      (!hasCurrentVehicleData || maintenanceStore.maintenances.length === 0)) ||
    (!hasCurrentVehicleData && !maintenanceStore.error);
  const hasError =
    !isLoading &&
    Boolean(maintenanceStore.error) &&
    (!hasCurrentVehicleData || maintenanceStore.maintenances.length === 0);

  const navigateToHistory = () => {
    navigate(`/vehicles/${vehicleId}/maintenances`);
  };

  const navigateToAdd = () => {
    navigate(`/vehicles/${vehicleId}/maintenances/add`);
  };

  const retryFetch = () => {
    maintenanceStore.fetchMaintenances(vehicleId).catch(() => {});
  };

  return (
    <Card
      {...SECTION_CARD_PROPS}
      component="section"
      aria-labelledby="recent-maintenance-title"
    >
      <Stack gap="md">
        <Group justify="space-between" align="center" wrap="nowrap" gap="sm">
          <Group gap="xs" align="center" wrap="nowrap">
            <ThemeIcon size={36} radius="md" variant="light" color="blue">
              <ClockCounterClockwise size={20} aria-hidden="true" />
            </ThemeIcon>
            <Title
              id="recent-maintenance-title"
              order={2}
              size="h3"
              fw={700}
              c="gray.9"
            >
              טיפולים אחרונים
            </Title>
          </Group>

          <Button
            variant="subtle"
            size="compact-sm"
            onClick={navigateToHistory}
            rightSection={<CaretLeft size={16} aria-hidden="true" />}
            style={{ flexShrink: 0 }}
          >
            כל הטיפולים
          </Button>
        </Group>

        {isLoading && (
          <Center py="xl" role="status">
            <Stack align="center" gap="xs">
              <Loader size="sm" />
              <Text size="sm" c="dimmed">
                טוען טיפולים אחרונים...
              </Text>
            </Stack>
          </Center>
        )}

        {hasError && (
          <Paper withBorder radius="lg" p="md" bg="red.0">
            <Stack align="center" gap="sm" ta="center">
              <ThemeIcon color="red" variant="light" size={40} radius="xl">
                <WarningCircle size={24} aria-hidden="true" />
              </ThemeIcon>
              <Stack gap={2} align="center">
                <Text fw={700} size="sm">
                  לא הצלחנו לטעון את הטיפולים האחרונים
                </Text>
                <Text size="xs" c="dimmed">
                  {maintenanceStore.error}
                </Text>
              </Stack>
              <Group gap="xs" justify="center">
                <Button
                  variant="light"
                  color="red"
                  size="sm"
                  onClick={retryFetch}
                  leftSection={<ArrowClockwise size={16} aria-hidden="true" />}
                >
                  נסה שוב
                </Button>
                <Button variant="default" size="sm" onClick={navigateToAdd}>
                  הוספת טיפול
                </Button>
              </Group>
            </Stack>
          </Paper>
        )}

        {hasCurrentVehicleData &&
          !isLoading &&
          !hasError &&
          recentMaintenances.length === 0 && (
            <Paper withBorder radius="lg" p="md" bg="gray.0">
              <Stack align="center" gap="sm" py="xs" ta="center">
                <ThemeIcon size={44} radius="xl" variant="light" color="gray">
                  <Wrench size={22} aria-hidden="true" />
                </ThemeIcon>
                <Text size="sm" c="dimmed">
                  עדיין לא נוספו טיפולים לרכב הזה
                </Text>
                <Button
                  variant="light"
                  size="sm"
                  onClick={navigateToAdd}
                  leftSection={<PlusCircle size={16} aria-hidden="true" />}
                >
                  הוספת טיפול ראשון
                </Button>
              </Stack>
            </Paper>
          )}

        {hasCurrentVehicleData &&
          !hasError &&
          recentMaintenances.length > 0 && (
            <>
              <Stack gap="sm">
                {recentMaintenances.map((maintenance) => (
                  <MaintenanceListItem
                    key={maintenance._id}
                    maintenance={maintenance}
                    onClick={() =>
                      navigate(
                        `/vehicles/${vehicleId}/maintenances/${maintenance._id}`,
                      )
                    }
                  />
                ))}
              </Stack>

              <Group justify="flex-end">
                <Button
                  variant="light"
                  size="sm"
                  w={{ base: "100%", sm: "auto" }}
                  onClick={navigateToAdd}
                  leftSection={<PlusCircle size={16} aria-hidden="true" />}
                >
                  הוספת טיפול
                </Button>
              </Group>
            </>
          )}
      </Stack>
    </Card>
  );
});

export default RecentMaintenanceSection;

