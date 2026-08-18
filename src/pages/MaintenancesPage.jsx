import { useEffect } from "react";
import { Button, Card, Center, Container, Loader, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { useParams } from "react-router";
import { observer } from "mobx-react-lite";
import { useHeaderTitle } from "../context/HeaderContext";
import { useVehicleStore } from "../stores/VehicleStoreContext";
import { useMaintenanceStore } from "../stores/MaintenanceStoreContext";
import NoVehicleSelected from "../components/NoVehicleSelected";
import MaintenanceLog from "../components/MaintenanceLog";

const MaintenancesPage = observer(function MaintenancesPage() {
  useHeaderTitle("יומן טיפולים");
  const { vehicleId } = useParams();
  const vehicleStore = useVehicleStore();
  const maintenanceStore = useMaintenanceStore();

  const currentVehicle = vehicleId
    ? vehicleStore.vehicles.find((v) => v._id === vehicleId)
    : vehicleStore.activeVehicle;

  const currentVehicleId = currentVehicle?._id;

  useEffect(() => {
    if (currentVehicleId) {
      maintenanceStore.fetchMaintenances(currentVehicleId).catch(() => {});
    }
  }, [currentVehicleId, maintenanceStore]);

  if (vehicleStore.isLoading && vehicleStore.vehicles.length === 0) {
    return (
      <Center h={300}>
        <Stack align="center" gap="sm">
          <Loader size="lg" />
          <Text size="sm" c="dimmed">
            טוען את פרטי הרכב...
          </Text>
        </Stack>
      </Center>
    );
  }

  if (!currentVehicle) {
    return (
      <NoVehicleSelected
        title="לא נבחר רכב"
        description="לא ניתן להציג את יומן הטיפולים מכיוון שלא נבחר רכב. יש לבחור רכב מתוך רשימת הרכבים שלך."
        icon="ph-wrench"
      />
    );
  }

  if (maintenanceStore.isLoading && maintenanceStore.maintenances.length === 0) {
    return (
      <Center h={300}>
        <Stack align="center" gap="sm">
          <Loader size="lg" />
          <Text size="sm" c="dimmed">
            טוען את יומן הטיפולים...
          </Text>
        </Stack>
      </Center>
    );
  }

  if (maintenanceStore.error && maintenanceStore.maintenances.length === 0) {
    return (
      <Container size="lg" py="md">
        <Card withBorder radius="xl" shadow="xs" p="xl" bg="white">
          <Stack align="center" gap="sm" py="lg" ta="center">
            <ThemeIcon color="red" variant="light" size={48} radius="xl">
              <i className="ph-warning-circle" style={{ fontSize: "1.8rem" }} aria-hidden="true" />
            </ThemeIcon>
            <Title order={3} size="h4" fw={700}>
              לא הצלחנו לטעון את יומן הטיפולים
            </Title>
            <Text size="sm" c="dimmed">
              {maintenanceStore.error}
            </Text>
            <Button
              variant="light"
              color="red"
              mt="xs"
              onClick={() => maintenanceStore.fetchMaintenances(currentVehicleId).catch(() => {})}
              leftSection={<i className="ph-arrow-clockwise" aria-hidden="true" />}
            >
              נסה שוב
            </Button>
          </Stack>
        </Card>
      </Container>
    );
  }

  return (
    <Container size="lg" py="md">
      <MaintenanceLog
        vehicle={currentVehicle}
        maintenances={maintenanceStore.maintenances}
      />
    </Container>
  );
});

export default MaintenancesPage;
