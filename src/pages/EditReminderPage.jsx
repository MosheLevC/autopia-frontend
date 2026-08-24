import { useEffect, useState } from "react";
import { Alert, Container, Stack } from "@mantine/core";
import { useNavigate, useParams } from "react-router";
import { observer } from "mobx-react-lite";
import { BellSlash, WarningCircle } from "@phosphor-icons/react";
import { useHeaderTitle } from "../context/HeaderContext";
import { useVehicleStore } from "../stores/VehicleStoreContext";
import { useReminderStore } from "../stores/ReminderStoreContext";
import NoVehicleSelected from "../components/NoVehicleSelected";
import AddReminderForm from "../components/AddReminderForm";
import PageLoading from "../components/common/PageLoading";
import NotFoundCard from "../components/common/NotFoundCard";

const EditReminderPage = observer(function EditReminderPage() {
  useHeaderTitle("עריכת תזכורת");
  const navigate = useNavigate();
  const { vehicleId, reminderId } = useParams();
  const vehicleStore = useVehicleStore();
  const reminderStore = useReminderStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pageError, setPageError] = useState(null);

  const currentVehicle = vehicleId
    ? vehicleStore.vehicles.find((v) => v._id === vehicleId)
    : vehicleStore.activeVehicle;

  const currentVehicleId = currentVehicle?._id || vehicleId;

  useEffect(() => {
    if (currentVehicleId && reminderId) {
      reminderStore
        .fetchReminderById(currentVehicleId, reminderId)
        .catch((err) => {
          setPageError(err.message || "שגיאה בטעינת פרטי התזכורת");
        });
    }
  }, [currentVehicleId, reminderId, reminderStore]);

  const handleBack = () => {
    if (currentVehicleId) {
      navigate(`/vehicles/${currentVehicleId}/reminders`);
    } else {
      navigate("/reminders");
    }
  };

  if (vehicleStore.isLoading && vehicleStore.vehicles.length === 0) {
    return <PageLoading message="טוען את פרטי הרכב..." />;
  }

  if (!currentVehicle) {
    return (
      <NoVehicleSelected
        title="לא נבחר רכב"
        description="לא ניתן לערוך תזכורת מכיוון שלא נבחר רכב."
        icon={BellSlash}
      />
    );
  }

  const reminder =
    reminderStore.activeReminder?._id === reminderId
      ? reminderStore.activeReminder
      : reminderStore.reminders.find((r) => r._id === reminderId);

  if (reminderStore.isLoading && !reminder) {
    return <PageLoading message="טוען את פרטי התזכורת..." />;
  }

  if (!reminderStore.isLoading && !reminder) {
    return (
      <Container size="sm" py="xl">
        <NotFoundCard
          title="תזכורת לא נמצאה"
          description="פרטי התזכורת המבוקשת אינם קיימים או שנמחקו."
          backLabel="חזרה לרשימת התזכורות"
          onBack={handleBack}
        />
      </Container>
    );
  }

  const handleUpdate = async (payload) => {
    setIsSubmitting(true);
    setPageError(null);

    try {
      await reminderStore.updateReminder(
        currentVehicleId,
        reminderId,
        payload
      );
      navigate(`/vehicles/${currentVehicleId}/reminders`);
    } catch (err) {
      setPageError(err.message || "שגיאה בעדכון התזכורת. נא לנסות שוב.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setPageError(null);

    try {
      await reminderStore.deleteReminder(currentVehicleId, reminderId);
      navigate(`/vehicles/${currentVehicleId}/reminders`);
    } catch (err) {
      setPageError(err.message || "שגיאה במחיקת התזכורת. נא לנסות שוב.");
      setIsDeleting(false);
    }
  };

  return (
    <Container size="sm" py="md">
      <Stack gap="md">
        {pageError && (
          <Alert
            color="red"
            variant="light"
            radius="md"
            title="שגיאה"
            icon={<WarningCircle size={20} aria-hidden="true" />}
          >
            {pageError}
          </Alert>
        )}

        <AddReminderForm
          vehicle={currentVehicle}
          initialValues={reminder}
          isEdit={true}
          onSubmit={handleUpdate}
          onCancel={handleBack}
          onDelete={handleDelete}
          isSubmitting={isSubmitting}
          isDeleting={isDeleting}
        />
      </Stack>
    </Container>
  );
});

export default EditReminderPage;
