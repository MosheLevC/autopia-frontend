import { Card, Group, Paper, Stack, Text, Title } from "@mantine/core";

export default function StepGuidanceCard({
  title = "מה קורה אחרי החיפוש?",
  subtitle = "נמצא את פרטי הרכב שלך ונמלא עבורך את הפרטים הבסיסיים.",
  items = []
}) {
  return (
    <Card
      shadow="sm"
      padding="xl"
      radius="xl"
      withBorder
      style={{
        backgroundColor: "#ffffff",
        borderColor: "#e2e8f0",
        height: "100%"
      }}
    >
      <Stack spacing="lg">
        <div style={{ textAlign: "center" }}>
          <Title order={3} style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a" }}>
            {title}
          </Title>
          {subtitle && (
            <Text size="xs" c="dimmed" mt={4}>
              {subtitle}
            </Text>
          )}
        </div>

        <Stack spacing="md">
          {items.map((item, idx) => (
            <Paper
              key={idx}
              p="md"
              radius="lg"
              style={{ backgroundColor: "#f8fafc", border: "1px solid #f1f5f9" }}
            >
              <Group noWrap align="flex-start" spacing="md">
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: "#eff6ff",
                    color: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    flexShrink: 0
                  }}
                >
                  <i className={`ph-bold ${item.icon}`} />
                </div>
                <div>
                  <Text size="sm" weight={700} style={{ color: "#0f172a" }}>
                    {item.title}
                  </Text>
                  <Text size="xs" c="dimmed" mt={2}>
                    {item.desc}
                  </Text>
                </div>
              </Group>
            </Paper>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
