import { Button, Card, Stack, Text, ThemeIcon, Title } from "@mantine/core";

export default function LoadErrorCard({
  title = "שגיאה בטעינת הנתונים",
  error,
  onRetry,
}) {
  return (
    <Card withBorder radius="xl" shadow="xs" p="xl" bg="white">
      <Stack align="center" gap="sm" py="lg" ta="center">
        <ThemeIcon color="red" variant="light" size={48} radius="xl">
          <i
            className="ph-warning-circle"
            style={{ fontSize: "1.8rem" }}
            aria-hidden="true"
          />
        </ThemeIcon>
        <Title order={3} size="h4" fw={700}>
          {title}
        </Title>
        {error && (
          <Text size="sm" c="dimmed">
            {error}
          </Text>
        )}
        {onRetry && (
          <Button
            variant="light"
            color="red"
            mt="xs"
            onClick={onRetry}
            leftSection={
              <i className="ph-arrow-clockwise" aria-hidden="true" />
            }
          >
            נסה שוב
          </Button>
        )}
      </Stack>
    </Card>
  );
}
