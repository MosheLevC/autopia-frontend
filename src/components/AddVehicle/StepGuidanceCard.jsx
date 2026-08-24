import { Card, Group, Paper, Stack, Text, ThemeIcon, Title } from "@mantine/core";

export default function StepGuidanceCard({
  title = "מה קורה אחרי החיפוש?",
  subtitle = "נמצא את פרטי הרכב שלך ונמלא עבורך את הפרטים הבסיסיים.",
  items = []
}) {
  return (
    <Card
      shadow="sm"
      p={{ base: "md", sm: "xl" }}
      radius="xl"
      withBorder
      h="100%"
    >
      <Stack gap="lg">
        <Stack gap={4} ta="center">
          <Title order={3} fw={700}>
            {title}
          </Title>
          {subtitle && (
            <Text size="xs" c="dimmed">
              {subtitle}
            </Text>
          )}
        </Stack>

        <Stack gap="md">
          {items.map((item, idx) => {
            const ItemIcon = item.icon || item.Icon;
            return (
              <Paper
                key={idx}
                p="md"
                radius="lg"
                bg="gray.0"
                withBorder
              >
                <Group wrap="nowrap" align="flex-start" gap="md">
                  <ThemeIcon
                    size={40}
                    radius="xl"
                    variant="light"
                    style={{ flexShrink: 0 }}
                  >
                    {ItemIcon ? (
                      <ItemIcon size={20} weight="bold" />
                    ) : null}
                  </ThemeIcon>
                  <div>
                    <Text size="sm" fw={700}>
                      {item.title}
                    </Text>
                    <Text size="xs" c="dimmed" mt={2}>
                      {item.desc}
                    </Text>
                  </div>
                </Group>
              </Paper>
            );
          })}
        </Stack>
      </Stack>
    </Card>
  );
}
