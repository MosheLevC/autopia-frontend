import { useState } from "react";
import { Button, Popover, Stack, Text } from "@mantine/core";
import VehicleCard from "./VehicleCard";

export default function VehicleSwitcher({
  vehicles,
  activeVehicleId,
  onVehicleSelect,
}) {
  const [opened, setOpened] = useState(false);
  const selectableVehicles = vehicles.filter(
    (vehicle) => vehicle._id !== activeVehicleId,
  );

  if (selectableVehicles.length === 0) {
    return null;
  }

  const handleSelect = (vehicleId) => {
    onVehicleSelect(vehicleId);
    setOpened(false);
  };

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-start"
      shadow="md"
      withinPortal
    >
      <Popover.Target>
        <Button
          variant="light"
          size="compact-md"
          onClick={() => setOpened((current) => !current)}
          leftSection={
            <i className="ph-bold ph-caret-down" aria-hidden="true" />
          }
          aria-expanded={opened}
        >
          החלפת רכב
        </Button>
      </Popover.Target>

      <Popover.Dropdown w={380} maw="calc(100vw - 2rem)" p="sm">
        <Stack gap="sm">
          <Text size="sm" fw={700}>
            בחירת רכב אחר
          </Text>
          {selectableVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle._id}
              vehicle={vehicle}
              compact
              onClick={() => handleSelect(vehicle._id)}
            />
          ))}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
