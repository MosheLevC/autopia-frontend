import { Button, Card, Container, Group, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { useNavigate, useParams } from "react-router";
import { useHeaderTitle } from "../context/HeaderContext";

export default function MaintenanceDetailPage() {
  useHeaderTitle("פרטי טיפול");
  const navigate = useNavigate();
  const { vehicleId, maintenanceId } = useParams();

  const handleBack = () => {
    if (vehicleId) {
      navigate(`/vehicles/${vehicleId}/maintenances`);
    } else {
      navigate("/maintenances");
    }
  };

  return (
    <Container size="sm" py="xl">
      <Card withBorder radius="xl" shadow="sm" p="xl" bg="white">
        <Stack align="center" gap="md" py="lg" ta="center">
          <ThemeIcon size={64} radius="xl" variant="light" color="blue">
            <i className="ph-wrench" style={{ fontSize: "2rem" }} aria-hidden="true" />
          </ThemeIcon>

          <Stack gap={6} align="center">
            <Title order={3} fw={700}>
              פרטי טיפול
            </Title>
            <Text c="dimmed" size="sm" maw={380}>
              מסך פרטי טיפול מלאים (כולל עריכה ומחיקה) ייבנה בהמשך בענף נפרד.
            </Text>
            {maintenanceId && (
              <Text size="xs" c="dimmed" dir="ltr">
                ID: {maintenanceId}
              </Text>
            )}
          </Stack>

          <Group justify="center" mt="md">
            <Button
              variant="light"
              onClick={handleBack}
              leftSection={<i className="ph-arrow-right" aria-hidden="true" />}
            >
              חזרה ליומן הטיפולים
            </Button>
          </Group>
        </Stack>
      </Card>
    </Container>
  );
}
