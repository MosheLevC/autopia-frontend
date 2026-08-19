import { Button, Group, Modal, MultiSelect, Stack, Text } from "@mantine/core";
import { ALL_MAINTENANCE_PARTS } from "../../constants/maintenanceConstants";

const filterParts = ({ options, search }) => {
  const query = search.toLowerCase().trim();
  if (!query) return options;

  const filtered = options.filter((option) =>
    option.label.toLowerCase().includes(query),
  );

  if (filtered.length === 0) {
    const otherOption = options.find((o) => o.value === "other");
    return otherOption ? [otherOption] : [];
  }

  return filtered;
};

export default function MaintenancePartsModal({
  opened,
  onClose,
  selectedParts = [],
  onChange,
}) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="בחירת חלקי חילוף"
      centered
      radius="lg"
      size="md"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          בחר חלקי חילוף שהוחלפו או טופלו מתוך הרשימה המלאה:
        </Text>
        <MultiSelect
          data={ALL_MAINTENANCE_PARTS}
          value={selectedParts}
          onChange={onChange}
          filter={filterParts}
          placeholder="חפש ובחר חלקי חילוף..."
          searchable
          clearable
          size="md"
          radius="md"
        />
        <Group justify="flex-end" mt="md">
          <Button onClick={onClose}>
            אישור
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
