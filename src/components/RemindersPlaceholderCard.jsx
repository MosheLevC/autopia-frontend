import { Card, Center, Group, Stack, Text, ThemeIcon, Title } from "@mantine/core";

export default function RemindersPlaceholderCard() {
  return (
    <Card
      component="section"
      aria-labelledby="reminders-placeholder-title"
      withBorder
      radius="xl"
      shadow="sm"
      p={{ base: "md", sm: "xl" }}
      w="100%"
      h="100%"
    >
      <Stack gap="md" h="100%">
        <Group gap="xs" align="center" wrap="nowrap">
          <ThemeIcon size={36} radius="md" variant="light" color="blue">
            <i
              className="ph-bell"
              style={{ fontSize: "1.3rem" }}
              aria-hidden="true"
            />
          </ThemeIcon>
          <Title
            id="reminders-placeholder-title"
            order={2}
            size="h3"
            fw={700}
            c="gray.9"
          >
            תזכורות
          </Title>
        </Group>

        <Center py="xl" style={{ flex: 1 }}>
          <Stack align="center" gap="xs" ta="center">
            <ThemeIcon size={44} radius="xl" variant="light" color="gray">
              <i
                className="ph-bell-ringing"
                style={{ fontSize: "1.35rem" }}
                aria-hidden="true"
              />
            </ThemeIcon>
            <Text size="sm" c="dimmed">
              אזור התזכורות יתווסף בקרוב
            </Text>
          </Stack>
        </Center>
      </Stack>
    </Card>
  );
}
