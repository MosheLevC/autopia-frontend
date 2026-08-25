import { useEffect, useState } from "react";
import { Alert, Container, Stack } from "@mantine/core";
import { useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
import {
  ArrowRight,
  Car,
  CheckCircle,
  Plus,
  WarningCircle,
} from "@phosphor-icons/react";
import { useHeaderTitle } from "../hooks/useHeader";
import { useCurrentVehicle } from "../hooks/useCurrentVehicle";
import { useReminderStore } from "../stores";

import NoVehicleSelected from "../components/NoVehicleSelected";
import AddReminderForm from "../components/AddReminderForm";
import PageLoading from "../components/common/PageLoading";
import StatusCard from "../components/common/StatusCard";

const AddReminderPage = observer(function AddReminderPage() {
  useHeaderTitle("הוספת תזכורת");
  const navigate = useNavigate();
  const { vehicle, vehicleId, isVehicleLoading, hasNoVehicle } =
    useCurrentVehicle();
  const reminderStore = useReminderStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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
        description="לא ניתן להוסיף תזכורת מכיוון שעדיין לא הוספת רכב. יש להוסיף רכב תחילה."
        icon={Car}
        actionLabel="הוספת רכב"
        actionPath="/vehicles/add"
        actionIcon={Plus}
      />
    );
  }

  const existingReminders =
    reminderStore.remindersVehicleId === vehicleId
      ? reminderStore.reminders
      : [];
  const existingTypes = existingReminders.map((r) => r.type);

  if (existingTypes.includes("test") && existingTypes.includes("insurance")) {
    return (
      <Container size="sm" py="md">
        <StatusCard
          icon={CheckCircle}
          iconColor="blue"
          title="תזכורות הרכב כבר מוגדרות"
          description="עבור רכב זה כבר מוגדרות תזכורת לטסט ותזכורת לביטוח. באפשרותך לערוך אותן מעמוד התזכורות."
          action={{
            label: "חזרה לרשימת התזכורות",
            onClick: () => navigate(`/vehicles/${vehicleId}/reminders`),
            icon: ArrowRight,
            variant: "light",
          }}
        />
      </Container>
    );
  }

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await reminderStore.createReminder(vehicleId, payload);
      navigate(`/vehicles/${vehicleId}/reminders`);
    } catch (err) {
      setSubmitError(err.message || "שגיאה בהוספת התזכורת. נא לנסות שוב.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/vehicles/${vehicleId}/reminders`);
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
            icon={<WarningCircle size={20} aria-hidden="true" />}
          >
            {submitError}
          </Alert>
        )}

        <AddReminderForm
          vehicle={vehicle}
          existingTypes={existingTypes}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </Stack>
    </Container>
  );
});

export default AddReminderPage;
