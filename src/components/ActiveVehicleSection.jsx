import { useState } from "react";
import { Link } from "react-router";
import { observer } from "mobx-react-lite";
import {
  ActionIcon,
  Button,
  Card,
  Center,
  Collapse,
  Divider,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import VehicleCard from "./VehicleCard";
import VehicleSwitcher from "./VehicleSwitcher";
import { formatDateToDisplay } from "../utils/plateUtils";
import { useVehicleStore } from "../stores/VehicleStoreContext";

const SECTION_CARD_PROPS = {
  withBorder: true,
  radius: "xl",
  shadow: "sm",
  p: { base: "md", sm: "xl" },
};

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

  const { vehicles, activeVehicle, isLoading, error } = vehicleStore;

  if (isLoading && vehicles.length === 0) {
    return (
      <Card {...SECTION_CARD_PROPS}>
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
      <Card
        {...SECTION_CARD_PROPS}
        component="section"
        aria-labelledby="active-vehicle-error-title"
      >
        <Stack align="center" gap="sm" py="lg" ta="center">
          <ThemeIcon color="red" variant="light" size={48} radius="xl">
            <i
              className="ph-bold ph-warning-circle"
              aria-hidden="true"
            />
          </ThemeIcon>
          <Title id="active-vehicle-error-title" order={2} size="h3">
            לא הצלחנו לטעון את הרכבים
          </Title>
          <Text size="sm" c="dimmed">
            לא ניתן להציג כרגע את פרטי הרכב.
          </Text>
          <Button
            variant="light"
            color="red"
            mt="xs"
            onClick={() => vehicleStore.fetchVehicles().catch(() => {})}
            leftSection={
              <i className="ph-bold ph-arrow-clockwise" aria-hidden="true" />
            }
          >
            נסה שוב
          </Button>
        </Stack>
      </Card>
    );
  }

  if (!activeVehicle) {
    return (
      <Card
        {...SECTION_CARD_PROPS}
        component="section"
        aria-labelledby="active-vehicle-empty-title"
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

  const handleVehicleSelect = (vehicleId) => {
    vehicleStore.setActiveVehicle(vehicleId);
  };

  return (
    <Card
      {...SECTION_CARD_PROPS}
      component="section"
      aria-labelledby="active-vehicle-title"
    >
      <Stack gap="md">
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
          <VehicleSwitcher
            vehicles={vehicles}
            activeVehicleId={activeVehicle._id}
            onVehicleSelect={handleVehicleSelect}
          />

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
