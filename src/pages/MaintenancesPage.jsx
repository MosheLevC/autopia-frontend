import { Center, Container, Loader } from "@mantine/core";
import { useParams } from "react-router";
import { observer } from "mobx-react-lite";
import { useHeaderTitle } from "../context/HeaderContext";
import { useVehicleStore } from "../stores/VehicleStoreContext";
import NoVehicleSelected from "../components/NoVehicleSelected";
import MaintenanceLog from "../components/MaintenanceLog";

const MaintenancesPage = observer(function MaintenancesPage() {
  useHeaderTitle("יומן טיפולים");
  const { vehicleId } = useParams();
  const vehicleStore = useVehicleStore();

  if (vehicleStore.isLoading) {
    return (
      <Center h={300}>
        <Loader size="lg" />
      </Center>
    );
  }

  const currentVehicle = vehicleId
    ? vehicleStore.vehicles.find((v) => (v._id || v.id) === vehicleId)
    : vehicleStore.activeVehicle;

  if (!currentVehicle) {
    return (
      <NoVehicleSelected
        title="לא נבחר רכב"
        description="לא ניתן להציג את יומן הטיפולים מכיוון שלא נבחר רכב. יש לבחור רכב מתוך רשימת הרכבים שלך."
        icon="ph-calendar-x"
      />
    );
  }

  return (
    <Container size="lg" py="md">
      <MaintenanceLog vehicle={currentVehicle} />
    </Container>
  );
});

export default MaintenancesPage;
