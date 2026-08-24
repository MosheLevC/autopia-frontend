import { useState } from "react";
import { Alert, Container, Stack } from "@mantine/core";
import { useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
import { WarningCircle, Wrench } from "@phosphor-icons/react";
import { useHeaderTitle } from "../hooks/useHeader";
import { useCurrentVehicle } from "../hooks/useCurrentVehicle";
import { useMaintenanceStore } from "../stores";

import NoVehicleSelected from "../components/NoVehicleSelected";
import AddMaintenanceForm from "../components/AddMaintenanceForm";
import PageLoading from "../components/common/PageLoading";

const AddMaintenancePage = observer(function AddMaintenancePage() {
  useHeaderTitle("הוספת טיפול");
  const navigate = useNavigate();
  const { vehicle, vehicleId, isVehicleLoading, hasNoVehicle, vehicleStore } =
    useCurrentVehicle();
  const maintenanceStore = useMaintenanceStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  if (isVehicleLoading) {
    return <PageLoading message="טוען את פרטי הרכב..." />;
  }

  if (hasNoVehicle) {
    return (
      <NoVehicleSelected
        title="לא נבחר רכב"
        description="לא ניתן להוסיף טיפול מכיוון שלא נבחר רכב. יש לבחור או להוסיף רכב תחילה."
        icon={Wrench}
      />
    );
  }

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await maintenanceStore.createMaintenance(
        vehicleId,
        payload
      );

      if (result?.vehicle) {
        vehicleStore.updateVehicleLocally(result.vehicle);
      }

      navigate(`/vehicles/${vehicleId}/maintenances`);
    } catch (err) {
      setSubmitError(err.message || "שגיאה בשמירת הטיפול. נא לנסות שוב.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/vehicles/${vehicleId}/maintenances`);
  };

  return (
    <Container size="sm" py="md">
      <Stack gap="md">
        {submitError && (
          <Alert
            color="red"
            variant="light"
            radius="md"
            title="שגיאה"
            icon={<WarningCircle size={20} aria-hidden="true" />}
          >
            {submitError}
          </Alert>
        )}

        <AddMaintenanceForm
          vehicle={vehicle}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </Stack>
    </Container>
  );
});

export default AddMaintenancePage;
