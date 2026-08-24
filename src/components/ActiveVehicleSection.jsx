import { useState } from "react";
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
  UnstyledButton,
} from "@mantine/core";
import {
  CaretDown,
  WarningCircle,
  ArrowClockwise,
  PencilSimple,
  Car,
  Plus,
} from "@phosphor-icons/react";
import HomeVehicleCard from "./HomeVehicleCard";
import EditVehicleModal from "./EditVehicleModal";
import NoVehicleSelected from "./NoVehicleSelected";
import { formatDateToDisplay } from "../utils/plateUtils";
import { getAdditionalVehicleDetails } from "../utils/governmentVehicleDetails";
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
    <SimpleGrid cols={{ base: 2, md: 4 }} spacing="sm">
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

function AdditionalVehicleDetails({ vehicle }) {
  const [opened, setOpened] = useState(false);
  const details = getAdditionalVehicleDetails(vehicle);

  if (details.length === 0) {
    return null;
  }

  return (
    <Stack gap="sm">
      <Divider />
      <UnstyledButton
        type="button"
        w="100%"
        onClick={() => setOpened((current) => !current)}
        aria-expanded={opened}
        aria-controls="additional-vehicle-details"
      >
        <Group justify="space-between" gap="sm" wrap="nowrap">
          <Text size="sm" fw={700}>
            פרטים נוספים
          </Text>
          <ThemeIcon variant="transparent" color="gray" size="sm">
            <CaretDown
              size={16}
              weight="bold"
              style={{
                transition: "transform 150ms ease",
                transform: opened ? "rotate(180deg)" : "rotate(0deg)",
              }}
              aria-hidden="true"
            />
          </ThemeIcon>
        </Group>
      </UnstyledButton>

      <Collapse expanded={opened} keepMountedMode="display-none">
        <SimpleGrid
          id="additional-vehicle-details"
          cols={{ base: 2, md: 4 }}
          spacing="sm"
        >
          {details.map((detail) => (
            <Paper key={detail.key} withBorder radius="md" p="sm" miw={0}>
              <Stack gap={2}>
                <Text size="xs" c="dimmed">
                  {detail.label}
                </Text>
                <Text size="sm" fw={600} style={{ overflowWrap: "anywhere" }}>
                  {detail.value}
                </Text>
              </Stack>
            </Paper>
          ))}
        </SimpleGrid>
      </Collapse>
    </Stack>
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
            <WarningCircle size={28} weight="bold" aria-hidden="true" />
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
            leftSection={<ArrowClockwise size={18} weight="bold" aria-hidden="true" />}
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
        icon={Car}
        actionLabel="הוספת רכב"
        actionPath="/vehicles/add"
        actionIcon={Plus}
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
                <PencilSimple size={20} weight="bold" aria-hidden="true" />
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

          <AdditionalVehicleDetails vehicle={activeVehicle} />
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
