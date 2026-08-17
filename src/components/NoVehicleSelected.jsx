import {
  Button,
  Card,
  Center,
  Container,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router";

export default function NoVehicleSelected({
  title = "לא נבחר רכב",
  description = "לא ניתן להציג את המידע מכיוון שלא נבחר רכב.",
  icon = "ph-car",
}) {
  const navigate = useNavigate();

  return (
    <Container size="sm" py="xl">
      <Center>
        <Card
          withBorder
          shadow="xs"
          radius="xl"
          p="xl"
          w="100%"
          maw={480}
          ta="center"
          bg="white"
        >
          <Stack align="center" gap="md" py="lg">
            <ThemeIcon size={72} radius="xl" variant="light" color="gray">
              <i className={icon} style={{ fontSize: "2.2rem" }} />
            </ThemeIcon>

            <Stack gap={6} align="center">
              <Title order={3} fw={700} c="gray.9">
                {title}
              </Title>
              <Text c="dimmed" size="sm" maw={360}>
                {description}
              </Text>
            </Stack>

            <Button
              size="md"
              radius="lg"
              onClick={() => navigate("/vehicles")}
              leftSection={
                <i className="ph-car" style={{ fontSize: "1.2rem" }} />
              }
              mt="xs"
            >
              לרכבים שלי
            </Button>
          </Stack>
        </Card>
      </Center>
    </Container>
  );
}
