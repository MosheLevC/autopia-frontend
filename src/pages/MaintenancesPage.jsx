import { useEffect } from "react";
import { Container } from "@mantine/core";
import { useParams } from "react-router";
import { observer } from "mobx-react-lite";
import { useHeaderTitle } from "../context/HeaderContext";
import { useVehicleStore } from "../stores/VehicleStoreContext";
import { useMaintenanceStore } from "../stores/MaintenanceStoreContext";
import NoVehicleSelected from "../components/NoVehicleSelected";
import MaintenanceLog from "../components/MaintenanceLog";
import PageLoading from "../components/common/PageLoading";
import LoadErrorCard from "../components/common/LoadErrorCard";

const MaintenancesPage = observer(function MaintenancesPage() {
  useHeaderTitle("יומן טיפולים");
  const { vehicleId } = useParams();
  const vehicleStore = useVehicleStore();
  const maintenanceStore = useMaintenanceStore();

  const currentVehicle = vehicleId
    ? vehicleStore.vehicles.find((v) => v._id === vehicleId)
    : vehicleStore.activeVehicle;

  const currentVehicleId = currentVehicle?._id;

  useEffect(() => {
    if (currentVehicleId) {
      maintenanceStore.fetchMaintenances(currentVehicleId).catch(() => {});
    }
  }, [currentVehicleId, maintenanceStore]);

  if (vehicleStore.isLoading && vehicleStore.vehicles.length === 0) {
    return <PageLoading message="טוען את פרטי הרכב..." />;
  }

  if (!currentVehicle) {
    return (
      <NoVehicleSelected
        title="לא נבחר רכב"
        description="לא ניתן להציג את יומן הטיפולים מכיוון שלא נבחר רכב. יש לבחור רכב מתוך רשימת הרכבים שלך."
        icon="ph-wrench"
      />
    );
  }

  if (maintenanceStore.isLoading && maintenanceStore.maintenances.length === 0) {
    return <PageLoading message="טוען את יומן הטיפולים..." />;
  }

  if (maintenanceStore.error && maintenanceStore.maintenances.length === 0) {
    return (
      <Container size="lg" py="md">
        <LoadErrorCard
          title="לא הצלחנו לטעון את יומן הטיפולים"
          error={maintenanceStore.error}
          onRetry={() =>
            maintenanceStore.fetchMaintenances(currentVehicleId).catch(() => {})
          }
        />
      </Container>
    );
  }

  return (
    <Container size="lg" py="md">
      <MaintenanceLog
        vehicle={currentVehicle}
        maintenances={maintenanceStore.maintenances}
      />
    </Container>
  );
});

export default MaintenancesPage;
