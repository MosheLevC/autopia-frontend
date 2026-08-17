import { useState } from "react";
import {
  ActionIcon,
  Button,
  Card,
  Collapse,
  Divider,
  Group,
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

const MOCK_VEHICLES = [
  {
    _id: "mock-vehicle-1",
    licensePlate: "12345678",
    manufacturer: "טויוטה",
    model: "Corolla Hybrid",
    year: 2022,
    currentMileage: 42680,
    trimLevel: "Sun",
    fuelType: "היברידי",
    color: "לבן פנינה",
    vehicleLicenseValidUntil: "2027-02-18",
  },
  {
    _id: "mock-vehicle-2",
    licensePlate: "5873462",
    manufacturer: "מאזדה",
    model: "CX-30",
    year: 2021,
    currentMileage: 61920,
    trimLevel: "Comfort",
    fuelType: "בנזין",
    color: "אפור מטאלי",
    vehicleLicenseValidUntil: "2026-11-04",
  },
  {
    _id: "mock-vehicle-3",
    licensePlate: "42917603",
    manufacturer: "קיה",
    model: "Niro",
    year: 2023,
    currentMileage: 18740,
    trimLevel: "Premium",
    fuelType: "היברידי",
    color: "כחול",
    vehicleLicenseValidUntil: "2027-05-29",
  },
];

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

export default function ActiveVehicleSection() {
  const [activeVehicleId, setActiveVehicleId] = useState(MOCK_VEHICLES[0]._id);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [switcherOpened, setSwitcherOpened] = useState(false);

  const activeVehicle =
    MOCK_VEHICLES.find((vehicle) => vehicle._id === activeVehicleId) ||
    MOCK_VEHICLES[0];
  const otherVehicles = MOCK_VEHICLES.filter(
    (vehicle) => vehicle._id !== activeVehicle._id,
  );

  const handleVehicleSelect = (vehicleId) => {
    setActiveVehicleId(vehicleId);
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
}
