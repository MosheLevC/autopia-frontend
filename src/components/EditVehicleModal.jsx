import { useEffect, useState } from "react";
import { Alert, Modal, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useVehicleStore } from "../stores/VehicleStoreContext";
import VehicleEditForm from "./VehicleEditForm";

export default function EditVehicleModal({ opened, onClose, vehicle }) {
  const vehicleStore = useVehicleStore();
  const isMobile = useMediaQuery("(max-width: 47.99em)");
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
      centered={!isMobile}
      fullScreen={isMobile}
      size="70rem"
      radius={isMobile ? 0 : "lg"}
      padding={{ base: "sm", sm: "lg" }}
      xOffset="var(--mantine-spacing-md)"
      yOffset="var(--mantine-spacing-md)"
      removeScrollProps={{ gapMode: "padding" }}
      styles={{
        inner: { insetInline: 0, minWidth: 0, width: "auto" },
        content: { maxWidth: "100%", minWidth: 0 },
        body: { width: "100%", minWidth: 0 },
      }}
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

