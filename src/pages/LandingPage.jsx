import { Link } from "react-router";
import "phosphor-icons";
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

const FEATURES = [
  {
    icon: "ph-wrench",
    title: "מעקב טיפולים",
    description: "תיעוד מלא וניהול היסטוריית הטיפולים, התיקונים והקבלות של הרכב שלך.",
  },
  {
    icon: "ph-bell-ringing",
    title: "תזכורות חכמות",
    description: "התראות מבעוד מועד לטסט שנתי, טיפול תקופתי וחידוש פוליסת ביטוח.",
  },
  {
    icon: "ph-sparkle",
    title: "סייען AI לספר הרכב",
    description: "צ'אט AI חכם שמכיר את ספר הרכב שלך ועונה באופן מיידי לכל שאלה.",
  },
  {
    icon: "ph-shield-check",
    title: "ארכיון מסמכים",
    description: "ריכוז מאובטח של רישיונות, תעודות ביטוח ואישורים במקום נגיש אחד.",
  },
];

export default function LandingPage() {
  return (
    <Box
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "48px 16px",
      }}
      dir="rtl"
    >
      <Container size="md">
        <Stack align="center" gap="xl">
          <Stack align="center" gap="sm" ta="center">
            <Box
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: 32,
                boxShadow: "0 8px 20px rgba(37, 99, 235, 0.35)",
              }}
            >
              <i className="ph-bold ph-car" />
            </Box>

            <Title order={1} style={{ fontSize: 36, fontWeight: 800, color: "#0f172a" }}>
              אוטופיה | Autopia
            </Title>

            <Badge variant="light" color="blue" size="lg" radius="xl">
              ניהול רכב חכם במקום אחד
            </Badge>

            <Text size="lg" c="dimmed" style={{ maxWidth: 540 }}>
              הפלטפורמה המקיפה לשמירה על תקינות הרכב, מעקב הוצאות, תזכורות וסייען AI אישי לספר הרכב.
            </Text>
          </Stack>

          <Paper
            radius="xl"
            p={{ base: "lg", sm: "xl" }}
            withBorder
            shadow="sm"
            style={{ width: "100%", backgroundColor: "#ffffff" }}
          >
            <Stack align="center" gap="md" ta="center">
              <Title order={2} style={{ fontSize: 24, fontWeight: 700, color: "#1e293b" }}>
                ברוכים הבאים לניהול הרכב שלכם
              </Title>

              <Text size="md" c="gray.7" style={{ maxWidth: 600, lineHeight: 1.6 }}>
                שמרו על סדר ורוגע נפשי. עקבו אחר כל הטיפולים והתזכורות במקום אחד והתייעצו עם עוזר ה-AI שלכם בכל עת.
              </Text>

              <Button
                component={Link}
                to="/auth"
                size="lg"
                radius="md"
                color="blue"
                leftSection={<i className="ph-bold ph-arrow-left" style={{ fontSize: 20 }} />}
                style={{
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  fontWeight: 700,
                  fontSize: 16,
                  padding: "0 32px",
                  boxShadow: "0 6px 18px rgba(37, 99, 235, 0.35)",
                }}
              >
                התחברות / הרשמה
              </Button>
            </Stack>
          </Paper>

          <Box style={{ width: "100%" }} mt="md">
            <Title order={2} style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 20 }} ta="center">
              מה תמצאו באוטופיה?
            </Title>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
              {FEATURES.map((feature, index) => (
                <Card key={index} radius="lg" p="lg" withBorder shadow="xs" style={{ backgroundColor: "#ffffff" }}>
                  <Group align="flex-start" gap="md" wrap="nowrap">
                    <ThemeIcon size={44} radius="md" color="blue" variant="light">
                      <i className={`ph-bold ${feature.icon}`} style={{ fontSize: 24 }} />
                    </ThemeIcon>

                    <Stack gap={4} style={{ flex: 1 }}>
                      <Text fw={700} size="md" c="gray.9">
                        {feature.title}
                      </Text>
                      <Text size="sm" c="dimmed" style={{ lineHeight: 1.5 }}>
                        {feature.description}
                      </Text>
                    </Stack>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
