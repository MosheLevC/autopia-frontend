import { Card, Flex, Stack, Text } from "@mantine/core";
import { formatLicensePlate } from "../../utils/plateUtils";
import { getVehicleBackground } from "../../utils/vehicleBackground";

export default function MaintenanceVehicleBanner({ vehicle }) {
  if (!vehicle) return null;

  const manufacturer = vehicle.manufacturer || vehicle.make || "";
  const model = vehicle.model || "";
  const formattedPlate = vehicle.licensePlate
    ? formatLicensePlate(vehicle.licensePlate)
    : "";
  const vehicleBackground = getVehicleBackground(vehicle.color);

  return (
    <Card
      withBorder
      radius="lg"
      p={0}
      style={{
        backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.72) 42%, rgba(255, 255, 255, 0.18) 72%, transparent 88%), url("${vehicleBackground}")`,
        backgroundPosition: "right 62%",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        overflow: "hidden",
      }}
    >
      <Flex dir="ltr" mih={{ base: 110, sm: 120 }}>
        <Stack
          dir="rtl"
          gap={4}
          align="flex-start"
          justify="center"
          p={{ base: "sm", sm: "md" }}
        >
          {manufacturer && (
            <Text size="xs" c="dimmed" fw={600} lh={1.1}>
              {manufacturer}
            </Text>
          )}
          {model && (
            <Text size="md" fw={800} c="gray.9" lh={1.2}>
              {model}
            </Text>
          )}
          {formattedPlate && (
            <Text
              dir="ltr"
              fw={700}
              c="dark.8"
              bg="#ffd43b"
              px={8}
              py={2}
              fz="xs"
              mt={2}
              style={{
                border: "1.5px solid var(--mantine-color-dark-8)",
                borderRadius: "var(--mantine-radius-xs)",
                boxShadow: "var(--mantine-shadow-xs)",
                letterSpacing: "0.08em",
                display: "inline-flex",
              }}
            >
              {formattedPlate}
            </Text>
          )}
        </Stack>
      </Flex>
    </Card>
  );
}
