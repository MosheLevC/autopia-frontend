import { useState } from "react";
import { observer } from "mobx-react-lite";
import {
  ActionIcon,
  Button,
  Card,
  Center,
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
import HomeVehicleCard from "./HomeVehicleCard";
import EditVehicleModal from "./EditVehicleModal";
import NoVehicleSelected from "./NoVehicleSelected";
import { formatDateToDisplay } from "../utils/plateUtils";
import { useVehicleStore } from "../stores/VehicleStoreContext";

const SECTION_CARD_PROPS = {
  withBorder: true,
  radius: "xl",
  shadow: "sm",
  p: { base: "md", sm: "xl" },
  w: "100%",
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
  const [editOpened, setEditOpened] = useState(false);

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
      <NoVehicleSelected
        title="עדיין לא הוספת רכב"
        description="הוספת רכב תאפשר לך לראות כאן את כל הפרטים החשובים."
        icon="ph-car"
        actionLabel="הוספת רכב"
        actionPath="/vehicles/add"
        actionIcon="ph-plus"
      />
    );
  }

  return (
    <>
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

            <Tooltip label="עריכת פרטי הרכב" withArrow>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="lg"
                onClick={() => setEditOpened(true)}
                aria-label="עריכת פרטי הרכב"
              >
                <i className="ph-bold ph-pencil-simple" aria-hidden="true" />
              </ActionIcon>
            </Tooltip>
          </Group>

          <HomeVehicleCard vehicle={activeVehicle} />

          <Stack gap="sm">
            <Divider />
            <Text size="sm" fw={700}>
              פרטי הרכב
            </Text>
            <VehicleDetails vehicle={activeVehicle} />
          </Stack>
        </Stack>
      </Card>

      <EditVehicleModal
        opened={editOpened}
        onClose={() => setEditOpened(false)}
        vehicle={activeVehicle}
      />
    </>
  );
});

export default ActiveVehicleSection;
