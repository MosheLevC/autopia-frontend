import { Card, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import {
  formatDateToDisplay,
  formatLicensePlate,
} from "../../utils/plateUtils";

const EMPTY_VALUE = "לא זמין";

const hasValue = (value) =>
  value !== "" && value !== null && value !== undefined;

const formatDate = (value) =>
  hasValue(value) ? formatDateToDisplay(value) || EMPTY_VALUE : EMPTY_VALUE;

const formatKilometers = (value) => {
  const numericValue = Number(value);

  return hasValue(value) && Number.isFinite(numericValue)
    ? `${numericValue.toLocaleString("he-IL")} ק״מ`
    : EMPTY_VALUE;
};

function SummarySection({ title, items }) {
  return (
    <Stack gap="sm">
      <Text fw={800}>{title}</Text>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        {items.map((item) => (
          <Paper key={item.label} withBorder radius="lg" p="md" bg="gray.0">
            <Stack gap={4}>
              <Text size="xs" c="dimmed">
                {item.label}
              </Text>
              <Text fw={700} dir={item.valueDirection} ta="right">
                {item.value}
              </Text>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
    </Stack>
  );
}

export default function VehicleSummaryStep({ vehicleData }) {
  const displayValue = (value) => (hasValue(value) ? value : EMPTY_VALUE);

  const vehicleItems = [
    {
      label: "מספר רישוי",
      value: displayValue(formatLicensePlate(vehicleData.licensePlate)),
      valueDirection: "ltr",
    },
    { label: "יצרן", value: displayValue(vehicleData.manufacturer) },
    { label: "דגם", value: displayValue(vehicleData.model) },
    { label: "שנת ייצור", value: displayValue(vehicleData.year) },
    { label: "סוג דלק", value: displayValue(vehicleData.fuelType) },
    { label: "צבע", value: displayValue(vehicleData.color) },
  ];

  const usageItems = [
    {
      label: "קילומטראז' נוכחי",
      value: formatKilometers(vehicleData.currentMileage),
    },
    {
      label: "טיפול אחרון",
      value: formatDate(vehicleData.lastServiceDate),
    },
    {
      label: "מרווח טיפולים",
      value: formatKilometers(vehicleData.serviceIntervalKm),
    },
  ];

  const validityItems = [
    {
      label: "תוקף רישיון רכב / טסט",
      value: formatDate(vehicleData.vehicleLicenseValidUntil),
    },
    {
      label: "תוקף ביטוח חובה",
      value: formatDate(vehicleData.insuranceExpiryDate),
    },
  ];

  return (
    <Card shadow="sm" p={{ base: "md", sm: "xl" }} radius="xl" withBorder>
      <Stack gap="xl">
        <Stack gap={4} ta="center">
          <Title order={3} fw={800}>
            סיכום פרטי הרכב
          </Title>
          <Text size="sm" c="dimmed">
            כדאי לעבור על הפרטים לפני הוספת הרכב
          </Text>
        </Stack>

        <SummarySection title="פרטי הרכב" items={vehicleItems} />
        <SummarySection title="שימוש ותחזוקה" items={usageItems} />
        <SummarySection title="תאריכי תוקף" items={validityItems} />
      </Stack>
    </Card>
  );
}
