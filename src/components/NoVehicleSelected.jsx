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
import { Car } from "@phosphor-icons/react";

export default function NoVehicleSelected({
  title = "לא נבחר רכב",
  description = "לא ניתן להציג את המידע מכיוון שלא נבחר רכב.",
  icon: Icon = Car,
  actionLabel = "לרכבים שלי",
  actionPath = "/vehicles",
  actionIcon: ActionIconComponent = Car,
}) {
  const navigate = useNavigate();
  const IconComponent = Icon || Car;
  const ActionIcon = ActionIconComponent || Car;

  return (
    <Container size="sm" py="xl" w="100%">
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
              <IconComponent size={35} />
            </ThemeIcon>

            <Stack gap={6} align="center">
              <Title order={3} fw={700} c="gray.9">
                {title}
              </Title>
              <Text c="dimmed" size="sm" maw={360} mih="3lh">
                {description}
              </Text>
            </Stack>

            <Button
              size="md"
              radius="lg"
              onClick={() => navigate(actionPath)}
              leftSection={<ActionIcon size={20} />}
              mt="xs"
            >
              {actionLabel}
            </Button>
          </Stack>
        </Card>
      </Center>
    </Container>
  );
}

