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
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  BellRinging,
  BellSlash,
  Car,
  CaretLeft,
  PlusCircle,
  WarningCircle,
} from "@phosphor-icons/react";
import { useReminderStore, useVehicleStore } from "../stores";
import ReminderCard from "./Reminder/ReminderCard";

import ReminderRenewModal from "./Reminder/ReminderRenewModal";

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

  const reminders =
    reminderStore.remindersVehicleId === activeVehicleId
      ? reminderStore.reminders
      : [];

  const hasBothTypes =
    reminders.some((r) => r.type === "test") &&
    reminders.some((r) => r.type === "insurance");
  const canAddReminder = !hasBothTypes && reminders.length < 2;

  const handleNavigateToReminders = () => {
    if (activeVehicleId) {
      navigate(`/vehicles/${activeVehicleId}/reminders`);
    } else {
      navigate("/reminders");
    }
  };

  const handleAddReminder = () => {
    if (activeVehicleId) {
      navigate(`/vehicles/${activeVehicleId}/reminders/add`);
    } else {
      navigate("/reminders/add");
    }
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
            <Group justify="space-between" align="center" wrap="nowrap" gap="sm">
              <Group gap="xs" align="center" wrap="nowrap">
                <ThemeIcon size={36} radius="md" variant="light" color="blue">
                  <BellRinging size={20} aria-hidden="true" />
                </ThemeIcon>
                <Title
                  id="reminders-card-title"
                  order={2}
                  size="h3"
                  fw={700}
                  c="gray.9"
                >
                  תזכורות
                </Title>
              </Group>

              {activeVehicleId && (
                <Button
                  variant="subtle"
                  size="compact-sm"
                  onClick={handleNavigateToReminders}
                  rightSection={<CaretLeft size={16} aria-hidden="true" />}
                  style={{ flexShrink: 0 }}
                >
                  ניהול תזכורות
                </Button>
              )}
            </Group>

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
            ) : !activeVehicleId ? (
              <Paper withBorder radius="lg" p="md" bg="gray.0" style={{ flex: 1 }}>
                <Center h="100%">
                  <Stack align="center" gap="xs" ta="center">
                    <ThemeIcon size={44} radius="xl" variant="light" color="gray">
                      <Car size={22} aria-hidden="true" />
                    </ThemeIcon>
                    <Text size="sm" c="dimmed">
                      בחר רכב כדי לראות את התזכורות
                    </Text>
                  </Stack>
                </Center>
              </Paper>
            ) : reminders.length === 0 ? (
              <Paper withBorder radius="lg" p="md" bg="gray.0" style={{ flex: 1 }}>
                <Center h="100%">
                  <Stack align="center" gap="sm" py="xs" ta="center">
                    <ThemeIcon size={44} radius="xl" variant="light" color="gray">
                      <BellSlash size={22} aria-hidden="true" />
                    </ThemeIcon>
                    <Text size="sm" c="dimmed">
                      עדיין לא הוגדרו תזכורות לרכב זה
                    </Text>
                    <Button
                      variant="light"
                      size="sm"
                      onClick={handleAddReminder}
                      leftSection={<PlusCircle size={16} aria-hidden="true" />}
                    >
                      הוספת תזכורת ראשונה
                    </Button>
                  </Stack>
                </Center>
              </Paper>
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

          {activeVehicleId && canAddReminder && reminders.length > 0 && (
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

