import { Card, Flex, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { formatLicensePlate } from "../utils/plateUtils";
import { getVehicleBackground } from "../utils/vehicleBackground";

const formatMileage = (value) =>
  (Number(value) || 0).toLocaleString("he-IL");

export default function HomeVehicleCard({ vehicle }) {
  const manufacturer = vehicle.manufacturer?.trim() || "יצרן לא ידוע";
  const model = vehicle.model?.trim() || "דגם לא ידוע";
  const formattedPlate = formatLicensePlate(vehicle.licensePlate);
  const vehicleBackground = getVehicleBackground(vehicle.color);

  return (
    <Card
      component="article"
      withBorder
      radius="xl"
      shadow="xs"
      p={0}
      style={{
        backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.76) 40%, rgba(255, 255, 255, 0.2) 70%, transparent 84%), url("${vehicleBackground}")`,
        backgroundPosition: "right center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        overflow: "hidden",
      }}
    >
      <Flex dir="ltr" mih={{ base: 250, sm: 280 }}>
        <Stack
          dir="rtl"
          w="50%"
          gap="md"
          align="center"
          justify="center"
          p={{ base: "md", sm: "xl" }}
        >
          <Stack gap={2} align="center" ta="center">
            <Text size="sm" c="dimmed" fw={600}>
              {manufacturer}
            </Text>
            <Title order={3} fz={{ base: "1.35rem", sm: "2rem" }} lh={1.2}>
              {model}
            </Title>
          </Stack>

          <Text
            dir="ltr"
            fw={700}
            c="dark.8"
            bg="#ffd43b"
            px={{ base: 9, sm: 14 }}
            py={{ base: 4, sm: 6 }}
            fz={{ base: "sm", sm: "md" }}
            style={{
              border: "2px solid var(--mantine-color-dark-8)",
              borderRadius: "var(--mantine-radius-sm)",
              boxShadow: "var(--mantine-shadow-xs)",
              letterSpacing: "0.08em",
            }}
          >
            {formattedPlate || "לא זמין"}
          </Text>

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

