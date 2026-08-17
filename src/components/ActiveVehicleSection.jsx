import { useState } from "react";
import { Link } from "react-router";
import { observer } from "mobx-react-lite";
import {
  ActionIcon,
  Alert,
  Button,
  Card,
  Center,
  Collapse,
  Divider,
  Group,
  Loader,
  Paper,
  Popover,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import VehicleCard from "./VehicleCard";
import { formatDateToDisplay } from "../utils/plateUtils";
import { useVehicleStore } from "../stores/VehicleStoreContext";

function VehicleDetails({ vehicle }) {
  const details = [
    { label: "רמת גימור", value: vehicle.trimLevel },
    { label: "סוג דלק", value: vehicle.fuelType },
    { label: "צבע", value: vehicle.color },
    {
      label: "תוקף רישיון רכב / טסט",
      value: formatDateToDisplay(vehicle.vehicleLicenseValidUntil),
    },
  ];

  return (
    <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="sm">
      {details.map((detail) => (
        <Paper key={detail.label} withBorder radius="md" p="sm">
          <Stack gap={2}>
            <Text size="xs" c="dimmed">
              {detail.label}
            </Text>
            <Text size="sm" fw={600}>
              {detail.value || "לא זמין"}
            </Text>
          </Stack>
        </Paper>
      ))}
    </SimpleGrid>
  );
}

const ActiveVehicleSection = observer(function ActiveVehicleSection() {
  const vehicleStore = useVehicleStore();
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [switcherOpened, setSwitcherOpened] = useState(false);

  const { vehicles, activeVehicle, isLoading, error } = vehicleStore;

  if (isLoading && vehicles.length === 0) {
    return (
      <Card withBorder radius="xl" shadow="sm" p={{ base: "md", sm: "xl" }}>
        <Center py="xl">
          <Stack align="center" gap="sm">
            <Loader size="md" />
            <Text size="sm" c="dimmed">
              טוען את פרטי הרכב...
            </Text>
          </Stack>
        </Center>
      </Card>
    );
  }

  if (error && !activeVehicle) {
    return (
      <Card withBorder radius="xl" shadow="sm" p={{ base: "md", sm: "xl" }}>
        <Stack gap="md">
          <Title order={2} size="h3">
            הרכב הפעיל שלי
          </Title>
          <Alert color="red" title="לא הצלחנו לטעון את הרכבים" radius="md">
            {error}
          </Alert>
        </Stack>
      </Card>
    );
  }

  if (!activeVehicle) {
    return (
      <Card
        component="section"
        aria-labelledby="active-vehicle-empty-title"
        withBorder
        radius="xl"
        shadow="sm"
        p={{ base: "md", sm: "xl" }}
      >
        <Stack align="center" gap="sm" py="lg" ta="center">
          <Title id="active-vehicle-empty-title" order={2} size="h3">
            עדיין לא הוספת רכב
          </Title>
          <Text size="sm" c="dimmed">
            הוספת רכב תאפשר לך לראות כאן את כל הפרטים החשובים.
          </Text>
          <Button
            component={Link}
            to="/vehicles/add"
            variant="light"
            mt="xs"
            leftSection={
              <i className="ph-bold ph-plus" aria-hidden="true" />
            }
          >
            הוספת רכב
          </Button>
        </Stack>
      </Card>
    );
  }

  const otherVehicles = vehicles.filter(
    (vehicle) => vehicle._id !== activeVehicle._id,
  );

  const handleVehicleSelect = (vehicleId) => {
    vehicleStore.setActiveVehicle(vehicleId);
    setSwitcherOpened(false);
  };

  return (
    <Card
      component="section"
      aria-labelledby="active-vehicle-title"
      withBorder
      radius="xl"
      shadow="sm"
      p={{ base: "md", sm: "xl" }}
    >
      <Stack gap="md">
        {error && (
          <Alert
            color="red"
            title="לא הצלחנו לעדכן את נתוני הרכב"
            radius="md"
            withCloseButton
            onClose={() => vehicleStore.clearError()}
          >
            {error}
          </Alert>
        )}

        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Title id="active-vehicle-title" order={2} size="h3">
            הרכב הפעיל שלי
          </Title>

          <Tooltip label="עריכת רכב תהיה זמינה בהמשך" withArrow>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              aria-label="עריכת פרטי הרכב"
            >
              <i className="ph-bold ph-pencil-simple" aria-hidden="true" />
            </ActionIcon>
          </Tooltip>
        </Group>

        <VehicleCard vehicle={activeVehicle} />

        <Group justify="space-between" gap="sm" wrap="wrap">
          {otherVehicles.length > 0 && (
            <Popover
              opened={switcherOpened}
              onChange={setSwitcherOpened}
              position="bottom-start"
              shadow="md"
              withinPortal
            >
              <Popover.Target>
                <Button
                  variant="light"
                  size="compact-md"
                  onClick={() => setSwitcherOpened((opened) => !opened)}
                  leftSection={
                    <i className="ph-bold ph-caret-down" aria-hidden="true" />
                  }
                  aria-expanded={switcherOpened}
                >
                  החלפת רכב
                </Button>
              </Popover.Target>

              <Popover.Dropdown w={380} maw="calc(100vw - 2rem)" p="sm">
                <Stack gap="sm">
                  <Text size="sm" fw={700}>
                    בחירת רכב אחר
                  </Text>
                  {otherVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle._id}
                      vehicle={vehicle}
                      compact
                      onClick={() => handleVehicleSelect(vehicle._id)}
                    />
                  ))}
                </Stack>
              </Popover.Dropdown>
            </Popover>
          )}

          <Button
            variant="subtle"
            color="gray"
            size="compact-md"
            onClick={() => setDetailsExpanded((expanded) => !expanded)}
            leftSection={
              <i
                className={`ph-bold ${detailsExpanded ? "ph-caret-up" : "ph-caret-down"}`}
                aria-hidden="true"
              />
            }
            aria-expanded={detailsExpanded}
            aria-controls="active-vehicle-details"
          >
            {detailsExpanded ? "הסתרת פרטים" : "הצג פרטים נוספים"}
          </Button>
        </Group>

        <Collapse expanded={detailsExpanded}>
          <Stack id="active-vehicle-details" gap="md">
            <Divider />
            <VehicleDetails vehicle={activeVehicle} />
          </Stack>
        </Collapse>
      </Stack>
    </Card>
  );
});

export default ActiveVehicleSection;
