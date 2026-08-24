import { useState } from "react";
import { useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
import {
  Alert,
  SimpleGrid,
  Stack,
} from "@mantine/core";
import {
  BellRinging,
  BellSlash,
  PlusCircle,
  WarningCircle,
} from "@phosphor-icons/react";
import { useReminderStore } from "../stores";
import { getReminderTypeInfo } from "../constants/reminderConstants";

import ReminderCard from "./Reminder/ReminderCard";
import ReminderRenewModal from "./Reminder/ReminderRenewModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import AddBottomButton from "./common/AddButton";
import SectionHeader from "./common/SectionHeader";
import StatusCard from "./common/StatusCard";

const Reminders = observer(function Reminders({ vehicle }) {
  const navigate = useNavigate();
  const reminderStore = useReminderStore();
  const vehicleId = vehicle?._id;

  const [renewingReminder, setRenewingReminder] = useState(null);
  const [deletingReminder, setDeletingReminder] = useState(null);
  const [isRenewing, setIsRenewing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState(null);

  const reminders = reminderStore.reminders || [];
  const hasBothTypes =
    reminders.some((r) => r.type === "test") &&
    reminders.some((r) => r.type === "insurance");
  const canAddReminder = !hasBothTypes && reminders.length < 2;

  const handleAddClick = () => {
    if (vehicleId) {
      navigate(`/vehicles/${vehicleId}/reminders/add`);
    } else {
      navigate("/reminders/add");
    }
  };

  const handleConfirmRenew = async () => {
    if (!renewingReminder || !vehicleId) return;

    setIsRenewing(true);
    setActionError(null);

    try {
      await reminderStore.renewReminder(vehicleId, renewingReminder._id);
      setRenewingReminder(null);
    } catch (err) {
      setActionError(err.message || "שגיאה בחידוש התזכורת");
    } finally {
      setIsRenewing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingReminder || !vehicleId) return;

    setIsDeleting(true);
    setActionError(null);

    try {
      await reminderStore.deleteReminder(vehicleId, deletingReminder._id);
      setDeletingReminder(null);
    } catch (err) {
      setActionError(err.message || "שגיאה במחיקת התזכורת");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Stack
      gap="lg"
      pb={{ base: reminders.length > 0 && canAddReminder ? 80 : 0, sm: 0 }}
    >
      {actionError && (
        <Alert
          color="red"
          variant="light"
          radius="md"
          title="שגיאה"
          icon={<WarningCircle size={20} aria-hidden="true" />}
          withCloseButton
          onClose={() => setActionError(null)}
        >
          {actionError}
        </Alert>
      )}

      <SectionHeader
        icon={BellRinging}
        title="תזכורות לרכב"
        badge={
          reminders.length > 0
            ? `${reminders.length} ${reminders.length === 1 ? "תזכורת" : "תזכורות"}`
            : undefined
        }
        action={
          reminders.length > 0 && canAddReminder
            ? {
                label: "הוסף תזכורת",
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

      {reminders.length === 0 ? (
        <StatusCard
          icon={BellSlash}
          title="אין תזכורות להצגה"
          description="עדיין לא הוגדרו תזכורות עבור רכב זה. הוסף תזכורת לטסט שנתי או לביטוח רכב כדי לקבל התראות בזמן."
          action={{
            label: "הוסף תזכורת ראשונה",
            onClick: handleAddClick,
            icon: PlusCircle,
            variant: "light",
          }}
        />
      ) : (
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          {reminders.map((reminder) => (
            <ReminderCard
              key={reminder._id}
              reminder={reminder}
              vehicleId={vehicleId}
              onRenewClick={(r) => setRenewingReminder(r)}
              onDeleteClick={(r) => setDeletingReminder(r)}
            />
          ))}
        </SimpleGrid>
      )}

      {reminders.length > 0 && canAddReminder && (
        <AddBottomButton label="הוסף תזכורת" onClick={handleAddClick} />
      )}

      <ReminderRenewModal
        opened={!!renewingReminder}
        onClose={() => setRenewingReminder(null)}
        onConfirm={handleConfirmRenew}
        reminder={renewingReminder}
        vehicle={vehicle}
        isRenewing={isRenewing}
      />

      <ConfirmDeleteModal
        opened={!!deletingReminder}
        onClose={() => setDeletingReminder(null)}
        onConfirm={handleConfirmDelete}
        title="מחיקת תזכורת"
        message={`האם אתה בטוח שברצונך למחוק את תזכורת ה${deletingReminder?.title || (deletingReminder ? getReminderTypeInfo(deletingReminder.type)?.label : "") || "תזכורת"}?`}
        description="פעולה זו הינה בלתי הפיכה והתזכורת תוסר מרשימת התזכורות של הרכב."
        confirmLabel="אישור ומחיקה"
        isDeleting={isDeleting}
      />
    </Stack>
  );
});

export default Reminders;
