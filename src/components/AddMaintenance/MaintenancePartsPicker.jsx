import { useState } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  getPartLabel,
  QUICK_PARTS,
} from "../../constants/maintenanceConstants";
import MaintenancePartsModal from "./MaintenancePartsModal";

export default function MaintenancePartsPicker({
  selectedParts = [],
  onTogglePart,
  onModalPartsChange,
  error,
}) {
  const [modalOpened, setModalOpened] = useState(false);

  const quickPartValues = new Set(QUICK_PARTS.map((p) => p.value));
  const extraSelectedParts = selectedParts.filter(
    (p) => !quickPartValues.has(p),
  );

  return (
    <>
      <Stack gap="xs">
        <Group gap={6} align="center">
          <Text size="sm" fw={500}>
            חלקי חילוף <Text component="span" c="red">*</Text>
          </Text>
          <Tooltip label="בחר את החלקים שהוחלפו או טופלו" position="top" withArrow>
            <ActionIcon variant="transparent" size="xs" color="gray" aria-label="מידע">
              <i className="ph-info" style={{ fontSize: "1rem" }} aria-hidden="true" />
            </ActionIcon>
          </Tooltip>
        </Group>

        <Group gap="xs" wrap="wrap">
          {QUICK_PARTS.map((part) => {
            const isSelected = selectedParts.includes(part.value);
            return (
              <Button
                key={part.value}
                type="button"
                variant={isSelected ? "light" : "default"}
                radius="md"
                size="sm"
                onClick={() => onTogglePart(part.value)}
                leftSection={
                  isSelected ? (
                    <i className="ph-check" aria-hidden="true" />
                  ) : undefined
                }
              >
                {part.label}
              </Button>
            );
          })}

          {extraSelectedParts.map((partValue) => (
            <Badge
              key={partValue}
              size="lg"
              radius="md"
              variant="light"
              h={36}
              px="sm"
              rightSection={
                <ActionIcon
                  size="xs"
                  variant="transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePart(partValue);
                  }}
                  aria-label="הסר חלק"
                >
                  <i className="ph-x" aria-hidden="true" />
                </ActionIcon>
              }
            >
              {getPartLabel(partValue)}
            </Badge>
          ))}

          <Button
            type="button"
            variant="default"
            size="sm"
            radius="md"
            onClick={() => setModalOpened(true)}
            leftSection={<i className="ph-plus" aria-hidden="true" />}
          >
            חלקים נוספים
          </Button>
        </Group>
        {error && (
          <Text size="xs" c="red">
            {error}
          </Text>
        )}
      </Stack>

      <MaintenancePartsModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        selectedParts={selectedParts}
        onChange={onModalPartsChange}
      />
    </>
  );
}
