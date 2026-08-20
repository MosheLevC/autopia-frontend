import { useState } from "react";
import {
  Alert,
  Center,
  Container,
  Loader,
  Stack,
  Text,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router";
import { observer } from "mobx-react-lite";
import { useHeaderTitle } from "../context/HeaderContext";
import { useVehicleStore } from "../stores/VehicleStoreContext";
import { useMaintenanceStore } from "../stores/MaintenanceStoreContext";
import NoVehicleSelected from "../components/NoVehicleSelected";
import AddMaintenanceForm from "../components/AddMaintenanceForm";

const AddMaintenancePage = observer(function AddMaintenancePage() {
  useHeaderTitle("הוספת טיפול");
  const navigate = useNavigate();
  const { vehicleId } = useParams();
  const vehicleStore = useVehicleStore();
  const maintenanceStore = useMaintenanceStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const currentVehicle = vehicleId
    ? vehicleStore.vehicles.find((v) => v._id === vehicleId)
    : vehicleStore.activeVehicle;

  const currentVehicleId = currentVehicle?._id;

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
        description="לא ניתן להוסיף טיפול מכיוון שלא נבחר רכב. יש לבחור או להוסיף רכב תחילה."
        icon="ph-wrench"
      />
    );
  }

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await maintenanceStore.createMaintenance(currentVehicleId, payload);

      if (result?.vehicle) {
        vehicleStore.updateVehicleLocally(result.vehicle);
      }

      navigate(`/vehicles/${currentVehicleId}/maintenances`);
    } catch (err) {
      setSubmitError(err.message || "שגיאה בשמירת הטיפול. נא לנסות שוב.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/vehicles/${currentVehicleId}/maintenances`);
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
            icon={<i className="ph-warning-circle" aria-hidden="true" />}
          >
            {submitError}
          </Alert>
        )}

        <AddMaintenanceForm
          vehicle={currentVehicle}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </Stack>
    </Container>
  );
});

export default AddMaintenancePage;
