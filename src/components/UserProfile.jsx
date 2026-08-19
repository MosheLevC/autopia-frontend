import { Card, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";

export default function UserProfile({ user }) {
  const details = [
    { id: "firstName", label: "שם פרטי", value: user?.firstName },
    { id: "lastName", label: "שם משפחה", value: user?.lastName },
    { id: "email", label: "כתובת אימייל", value: user?.email },
  ];

  return (
    <Card
      component="section"
      aria-labelledby="profile-details-title"
      withBorder
      radius="xl"
      shadow="sm"
      p={{ base: "md", sm: "xl" }}
    >
      <Stack gap="lg">
        <Stack gap={4}>
          <Title id="profile-details-title" order={2} size="h3">
            פרטים אישיים
          </Title>
          <Text size="sm" c="dimmed">
            פרטי החשבון שלך ב-Autopia
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {details.map((detail) => (
            <Paper
              key={detail.id}
              withBorder
              radius="md"
              p="md"
              bg="gray.0"
              style={detail.id === "email" ? { gridColumn: "1 / -1" } : undefined}
            >
              <Stack gap={4}>
                <Text size="xs" c="dimmed">
                  {detail.label}
                </Text>
                <Text
                  size="md"
                  fw={600}
                  dir={detail.id === "email" ? "ltr" : undefined}
                  style={{ overflowWrap: "anywhere" }}
                >
                  {detail.value || "לא זמין"}
                </Text>
              </Stack>
            </Paper>
          ))}
        </SimpleGrid>
      </Stack>
    </Card>
  );
}
