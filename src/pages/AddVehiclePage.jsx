import { useEffect } from "react";
import { Container, Alert, Stack } from "@mantine/core";
import { useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
import VehicleWizard from "../components/VehicleWizard";
import { useVehicleStore } from "../stores/VehicleStoreContext";
import { useHeaderTitle } from "../context/HeaderContext";

const AddVehiclePage = observer(function AddVehiclePage() {
  const navigate = useNavigate();
  const { createVehicle, error, clearError, isLoading } = useVehicleStore();

  useHeaderTitle("הוספת רכב");

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleWizardComplete = async (vehicleData) => {
    try {
      await createVehicle(vehicleData);
      navigate("/home");
    } catch {}
  };

  return (
    <Container size="lg" py="md">
      <Stack gap="md">
        {error && (
          <Alert
            color="red"
            title="שגיאה בהוספת הרכב"
            withCloseButton
            onClose={clearError}
            radius="md"
          >
            {error}
          </Alert>
        )}
        <VehicleWizard
          onComplete={handleWizardComplete}
          onCancel={() => navigate("/vehicles")}
          isLoading={isLoading}
        />
      </Stack>
    </Container>
  );
});

export default AddVehiclePage;
