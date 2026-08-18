import { Card, Flex, Stack, Text } from "@mantine/core";
import { formatLicensePlate } from "../utils/plateUtils";
import { getVehicleBackground } from "../utils/vehicleBackground";
import classes from "./MyCarsVehicleCard.module.css";

export default function MyCarsVehicleCard({ vehicle, isActive, onSelect }) {
  const vehicleId = vehicle._id || vehicle.id;
  const manufacturer = vehicle.manufacturer?.trim() || "יצרן לא ידוע";
  const model = vehicle.model?.trim() || "דגם לא ידוע";
  const formattedPlate = formatLicensePlate(vehicle.licensePlate);
  const vehicleName = `${manufacturer} ${model}`;
  const vehicleBackground = getVehicleBackground(vehicle.color);

  return (
    <Card
      component="button"
      type="button"
      className={classes.card}
      withBorder
      p={0}
      radius="xl"
      w="100%"
      onClick={() => onSelect(vehicleId)}
      aria-label={isActive ? `${vehicleName}, הרכב הפעיל` : `בחירת ${vehicleName}`}
      aria-pressed={isActive}
      style={{
        backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.72) 38%, rgba(255, 255, 255, 0.18) 68%, transparent 82%), url("${vehicleBackground}")`,
        backgroundPosition: "right center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        borderColor: isActive
          ? "var(--mantine-primary-color-filled)"
          : undefined,
        borderWidth: isActive ? 3 : undefined,
        boxShadow: isActive
          ? "0 8px 24px rgb(34 139 230 / 0.18)"
          : undefined,
        color: "var(--mantine-color-gray-9)",
        cursor: "pointer",
        overflow: "hidden",
        textAlign: "right",
      }}
    >
      <Flex dir="ltr" mih={{ base: 168, sm: 220 }}>
        <Stack
          dir="rtl"
          w="50%"
          gap="sm"
          align="center"
          justify="center"
          p={{ base: "md", sm: "xl" }}
        >
          <Stack gap={2} align="flex-start">
            <Text size="sm" c="dimmed" fw={600}>
              {manufacturer}
            </Text>
            <Text fz={{ base: "1.15rem", sm: "1.75rem" }} lh={1.2} fw={800}>
              {model}
            </Text>
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
              alignItems: "center",
              border: "2px solid var(--mantine-color-dark-8)",
              borderRadius: "var(--mantine-radius-sm)",
              boxShadow: "var(--mantine-shadow-xs)",
              display: "inline-flex",
              justifyContent: "center",
              letterSpacing: "0.08em",
            }}
          >
            {formattedPlate || "לא זמין"}
          </Text>

          {!isActive && (
            <Text
              className={classes.selectHint}
              visibleFrom="sm"
              size="sm"
              fw={700}
              c="blue.7"
            >
              בחר רכב
            </Text>
          )}
        </Stack>
      </Flex>
    </Card>
  );
}
