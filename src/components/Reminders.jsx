import { useState } from "react";
import { useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
import {
  Alert,
  Badge,
  Button,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  BellRinging,
  BellSlash,
  PlusCircle,
  WarningCircle,
} from "@phosphor-icons/react";
import { useReminderStore } from "../stores/ReminderStoreContext";
import { getReminderTypeInfo } from "../constants/reminderConstants";
import ReminderCard from "./Reminder/ReminderCard";
import ReminderRenewModal from "./Reminder/ReminderRenewModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import AddBottomButton from "./common/AddButton";

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

      <Group justify="space-between" align="center">
        <Group gap="xs" align="center">
          <ThemeIcon size={36} radius="md" variant="light" color="blue">
            <BellRinging size={20} aria-hidden="true" />
          </ThemeIcon>
          <Title order={2} size="h3" fw={700} c="gray.9">
            תזכורות לרכב
          </Title>
        </Group>

        <Group gap="sm" align="center">
          {reminders.length > 0 && (
            <Badge variant="light" color="gray" size="lg" radius="md">
              {reminders.length} {reminders.length === 1 ? "תזכורת" : "תזכורות"}
            </Badge>
          )}

          {reminders.length > 0 && canAddReminder && (
            <Button
              visibleFrom="sm"
              variant="filled"
              size="sm"
              radius="md"
              onClick={handleAddClick}
              leftSection={<PlusCircle size={16} aria-hidden="true" />}
            >
              הוסף תזכורת
            </Button>
          )}
        </Group>
      </Group>

      {reminders.length === 0 ? (
        <Card withBorder radius="xl" shadow="xs" p="xl" bg="white">
          <Stack align="center" gap="md" py="xl" ta="center">
            <ThemeIcon size={64} radius="xl" variant="light" color="gray">
              <BellSlash size={32} aria-hidden="true" />
            </ThemeIcon>
            <Stack gap={4} align="center">
              <Title order={4} fw={700} c="gray.9">
                אין תזכורות להצגה
              </Title>
              <Text c="dimmed" size="sm" maw={380}>
                עדיין לא הוגדרו תזכורות עבור רכב זה. הוסף תזכורת לטסט שנתי או
                לביטוח רכב כדי לקבל התראות בזמן.
              </Text>
            </Stack>
            <Button
              variant="light"
              onClick={handleAddClick}
              leftSection={<PlusCircle size={18} aria-hidden="true" />}
              mt="xs"
            >
              הוסף תזכורת ראשונה
            </Button>
          </Stack>
        </Card>
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
