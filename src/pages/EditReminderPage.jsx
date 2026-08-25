import { useEffect, useState } from "react";
import { Alert, Container, Stack } from "@mantine/core";
import { useNavigate, useParams } from "react-router";
import { observer } from "mobx-react-lite";
import { Car, Plus, WarningCircle } from "@phosphor-icons/react";
import { useHeaderTitle } from "../hooks/useHeader";
import { useCurrentVehicle } from "../hooks/useCurrentVehicle";
import { useReminderStore } from "../stores";

import NoVehicleSelected from "../components/NoVehicleSelected";
import AddReminderForm from "../components/AddReminderForm";
import PageLoading from "../components/common/PageLoading";
import NotFoundCard from "../components/common/NotFoundCard";

const EditReminderPage = observer(function EditReminderPage() {
  useHeaderTitle("עריכת תזכורת");
  const navigate = useNavigate();
  const { reminderId } = useParams();
  const { vehicle, vehicleId, isVehicleLoading, hasNoVehicle } =
    useCurrentVehicle();
  const reminderStore = useReminderStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pageError, setPageError] = useState(null);

  useEffect(() => {
    if (vehicleId && reminderId) {
      reminderStore
        .fetchReminderById(vehicleId, reminderId)
        .catch((err) => {
          setPageError(err.message || "שגיאה בטעינת פרטי התזכורת");
        });
    }
  }, [vehicleId, reminderId, reminderStore]);

  const handleBack = () => {
    if (vehicleId) {
      navigate(`/vehicles/${vehicleId}/reminders`);
    } else {
      navigate("/reminders");
    }
  };

  if (isVehicleLoading) {
    return <PageLoading message="טוען את פרטי הרכב..." />;
  }

  if (hasNoVehicle) {
    return (
      <NoVehicleSelected
        title="עדיין לא הוספת רכב"
        description="לא ניתן לערוך תזכורת מכיוון שעדיין לא הוספת רכב."
        icon={Car}
        actionLabel="הוספת רכב"
        actionPath="/vehicles/add"
        actionIcon={Plus}
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
        vehicleId,
        reminderId,
        payload
      );
      navigate(`/vehicles/${vehicleId}/reminders`);
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
      await reminderStore.deleteReminder(vehicleId, reminderId);
      navigate(`/vehicles/${vehicleId}/reminders`);
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
          vehicle={vehicle}
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
