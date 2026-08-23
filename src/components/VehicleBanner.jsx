import { Card, Flex, Stack, Text } from "@mantine/core";
import { getVehicleBackground } from "../utils/vehicleBackground";
import LicensePlate from "./LicensePlate/LicensePlate";

export default function VehicleBanner({ vehicle }) {
  if (!vehicle) return null;

  const manufacturer = vehicle.manufacturer || vehicle.make || "";
  const model = vehicle.model || "";
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
          {vehicle.licensePlate && (
            <LicensePlate value={vehicle.licensePlate} displayOnly size="sm" />
          )}
        </Stack>
      </Flex>
    </Card>
  );
}
