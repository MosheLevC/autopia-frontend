import {
  Box,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
} from "@mantine/core";

const SUGGESTED_PROMPTS = [
  {
    icon: "ph-wrench",
    label: "איזה מידע חשוב לבדוק לפני הטיפול הבא?",
  },
  {
    icon: "ph-gauge",
    label: "מה כדאי לדעת על הקילומטראז׳ הנוכחי שלי?",
  },
  {
    icon: "ph-warning-circle",
    label: "נדלקה נורת אזהרה — איזה פרטים חשוב לתאר?",
  },
  {
    icon: "ph-question",
    label: "יש לי שאלה כללית על הרכב שלי",
  },
];

const getVehicleName = (vehicle) =>
  [vehicle?.manufacturer, vehicle?.model, vehicle?.year]
    .filter(Boolean)
    .join(" ");

export default function AIChatEmptyState({
  vehicle,
  onSuggestionSelect,
  suggestions = SUGGESTED_PROMPTS,
}) {
  const vehicleName = getVehicleName(vehicle);

  return (
    <Box
      className="ai-local-scroll"
      h="100%"
      style={{ overflowY: "auto", overflowX: "hidden" }}
    >
      <Stack
        align="center"
        justify="center"
        gap="md"
        mih="100%"
        px={{ base: 0, sm: "lg" }}
        py={{ base: "sm", sm: "xl" }}
      >
        <ThemeIcon size={52} radius="md" variant="light" color="gray">
          <i
            className="ph-chat-circle-dots"
            aria-hidden="true"
            style={{ fontSize: "1.65rem" }}
          />
        </ThemeIcon>

        <Stack align="center" gap={6} ta="center">
          <Title order={2} fz={{ base: "1.45rem", sm: "1.75rem" }}>
            איך אפשר לעזור עם הרכב?
          </Title>
          <Text c="dimmed" size="sm" maw={560}>
            אפשר לשאול על תחזוקה, קילומטראז׳, נורות אזהרה ונושאים כלליים.
            בשלב הזה התשובות הן להדגמת חוויית השיחה בלבד.
          </Text>
          <Text size="xs" c="dimmed" fw={600} dir="auto">
            בהקשר של {vehicleName}
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm" w="100%" maw={720}>
          {suggestions.map((suggestion) => (
            <UnstyledButton
              key={suggestion.label}
              type="button"
              onClick={() => onSuggestionSelect(suggestion.label)}
              aria-label={`שליחת השאלה: ${suggestion.label}`}
              style={{ minWidth: 0 }}
            >
              <Paper
                withBorder
                radius="md"
                p={{ base: "sm", sm: "md" }}
                h="100%"
                bg="white"
                className="ai-suggestion-card"
                style={{
                  transition: "border-color 150ms ease, box-shadow 150ms ease",
                }}
              >
                <Group gap="sm" wrap="nowrap" align="flex-start">
                  <ThemeIcon variant="light" radius="xl" size="md">
                    <i className={suggestion.icon} aria-hidden="true" />
                  </ThemeIcon>
                  <Text size="sm" fw={600} style={{ overflowWrap: "anywhere" }}>
                    {suggestion.label}
                  </Text>
                </Group>
              </Paper>
            </UnstyledButton>
          ))}
        </SimpleGrid>
      </Stack>
    </Box>
  );
}

export { SUGGESTED_PROMPTS };
