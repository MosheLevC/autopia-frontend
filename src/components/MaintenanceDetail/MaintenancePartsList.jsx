import { Badge, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { Check, Wrench } from "@phosphor-icons/react";
import { getPartLabel } from "../../constants/maintenanceConstants";

export default function MaintenancePartsList({ parts = [] }) {
  return (
    <Stack gap="xs">
      <Group gap="xs" align="center">
        <ThemeIcon size="sm" variant="transparent" color="blue">
          <Wrench size={18} aria-hidden="true" />
        </ThemeIcon>
        <Text fw={700} size="sm" c="gray.9">
          חלקים שהוחלפו / טופלו
        </Text>
      </Group>

      {Array.isArray(parts) && parts.length > 0 ? (
        <Group gap="xs" wrap="wrap">
          {parts.map((part) => (
            <Badge
              key={part}
              variant="light"
              color="blue"
              size="md"
              radius="md"
              leftSection={<Check size={14} weight="bold" aria-hidden="true" />}
            >
              {getPartLabel(part)}
            </Badge>
          ))}
        </Group>
      ) : (
        <Text size="sm" c="dimmed">
          לא צוינו חלקים
        </Text>
      )}
    </Stack>
  );
}

