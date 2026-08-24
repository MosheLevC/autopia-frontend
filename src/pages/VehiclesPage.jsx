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
import { Car, PlusCircle, Trash, WarningCircle } from "@phosphor-icons/react";
import DeleteVehicleModal from "../components/DeleteVehicleModal";
import MyCarsVehicleCard from "../components/MyCarsVehicleCard";
import NoVehicleSelected from "../components/NoVehicleSelected";
import AddBottomButton from "../components/common/AddButton";
import SectionHeader from "../components/common/SectionHeader";
import { useHeaderTitle } from "../hooks/useHeader";
import { useVehicleStore } from "../stores";


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
          icon={<WarningCircle size={20} weight="bold" aria-hidden="true" />}
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
        icon={Car}
        actionLabel="הוסף רכב"
        actionPath="/vehicles/add"
        actionIcon={PlusCircle}
      />
    );
  }

  return (
    <Container size={900} px={0} w="100%">
      <Stack gap="lg" pb={{ base: !isDeleteMode ? 80 : 0, sm: 0 }} w="100%">
        {error && (
          <Alert
            color="red"
            title="חלק מהמידע לא נטען"
            icon={<WarningCircle size={20} weight="bold" aria-hidden="true" />}
            radius="lg"
          >
            {error}
          </Alert>
        )}

        <SectionHeader
          icon={Car}
          title="הרכבים שלי"
          badge={
            vehicles.length > 0
              ? `${vehicles.length} ${vehicles.length === 1 ? "רכב" : "רכבים"}`
              : undefined
          }
          action={
            !isDeleteMode
              ? {
                  label: "הוסף רכב",
                  onClick: () => navigate("/vehicles/add"),
                  icon: PlusCircle,
                  variant: "filled",
                  size: "sm",
                  radius: "md",
                  visibleFrom: "sm",
                }
              : undefined
          }
          actions={
            isDeleteMode ? (
              <Group gap="xs">
                <Button
                  variant="default"
                  size="sm"
                  radius="md"
                  onClick={cancelDeleteMode}
                >
                  ביטול
                </Button>
                <Button
                  color="red"
                  size="sm"
                  radius="md"
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
                size="sm"
                radius="md"
                leftSection={
                  <Trash size={18} weight="bold" aria-hidden="true" />
                }
                onClick={enterDeleteMode}
              >
                מחק רכב
              </Button>
            )
          }
        />

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
          <AddBottomButton
            label="הוסף רכב"
            onClick={() => navigate("/vehicles/add")}
          />
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
