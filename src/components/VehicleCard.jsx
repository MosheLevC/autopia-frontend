import {
  Badge,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import VehicleLogo from "./VehicleLogo";
import { formatLicensePlate } from "../utils/plateUtils";

export default function VehicleCard({ vehicle, compact = false, onClick }) {
  const mileage = Number(vehicle.currentMileage || 0).toLocaleString("he-IL");

  const content = (
    <Paper
      withBorder
      radius="lg"
      p={compact ? "sm" : "md"}
      bg={compact ? "white" : "gray.0"}
    >
      <Flex
        direction={compact ? "row" : { base: "column", sm: "row" }}
        align={compact ? "center" : { base: "stretch", sm: "center" }}
        justify="space-between"
        gap="md"
      >
        <Group wrap="nowrap" gap="md">
          <VehicleLogo
            manufacturer={vehicle.manufacturer}
            size={compact ? 40 : 52}
          />

          <Stack gap={3}>
            <Group gap="xs" wrap="wrap">
              <Text fw={700} size={compact ? "sm" : "lg"}>
                {vehicle.manufacturer} {vehicle.model}
              </Text>
              <Badge variant="light" color="gray" size="sm">
                {vehicle.year}
              </Badge>
            </Group>

            <Text
              size={compact ? "xs" : "sm"}
              c="dimmed"
              dir="ltr"
              ta="left"
            >
              {formatLicensePlate(vehicle.licensePlate)}
            </Text>
          </Stack>
        </Group>

        <Stack
          gap={0}
          align={compact ? "flex-end" : { base: "flex-start", sm: "flex-end" }}
        >
          <Text size="xs" c="dimmed">
            קילומטראז' נוכחי
          </Text>
          <Text fw={700} size={compact ? "sm" : "md"} dir="ltr">
            {mileage} ק״מ
          </Text>
        </Stack>
      </Flex>
    </Paper>
  );

  if (!onClick) {
    return content;
  }

  return (
    <UnstyledButton
      onClick={onClick}
      w="100%"
      aria-label={`בחירת ${vehicle.manufacturer} ${vehicle.model}`}
    >
      {content}
    </UnstyledButton>
  );
}
