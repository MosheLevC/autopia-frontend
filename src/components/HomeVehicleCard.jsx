import { Card, Flex, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { getVehicleBackground } from "../utils/vehicleBackground";
import LicensePlate from "./LicensePlate/LicensePlate";

const formatMileage = (value) =>
  (Number(value) || 0).toLocaleString("he-IL");

export default function HomeVehicleCard({ vehicle }) {
  const manufacturer = vehicle.manufacturer?.trim() || "יצרן לא ידוע";
  const model = vehicle.model?.trim() || "דגם לא ידוע";
  const vehicleBackground = getVehicleBackground(vehicle.color);

  return (
    <Card
      component="article"
      withBorder
      radius="xl"
      shadow="xs"
      p={0}
      w="100%"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.76) 40%, rgba(255, 255, 255, 0.2) 70%, transparent 84%), url("${vehicleBackground}")`,
        backgroundPosition: "right center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      <Flex dir="ltr" mih={{ base: 250, sm: 280 }} w="100%" miw={0}>
        <Stack
          dir="rtl"
          w={{ base: "62%", xs: "50%" }}
          miw={0}
          gap="md"
          align="center"
          justify="center"
          p={{ base: "sm", sm: "xl" }}
        >
          <Stack gap={2} align="center" ta="center">
            <Text size="sm" c="dimmed" fw={600}>
              {manufacturer}
            </Text>
            <Title order={3} fz={{ base: "1.35rem", sm: "2rem" }} lh={1.2}>
              {model}
            </Title>
          </Stack>

          <LicensePlate value={vehicle.licensePlate} displayOnly size="md" />

          <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="md" w="100%">
            <Stack gap={0} align="center" ta="center">
              <Text size="xs" c="dimmed">
                שנת ייצור
              </Text>
              <Text fw={700}>{vehicle.year || "לא זמין"}</Text>
            </Stack>

            <Stack gap={0} align="center" ta="center">
              <Text size="xs" c="dimmed">
                קילומטראז׳ נוכחי
              </Text>
              <Text fw={800} dir="ltr">
                {formatMileage(vehicle.currentMileage)} ק״מ
              </Text>
            </Stack>
          </SimpleGrid>
        </Stack>
      </Flex>
    </Card>
  );
}

