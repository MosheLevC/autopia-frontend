import { useEffect } from "react";
import { Container } from "@mantine/core";
import { useParams } from "react-router";
import { observer } from "mobx-react-lite";
import { useHeaderTitle } from "../context/HeaderContext";
import { useVehicleStore } from "../stores/VehicleStoreContext";
import { useReminderStore } from "../stores/ReminderStoreContext";
import NoVehicleSelected from "../components/NoVehicleSelected";
import Reminders from "../components/Reminders";
import PageLoading from "../components/common/PageLoading";
import LoadErrorCard from "../components/common/LoadErrorCard";

const RemindersPage = observer(function RemindersPage() {
  useHeaderTitle("תזכורות");
  const { vehicleId } = useParams();
  const vehicleStore = useVehicleStore();
  const reminderStore = useReminderStore();

  const currentVehicle = vehicleId
    ? vehicleStore.vehicles.find((v) => v._id === vehicleId)
    : vehicleStore.activeVehicle;

  const currentVehicleId = currentVehicle?._id;

  useEffect(() => {
    if (currentVehicleId) {
      reminderStore.fetchReminders(currentVehicleId).catch(() => {});
    }
  }, [currentVehicleId, reminderStore]);

  if (vehicleStore.isLoading && vehicleStore.vehicles.length === 0) {
    return <PageLoading message="טוען את פרטי הרכב..." />;
  }

  if (!currentVehicle) {
    return (
      <NoVehicleSelected
        title="לא נבחר רכב"
        description="לא ניתן להציג את התזכורות מכיוון שלא נבחר רכב. יש לבחור רכב מתוך רשימת הרכבים שלך."
        icon="ph-bell-slash"
      />
    );
  }

  if (reminderStore.isLoading && reminderStore.reminders.length === 0) {
    return <PageLoading message="טוען תזכורות..." />;
  }

  if (reminderStore.error && reminderStore.reminders.length === 0) {
    return (
      <Container size="lg" py="md">
        <LoadErrorCard
          title="לא הצלחנו לטעון את התזכורות"
          error={reminderStore.error}
          onRetry={() =>
            reminderStore.fetchReminders(currentVehicleId).catch(() => {})
          }
        />
      </Container>
    );
  }

  return (
    <Container size="lg" py="md">
      <Reminders vehicle={currentVehicle} />
    </Container>
  );
});

export default RemindersPage;
