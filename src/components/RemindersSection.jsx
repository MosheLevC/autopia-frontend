import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
import {
  Alert,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Stack,
  Text,
} from "@mantine/core";
import {
  BellRinging,
  BellSlash,
  CaretLeft,
  PlusCircle,
  WarningCircle,
} from "@phosphor-icons/react";
import { getAvailableReminderTypes } from "../constants/reminderConstants";
import { useReminderStore, useVehicleStore } from "../stores";
import ReminderCard from "./Reminder/ReminderCard";
import ReminderRenewModal from "./Reminder/ReminderRenewModal";
import SectionHeader from "./common/SectionHeader";
import StatusCard from "./common/StatusCard";

const SECTION_CARD_PROPS = {
  withBorder: true,
  radius: "xl",
  shadow: "sm",
  p: { base: "md", sm: "xl" },
  w: "100%",
  h: "100%",
};

const RemindersSection = observer(function RemindersSection() {
  const navigate = useNavigate();
  const vehicleStore = useVehicleStore();
  const reminderStore = useReminderStore();

  const [renewingReminder, setRenewingReminder] = useState(null);
  const [isRenewing, setIsRenewing] = useState(false);
  const [actionError, setActionError] = useState(null);

  const activeVehicle = vehicleStore.activeVehicle;
  const activeVehicleId = activeVehicle?._id;

  useEffect(() => {
    if (activeVehicleId) {
      reminderStore.fetchReminders(activeVehicleId).catch(() => {});
    }
  }, [activeVehicleId, reminderStore]);

  if (!activeVehicle || !activeVehicleId) {
    return null;
  }

  const reminders =
    reminderStore.remindersVehicleId === activeVehicleId
      ? reminderStore.reminders
      : [];

  const canAddReminder = getAvailableReminderTypes(reminders).length > 0;

  const handleNavigateToReminders = () => {
    navigate(`/vehicles/${activeVehicleId}/reminders`);
  };

  const handleAddReminder = () => {
    navigate(`/vehicles/${activeVehicleId}/reminders/add`);
  };

  const handleConfirmRenew = async () => {
    if (!renewingReminder || !activeVehicleId) return;

    setIsRenewing(true);
    setActionError(null);

    try {
      await reminderStore.renewReminder(activeVehicleId, renewingReminder._id);
      setRenewingReminder(null);
    } catch (err) {
      setActionError(err.message || "שגיאה בחידוש התזכורת");
    } finally {
      setIsRenewing(false);
    }
  };

  return (
    <>
      <Card
        {...SECTION_CARD_PROPS}
        component="section"
        aria-labelledby="reminders-card-title"
        bg="white"
      >
        <Stack gap="md" h="100%" justify="space-between">
          <Stack gap="md" style={{ flex: 1 }}>
            <SectionHeader
              icon={BellRinging}
              title="תזכורות"
              titleId="reminders-card-title"
              action={{
                label: "ניהול תזכורות",
                onClick: handleNavigateToReminders,
                rightSection: <CaretLeft size={16} aria-hidden="true" />,
              }}
            />

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

            {reminderStore.isLoading && reminders.length === 0 ? (
              <Center py="xl" style={{ flex: 1 }}>
                <Stack align="center" gap="xs">
                  <Loader size="sm" />
                  <Text size="sm" c="dimmed">
                    טוען תזכורות...
                  </Text>
                </Stack>
              </Center>
            ) : reminders.length === 0 ? (
              <StatusCard
                variant="paper"
                icon={BellSlash}
                iconSize={22}
                iconThemeSize={44}
                description="עדיין לא הוגדרו תזכורות לרכב זה"
                py="xs"
                gap="sm"
                flex={1}
                action={{
                  label: "הוספת תזכורת ראשונה",
                  onClick: handleAddReminder,
                  icon: PlusCircle,
                  variant: "light",
                  size: "sm",
                }}
              />
            ) : (
              <Stack gap="sm" style={{ flex: 1 }}>
                {reminders.map((reminder) => (
                  <ReminderCard
                    key={reminder._id}
                    reminder={reminder}
                    vehicleId={activeVehicleId}
                    compact
                    onDetailClick={handleNavigateToReminders}
                    onRenewClick={(r) => setRenewingReminder(r)}
                  />
                ))}
              </Stack>
            )}
          </Stack>

          {canAddReminder && reminders.length > 0 && (
            <Group justify="flex-end" pt="xs">
              <Button
                variant="light"
                size="sm"
                w={{ base: "100%", sm: "auto" }}
                onClick={handleAddReminder}
                leftSection={<PlusCircle size={16} aria-hidden="true" />}
              >
                הוספת תזכורת
              </Button>
            </Group>
          )}
        </Stack>
      </Card>

      <ReminderRenewModal
        opened={!!renewingReminder}
        onClose={() => setRenewingReminder(null)}
        onConfirm={handleConfirmRenew}
        reminder={renewingReminder}
        vehicle={activeVehicle}
        isRenewing={isRenewing}
      />
    </>
  );
});

export default RemindersSection;
