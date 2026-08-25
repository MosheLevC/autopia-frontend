import { Card, Flex, Stack, Text } from "@mantine/core";
import { getVehicleBackground } from "../utils/vehicleBackground";
import LicensePlate from "./LicensePlate/LicensePlate";
import classes from "./MyCarsVehicleCard.module.css";

export default function MyCarsVehicleCard({
  vehicle,
  isActive,
  isDeleteMode = false,
  isDeleteSelected = false,
  onSelect,
}) {
  const vehicleId = vehicle._id;
  const manufacturer = vehicle.manufacturer?.trim() || "יצרן לא ידוע";
  const model = vehicle.model?.trim() || "דגם לא ידוע";
  const vehicleName = `${manufacturer} ${model}`;
  const vehicleBackground = getVehicleBackground(vehicle.color);
  const cardIsSelected = isDeleteMode ? isDeleteSelected : isActive;
  const accessibleLabel = isDeleteMode
    ? isDeleteSelected
      ? `${vehicleName}, נבחר למחיקה`
      : `בחירת ${vehicleName} למחיקה`
    : isActive
      ? `${vehicleName}, הרכב הפעיל`
      : `בחירת ${vehicleName}`;

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
      aria-label={accessibleLabel}
      aria-pressed={cardIsSelected}
      data-delete-mode={isDeleteMode || undefined}
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
        minWidth: 0,
        overflow: "hidden",
        textAlign: "right",
      }}
    >
      <Flex dir="ltr" mih={{ base: 168, sm: 220 }} w="100%" miw={0}>
        <Stack
          dir="rtl"
          w={{ base: "62%", xs: "50%" }}
          miw={0}
          gap="sm"
          align="center"
          justify="center"
          p={{ base: "sm", sm: "xl" }}
        >
          <Stack gap={2} align="flex-start">
            <Text size="sm" c="dimmed" fw={600}>
              {manufacturer}
            </Text>
            <Text fz={{ base: "1.15rem", sm: "1.75rem" }} lh={1.2} fw={800}>
              {model}
            </Text>
          </Stack>

          <LicensePlate value={vehicle.licensePlate} displayOnly size="md" />

          {!isDeleteMode && !isActive && (
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

          {isDeleteMode && !isDeleteSelected && (
            <Text
              className={classes.selectHint}
              visibleFrom="sm"
              size="sm"
              fw={700}
              c="red.7"
            >
              בחר למחיקה
            </Text>
          )}
        </Stack>
      </Flex>
    </Card>
  );
}
