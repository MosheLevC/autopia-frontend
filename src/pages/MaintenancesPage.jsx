import { useEffect } from "react";
import { Container } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { Car, Plus } from "@phosphor-icons/react";
import { useHeaderTitle } from "../hooks/useHeader";
import { useCurrentVehicle } from "../hooks/useCurrentVehicle";
import { useMaintenanceStore } from "../stores";

import NoVehicleSelected from "../components/NoVehicleSelected";
import MaintenanceLog from "../components/MaintenanceLog";
import PageLoading from "../components/common/PageLoading";
import LoadErrorCard from "../components/common/LoadErrorCard";

const MaintenancesPage = observer(function MaintenancesPage() {
  useHeaderTitle("יומן טיפולים");
  const { vehicle, vehicleId, isVehicleLoading, hasNoVehicle } =
    useCurrentVehicle();
  const maintenanceStore = useMaintenanceStore();

  useEffect(() => {
    if (vehicleId) {
      maintenanceStore.fetchMaintenances(vehicleId).catch(() => {});
    }
  }, [vehicleId, maintenanceStore]);

  if (isVehicleLoading) {
    return <PageLoading message="טוען את פרטי הרכב..." />;
  }

  if (hasNoVehicle) {
    return (
      <NoVehicleSelected
        title="עדיין לא הוספת רכב"
        description="הוספת רכב תאפשר לך לעקוב אחר היסטוריית הטיפולים והתחזוקה."
        icon={Car}
        actionLabel="הוספת רכב"
        actionPath="/vehicles/add"
        actionIcon={Plus}
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
            maintenanceStore.fetchMaintenances(vehicleId).catch(() => {})
          }
        />
      </Container>
    );
  }

  return (
    <Container size="lg" py="md">
      <MaintenanceLog
        vehicle={vehicle}
        maintenances={maintenanceStore.maintenances}
      />
    </Container>
  );
});

export default MaintenancesPage;
