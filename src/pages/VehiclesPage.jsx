import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Center,
  Container,
  Group,
  Loader,
  Radio,
  Stack,
  Text,
} from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";
import DeleteVehicleModal from "../components/DeleteVehicleModal";
import MyCarsVehicleCard from "../components/MyCarsVehicleCard";
import NoVehicleSelected from "../components/NoVehicleSelected";
import { useHeaderTitle } from "../context/HeaderContext";
import { useVehicleStore } from "../stores/VehicleStoreContext";

const VehiclesPage = observer(function VehiclesPage() {
  useHeaderTitle("הרכבים שלי");
  const navigate = useNavigate();
  const vehicleStore = useVehicleStore();
  const { vehicles, activeVehicleId, isLoading, error } = vehicleStore;
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [vehicleToDeleteId, setVehicleToDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const vehicleToDelete = vehicles.find(
    (vehicle) => (vehicle._id || vehicle.id) === vehicleToDeleteId,
  );

  const enterDeleteMode = () => {
    setVehicleToDeleteId(null);
    setIsDeleteMode(true);
  };

  const cancelDeleteMode = () => {
    setIsDeleteMode(false);
    setVehicleToDeleteId(null);
  };

  const handleVehicleSelect = (vehicleId) => {
    if (isDeleteMode) {
      setVehicleToDeleteId(vehicleId);
      return;
    }

    vehicleStore.setActiveVehicle(vehicleId);
  };

  const handleDeleteSuccess = () => {
    setIsDeleteModalOpen(false);
    setIsDeleteMode(false);
    setVehicleToDeleteId(null);
  };

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

  return (
    <Container size={900} px={0} w="100%">
      <Stack gap="lg" pb={!isDeleteMode ? 80 : 0} w="100%">
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

        <Group justify="flex-end">
          {isDeleteMode ? (
            <Group gap="sm">
              <Button variant="default" onClick={cancelDeleteMode}>
                ביטול
              </Button>
              <Button
                color="red"
                disabled={!vehicleToDelete}
                onClick={() => setIsDeleteModalOpen(true)}
              >
                מחק
              </Button>
            </Group>
          ) : (
            <Button
              variant="subtle"
              color="red"
              leftSection={
                <i className="ph-bold ph-trash" aria-hidden="true" />
              }
              onClick={enterDeleteMode}
            >
              מחק רכב
            </Button>
          )}
        </Group>

        <Stack gap="md">
          {vehicles.map((vehicle) => {
            const vehicleId = vehicle._id || vehicle.id;
            const vehicleName = `${vehicle.manufacturer?.trim() || "יצרן לא ידוע"} ${vehicle.model?.trim() || "דגם לא ידוע"}`;

            return (
              <Group
                key={vehicleId}
                align="center"
                gap="sm"
                wrap="nowrap"
                w="100%"
                miw={0}
                dir="ltr"
              >
                {isDeleteMode && (
                  <Radio
                    name="vehicle-to-delete"
                    color="red"
                    size="md"
                    checked={vehicleId === vehicleToDeleteId}
                    onChange={() => setVehicleToDeleteId(vehicleId)}
                    aria-label={`בחירת ${vehicleName} למחיקה`}
                  />
                )}

                <Box style={{ flex: 1, minWidth: 0 }}>
                  <MyCarsVehicleCard
                    vehicle={vehicle}
                    isActive={vehicleId === activeVehicleId}
                    isDeleteMode={isDeleteMode}
                    isDeleteSelected={vehicleId === vehicleToDeleteId}
                    onSelect={handleVehicleSelect}
                  />
                </Box>
              </Group>
            );
          })}
        </Stack>

        {!isDeleteMode && (
          <Box
            pos="sticky"
            bottom={{ base: "5.5rem", sm: "1rem" }}
            pt="xs"
            w="100%"
            style={{ pointerEvents: "none", zIndex: 10 }}
          >
            <Group justify="flex-start">
              <Button
                w={{ base: 180, xs: 240, sm: 280 }}
                size="lg"
                radius="lg"
                h={50}
                fw={700}
                leftSection={
                  <i className="ph-bold ph-plus" aria-hidden="true" />
                }
                onClick={() => navigate("/vehicles/add")}
                shadow="sm"
                style={{ pointerEvents: "auto" }}
              >
                הוסף רכב
              </Button>
            </Group>
          </Box>
        )}
      </Stack>

      <DeleteVehicleModal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleted={handleDeleteSuccess}
        vehicle={vehicleToDelete}
      />
    </Container>
  );
});

export default VehiclesPage;
