import { useEffect } from "react";
import { useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
import {
  Button,
  Card,
  Center,
  Group,
  Loader,
  Stack,
  Text,
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
import SectionHeader from "./common/SectionHeader";
import StatusCard from "./common/StatusCard";
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
        <SectionHeader
          icon={ClockCounterClockwise}
          title="טיפולים אחרונים"
          titleId="recent-maintenance-title"
          action={{
            label: "כל הטיפולים",
            onClick: navigateToHistory,
            rightSection: <CaretLeft size={16} aria-hidden="true" />,
          }}
        />

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
          <StatusCard
            variant="paper"
            icon={WarningCircle}
            iconColor="red"
            iconSize={24}
            iconThemeSize={40}
            title="לא הצלחנו לטעון את הטיפולים האחרונים"
            description={maintenanceStore.error}
            bg="red.0"
            gap="sm"
            py="sm"
            actions={
              <>
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
              </>
            }
          />
        )}

        {hasCurrentVehicleData &&
          !isLoading &&
          !hasError &&
          recentMaintenances.length === 0 && (
            <StatusCard
              variant="paper"
              icon={Wrench}
              iconSize={22}
              iconThemeSize={44}
              description="עדיין לא נוספו טיפולים לרכב הזה"
              py="xs"
              gap="sm"
              action={{
                label: "הוספת טיפול ראשון",
                onClick: navigateToAdd,
                icon: PlusCircle,
                variant: "light",
                size: "sm",
              }}
            />
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
