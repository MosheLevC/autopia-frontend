import { useEffect, useState } from "react";
import { Alert, Button, Group, Modal, Paper, Stack, Text } from "@mantine/core";
import { useVehicleStore } from "../stores/VehicleStoreContext";
import { formatLicensePlate } from "../utils/plateUtils";

export default function DeleteVehicleModal({
  opened,
  onClose,
  onDeleted,
  vehicle,
}) {
  const vehicleStore = useVehicleStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const vehicleId = vehicle?._id || vehicle?.id;
  const manufacturer = vehicle?.manufacturer?.trim() || "יצרן לא ידוע";
  const model = vehicle?.model?.trim() || "דגם לא ידוע";
  const formattedPlate = formatLicensePlate(vehicle?.licensePlate);

  useEffect(() => {
    if (opened) {
      setDeleteError(null);
    }
  }, [opened, vehicleId]);

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!vehicleId || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await vehicleStore.deleteVehicle(vehicleId);
      onDeleted();
    } catch (error) {
      setDeleteError(error.message || "לא הצלחנו למחוק את הרכב. נסה שוב.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="מחיקת רכב"
      centered
      size="sm"
      radius="lg"
      padding={{ base: "md", sm: "xl" }}
      closeOnClickOutside={!isDeleting}
      closeOnEscape={!isDeleting}
      withCloseButton={!isDeleting}
    >
      {opened && vehicle && (
        <Stack gap="md">
          <Text>האם למחוק את הרכב הזה? לא ניתן לבטל את הפעולה לאחר האישור.</Text>

          <Paper withBorder radius="md" p="md" bg="gray.0">
            <Stack gap={4} align="center">
              <Text fw={700} size="lg">
                {manufacturer} {model}
              </Text>
              <Text fw={700} dir="ltr">
                {formattedPlate || "מספר רישוי לא זמין"}
              </Text>
            </Stack>
          </Paper>

          {deleteError && (
            <Alert color="red" title="הרכב לא נמחק" radius="md">
              {deleteError}
            </Alert>
          )}

          <Group grow gap="sm" mt="xs">
            <Button
              type="button"
              variant="default"
              onClick={handleClose}
              disabled={isDeleting}
            >
              ביטול
            </Button>
            <Button
              type="button"
              color="red"
              onClick={handleDelete}
              loading={isDeleting}
            >
              מחק רכב
            </Button>
          </Group>
        </Stack>
      )}
    </Modal>
  );
}
