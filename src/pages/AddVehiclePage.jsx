import { Container } from "@mantine/core";
import { useNavigate } from "react-router";
import VehicleWizard from "../components/VehicleWizard";
import { useVehicleStore } from "../stores/VehicleStoreContext";

export default function AddVehiclePage() {
  const navigate = useNavigate();
  const { addVehicle } = useVehicleStore();

  const handleWizardComplete = (vehicleData) => {
    addVehicle(vehicleData);
    navigate("/vehicles");
  };

  return (
    <Container size="lg" py="md">
      <VehicleWizard
        onComplete={handleWizardComplete}
        onCancel={() => navigate("/vehicles")}
      />
    </Container>
  );
}
