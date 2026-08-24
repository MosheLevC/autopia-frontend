import { Button, Card, Paper, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { FilePdf } from "@phosphor-icons/react";

export default function VehicleManualStep({ onContinue }) {
  return (
    <Card shadow="sm" p={{ base: "md", sm: "xl" }} radius="xl" withBorder>
      <Stack gap="xl" align="center">
        <Stack gap={4} ta="center">
          <Title order={3} fw={800}>
            ספר רכב
          </Title>
          <Text size="sm" c="dimmed" maw={520}>
            העלאת ספר הרכב תאפשר לנו להציג לך מידע מדויק ושימושי יותר בעתיד
          </Text>
        </Stack>

        <Paper
          component="button"
          type="button"
          onClick={onContinue}
          aria-label="העלאת ספר רכב והמשך"
          radius="xl"
          p={{ base: "xl", sm: 48 }}
          w="100%"
          maw={560}
          style={{
            border: "2px dashed var(--mantine-primary-color-4)",
            backgroundColor: "var(--mantine-primary-color-0)",
            cursor: "pointer",
          }}
        >
          <Stack gap="sm" align="center">
            <ThemeIcon size={64} radius="xl" variant="light">
              <FilePdf size={32} weight="bold" aria-hidden="true" />
            </ThemeIcon>

            <Text fw={800} size="lg" ta="center">
              העלאת ספר רכב
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              אפשר יהיה להעלות קובץ PDF
            </Text>
            <Text size="xs" c="dimmed" ta="center">
              העלאת הקובץ תתווסף בהמשך. כרגע לחיצה תמשיך לשלב הבא.
            </Text>
          </Stack>
        </Paper>

        <Button type="button" variant="subtle" onClick={onContinue}>
          דלג לעת עתה
        </Button>
      </Stack>
    </Card>
  );
}

