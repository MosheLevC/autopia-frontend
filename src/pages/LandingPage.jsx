import { Link } from "react-router";
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  ArrowLeft,
  BellRinging,
  ShieldCheck,
  Sparkle,
  Wrench,
} from "@phosphor-icons/react";
import Logo from "../components/Logo";

const FEATURES = [
  {
    icon: Wrench,
    title: "מעקב טיפולים",
    description: "תיעוד מלא וניהול היסטוריית הטיפולים, התיקונים והקבלות של הרכב שלך.",
  },
  {
    icon: BellRinging,
    title: "תזכורות חכמות",
    description: "התראות מבעוד מועד לטסט שנתי, טיפול תקופתי וחידוש פוליסת ביטוח.",
  },
  {
    icon: Sparkle,
    title: "סייען AI לספר הרכב",
    description: "צ'אט AI חכם שמכיר את ספר הרכב שלך ועונה באופן מיידי לכל שאלה.",
  },
  {
    icon: ShieldCheck,
    title: "ארכיון מסמכים",
    description: "ריכוז מאובטח של רישיונות, תעודות ביטוח ואישורים במקום נגיש אחד.",
  },
];

export default function LandingPage() {
  return (
    <Box
      bg="gray.0"
      py={{ base: "xl", sm: 48 }}
      px="md"
      style={{ minHeight: "100vh" }}
      dir="rtl"
    >
      <Container size="md">
        <Stack align="center" gap="xl">
          <Stack align="center" gap="sm" ta="center">
            <Logo size={80} />

            <Title order={1} fw={800}>
              Autopia
            </Title>

            <Badge variant="light" size="lg" radius="xl">
              ניהול רכב חכם במקום אחד
            </Badge>

            <Text size="lg" c="dimmed" maw={540}>
              הפלטפורמה המקיפה לשמירה על תקינות הרכב, מעקב הוצאות, תזכורות וסייען AI אישי לספר הרכב.
            </Text>
          </Stack>

          <Paper
            radius="xl"
            p={{ base: "lg", sm: "xl" }}
            withBorder
            shadow="sm"
            w="100%"
          >
            <Stack align="center" gap="md" ta="center">
              <Title order={2} fw={700}>
                ברוכים הבאים לניהול הרכב שלכם
              </Title>

              <Text size="md" c="dimmed" maw={600} style={{ lineHeight: 1.6 }}>
                שמרו על סדר ורוגע נפשי. עקבו אחר כל הטיפולים והתזכורות במקום אחד והתייעצו עם עוזר ה-AI שלכם בכל עת.
              </Text>

              <Button
                component={Link}
                to="/auth"
                size="lg"
                radius="md"
                leftSection={<ArrowLeft size={20} weight="bold" />}
                px="xl"
              >
                התחברות / הרשמה
              </Button>
            </Stack>
          </Paper>

          <Box w="100%" mt="md">
            <Title order={2} fw={700} ta="center" mb="lg">
              מה תמצאו באוטופיה?
            </Title>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
              {FEATURES.map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <Card key={index} radius="lg" p="lg" withBorder shadow="xs">
                    <Group align="flex-start" gap="md" wrap="nowrap">
                      <ThemeIcon size={44} radius="md" variant="light">
                        <FeatureIcon size={24} weight="bold" />
                      </ThemeIcon>

                      <Stack gap={4} style={{ flex: 1 }}>
                        <Text fw={700} size="md">
                          {feature.title}
                        </Text>
                        <Text size="sm" c="dimmed" style={{ lineHeight: 1.5 }}>
                          {feature.description}
                        </Text>
                      </Stack>
                    </Group>
                  </Card>
                );
              })}
            </SimpleGrid>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
