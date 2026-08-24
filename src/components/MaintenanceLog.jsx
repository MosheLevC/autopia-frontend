import { useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
import { SimpleGrid, Stack } from "@mantine/core";
import {
  ClockCounterClockwise,
  PlusCircle,
  Wrench,
} from "@phosphor-icons/react";
import MaintenanceListItem from "./MaintenanceListItem";
import AddBottomButton from "./common/AddButton";
import SectionHeader from "./common/SectionHeader";
import StatusCard from "./common/StatusCard";

const MaintenanceLog = observer(function MaintenanceLog({
  vehicle,
  maintenances = [],
}) {
  const navigate = useNavigate();
  const vehicleId = vehicle?._id;

  const sortedMaintenances = [...maintenances].sort((a, b) => {
    const dateA = new Date(a.maintenanceDate || a.date || 0);
    const dateB = new Date(b.maintenanceDate || b.date || 0);
    return dateB - dateA;
  });

  const handleItemClick = (maintenanceId) => {
    if (vehicleId && maintenanceId) {
      navigate(`/vehicles/${vehicleId}/maintenances/${maintenanceId}`);
    }
  };

  const handleAddClick = () => {
    if (vehicleId) {
      navigate(`/vehicles/${vehicleId}/maintenances/add`);
    }
  };

  return (
    <Stack
      gap="lg"
      pb={{ base: sortedMaintenances.length > 0 ? 80 : 0, sm: 0 }}
    >
      <SectionHeader
        icon={ClockCounterClockwise}
        title="היסטוריית טיפולים"
        badge={
          sortedMaintenances.length > 0
            ? `${sortedMaintenances.length} טיפולים`
            : undefined
        }
        action={
          sortedMaintenances.length > 0
            ? {
                label: "הוסף טיפול",
                onClick: handleAddClick,
                icon: PlusCircle,
                variant: "filled",
                size: "sm",
                radius: "md",
                visibleFrom: "sm",
              }
            : undefined
        }
      />

      {sortedMaintenances.length === 0 ? (
        <StatusCard
          icon={Wrench}
          title="אין טיפולים להצגה"
          description="עדיין לא נוספו טיפולים עבור רכב זה. הוסף את הטיפול הראשון כדי להתחיל לעקוב אחר היסטוריית התחזוקה."
          action={{
            label: "הוסף טיפול ראשון",
            onClick: handleAddClick,
            icon: PlusCircle,
            variant: "light",
          }}
        />
      ) : (
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          {sortedMaintenances.map((item) => (
            <MaintenanceListItem
              key={item._id}
              maintenance={item}
              onClick={() => handleItemClick(item._id)}
            />
          ))}
        </SimpleGrid>
      )}

      {sortedMaintenances.length > 0 && (
        <AddBottomButton label="הוסף טיפול" onClick={handleAddClick} />
      )}
    </Stack>
  );
});

export default MaintenanceLog;
