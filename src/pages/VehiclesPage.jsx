import {
  Alert,
  Button,
  Center,
  Container,
  Loader,
  Stack,
  Text,
} from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";
import MyCarsVehicleCard from "../components/MyCarsVehicleCard";
import NoVehicleSelected from "../components/NoVehicleSelected";
import { useHeaderTitle } from "../context/HeaderContext";
import { useVehicleStore } from "../stores/VehicleStoreContext";

const VehiclesPage = observer(function VehiclesPage() {
  useHeaderTitle("הרכבים שלי");
  const navigate = useNavigate();
  const vehicleStore = useVehicleStore();
  const { vehicles, activeVehicleId, isLoading, error } = vehicleStore;

  if (isLoading && vehicles.length === 0) {
    return (
      <Center h={300}>
        <Stack align="center" gap="sm">
          <Loader size="lg" />
          <Text size="sm" c="dimmed">
            טוען את הרכבים שלך...
          </Text>
        </Stack>
      </Center>
    );
  }

  if (error && vehicles.length === 0) {
    return (
      <Container size="sm" px={0}>
        <Alert
          color="red"
          title="לא הצלחנו לטעון את הרכבים"
          icon={<i className="ph-bold ph-warning-circle" aria-hidden="true" />}
          radius="lg"
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (vehicles.length === 0) {
    return (
      <NoVehicleSelected
        title="עדיין לא הוספת רכב"
        description="הוסף את הרכב הראשון שלך כדי להתחיל לנהל את כל המידע החשוב במקום אחד."
        icon="ph-car"
        actionLabel="הוסף רכב"
        actionPath="/vehicles/add"
        actionIcon="ph-plus"
      />
    );
  }

  const handleVehicleSelect = (vehicleId) => {
    vehicleStore.setActiveVehicle(vehicleId);
  };

  return (
    <Container size={900} px={0}>
      <Stack gap="lg">
        {error && (
          <Alert
            color="red"
            title="חלק מהמידע לא נטען"
            icon={<i className="ph-bold ph-warning-circle" aria-hidden="true" />}
            radius="lg"
          >
            {error}
          </Alert>
        )}

        <Stack gap="md">
          {vehicles.map((vehicle) => {
            const vehicleId = vehicle._id || vehicle.id;

            return (
              <MyCarsVehicleCard
                key={vehicleId}
                vehicle={vehicle}
                isActive={vehicleId === activeVehicleId}
                onSelect={handleVehicleSelect}
              />
            );
          })}
        </Stack>

        <Center>
          <Button
            variant="light"
            size="md"
            radius="lg"
            leftSection={<i className="ph-bold ph-plus" aria-hidden="true" />}
            onClick={() => navigate("/vehicles/add")}
          >
            הוסף רכב
          </Button>
        </Center>
      </Stack>
    </Container>
  );
});

export default VehiclesPage;
