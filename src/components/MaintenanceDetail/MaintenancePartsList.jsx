import { Badge, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { getPartLabel } from "../../constants/maintenanceConstants";

export default function MaintenancePartsList({ parts = [] }) {
  return (
    <Stack gap="xs">
      <Group gap="xs" align="center">
        <ThemeIcon size="sm" variant="transparent" color="blue">
          <i className="ph-wrench" style={{ fontSize: "1.1rem" }} aria-hidden="true" />
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
              leftSection={<i className="ph-check" style={{ fontSize: "0.85rem" }} aria-hidden="true" />}
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
