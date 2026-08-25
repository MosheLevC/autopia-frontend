import { useEffect } from "react";
import { Container } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { Car, Plus } from "@phosphor-icons/react";
import { useHeaderTitle } from "../hooks/useHeader";
import { useCurrentVehicle } from "../hooks/useCurrentVehicle";
import { useReminderStore } from "../stores";

import NoVehicleSelected from "../components/NoVehicleSelected";
import Reminders from "../components/Reminders";
import PageLoading from "../components/common/PageLoading";
import LoadErrorCard from "../components/common/LoadErrorCard";

const RemindersPage = observer(function RemindersPage() {
  useHeaderTitle("תזכורות");
  const { vehicle, vehicleId, isVehicleLoading, hasNoVehicle } =
    useCurrentVehicle();
  const reminderStore = useReminderStore();

  useEffect(() => {
    if (vehicleId) {
      reminderStore.fetchReminders(vehicleId).catch(() => {});
    }
  }, [vehicleId, reminderStore]);

  if (isVehicleLoading) {
    return <PageLoading message="טוען את פרטי הרכב..." />;
  }

  if (hasNoVehicle) {
    return (
      <NoVehicleSelected
        title="עדיין לא הוספת רכב"
        description="הוספת רכב תאפשר לך לנהל תזכורות לטסט, ביטוח ועוד."
        icon={Car}
        actionLabel="הוספת רכב"
        actionPath="/vehicles/add"
        actionIcon={Plus}
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
            reminderStore.fetchReminders(vehicleId).catch(() => {})
          }
        />
      </Container>
    );
  }

  return (
    <Container size="lg" py="md">
      <Reminders vehicle={vehicle} />
    </Container>
  );
});

export default RemindersPage;
