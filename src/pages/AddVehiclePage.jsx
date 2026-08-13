import { Container } from "@mantine/core";
import { useNavigate } from "react-router";
import VehicleWizard from "../components/VehicleWizard";

export default function AddVehiclePage() {
  const navigate = useNavigate();

  const handleWizardComplete = () => {
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
