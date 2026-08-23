import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Container,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router";
import { observer } from "mobx-react-lite";
import { useHeaderTitle } from "../context/HeaderContext";
import { useVehicleStore } from "../stores/VehicleStoreContext";
import { useReminderStore } from "../stores/ReminderStoreContext";
import NoVehicleSelected from "../components/NoVehicleSelected";
import AddReminderForm from "../components/AddReminderForm";
import PageLoading from "../components/common/PageLoading";

const AddReminderPage = observer(function AddReminderPage() {
  useHeaderTitle("הוספת תזכורת");
  const navigate = useNavigate();
  const { vehicleId } = useParams();
  const vehicleStore = useVehicleStore();
  const reminderStore = useReminderStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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
        description="לא ניתן להוסיף תזכורת מכיוון שלא נבחר רכב. יש לבחור או להוסיף רכב תחילה."
        icon="ph-bell-slash"
      />
    );
  }

  const existingReminders =
    reminderStore.remindersVehicleId === currentVehicleId
      ? reminderStore.reminders
      : [];
  const existingTypes = existingReminders.map((r) => r.type);

  if (existingTypes.includes("test") && existingTypes.includes("insurance")) {
    return (
      <Container size="sm" py="md">
        <Card withBorder radius="xl" shadow="xs" p="xl" bg="white" ta="center">
          <Stack align="center" gap="md" py="lg">
            <ThemeIcon size={64} radius="xl" variant="light" color="blue">
              <i
                className="ph-check-circle"
                style={{ fontSize: "2rem" }}
                aria-hidden="true"
              />
            </ThemeIcon>
            <Stack gap={4} align="center">
              <Title order={4} fw={700}>
                תזכורות הרכב כבר מוגדרות
              </Title>
              <Text size="sm" c="dimmed" maw={360}>
                עבור רכב זה כבר מוגדרות תזכורת לטסט ותזכורת לביטוח. באפשרותך
                לערוך אותן מעמוד התזכורות.
              </Text>
            </Stack>
            <Button
              variant="light"
              onClick={() =>
                navigate(`/vehicles/${currentVehicleId}/reminders`)
              }
              leftSection={
                <i className="ph-arrow-right" aria-hidden="true" />
              }
            >
              חזרה לרשימת התזכורות
            </Button>
          </Stack>
        </Card>
      </Container>
    );
  }

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await reminderStore.createReminder(currentVehicleId, payload);
      navigate(`/vehicles/${currentVehicleId}/reminders`);
    } catch (err) {
      setSubmitError(err.message || "שגיאה בהוספת התזכורת. נא לנסות שוב.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/vehicles/${currentVehicleId}/reminders`);
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
            icon={
              <i className="ph-warning-circle" aria-hidden="true" />
            }
          >
            {submitError}
          </Alert>
        )}

        <AddReminderForm
          vehicle={currentVehicle}
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
