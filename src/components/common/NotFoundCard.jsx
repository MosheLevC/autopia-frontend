import { Button, Card, Stack, Text, ThemeIcon, Title } from "@mantine/core";

export default function NotFoundCard({
  title = "הפריט לא נמצא",
  description = "הפריט המבוקש אינו קיים או שנמחק.",
  backLabel = "חזרה",
  onBack,
}) {
  return (
    <Card withBorder radius="xl" shadow="xs" p="xl" bg="white" ta="center">
      <Stack align="center" gap="md" py="lg">
        <ThemeIcon size={64} radius="xl" variant="light" color="red">
          <i
            className="ph-warning-circle"
            style={{ fontSize: "2rem" }}
            aria-hidden="true"
          />
        </ThemeIcon>
        <Stack gap={4} align="center">
          <Title order={4} fw={700}>
            {title}
          </Title>
          {description && (
            <Text size="sm" c="dimmed" maw={360}>
              {description}
            </Text>
          )}
        </Stack>
        {onBack && (
          <Button
            variant="light"
            onClick={onBack}
            leftSection={<i className="ph-arrow-right" aria-hidden="true" />}
          >
            {backLabel}
          </Button>
        )}
      </Stack>
    </Card>
  );
}
