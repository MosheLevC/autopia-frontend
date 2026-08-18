import { useEffect, useState } from "react";
import { Alert, Modal, Stack } from "@mantine/core";
import { useVehicleStore } from "../stores/VehicleStoreContext";
import VehicleEditForm from "./VehicleEditForm";

export default function EditVehicleModal({ opened, onClose, vehicle }) {
  const vehicleStore = useVehicleStore();
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const vehicleId = vehicle?._id || vehicle?.id;

  useEffect(() => {
    if (opened) {
      setSubmitError(null);
    }
  }, [opened, vehicleId]);

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  const handleSubmit = async (payload) => {
    if (!vehicleId || isSaving) {
      return;
    }

    setIsSaving(true);
    setSubmitError(null);

    try {
      const updatedVehicle = await vehicleStore.updateVehicle(
        vehicleId,
        payload,
      );

      if (!updatedVehicle) {
        throw new Error("לא התקבלו פרטי הרכב המעודכנים מהשרת.");
      }

      onClose();
    } catch (error) {
      setSubmitError(error.message || "לא הצלחנו לעדכן את פרטי הרכב.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="עריכת פרטי הרכב"
      centered
      size="xl"
      radius="lg"
      padding={{ base: "md", sm: "xl" }}
      closeOnClickOutside={!isSaving}
      closeOnEscape={!isSaving}
      withCloseButton={!isSaving}
    >
      {opened && vehicle && (
        <Stack gap="md">
          {submitError && (
            <Alert color="red" title="העדכון לא נשמר" radius="md">
              {submitError}
            </Alert>
          )}

          <VehicleEditForm
            vehicle={vehicle}
            isSaving={isSaving}
            onCancel={handleClose}
            onSubmit={handleSubmit}
          />
        </Stack>
      )}
    </Modal>
  );
}

