import { useState } from "react";
import { Link } from "react-router";
import "phosphor-icons";
import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

export default function AuthPage() {
  const [mode, setMode] = useState("login");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
    agreeTerms: false,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: connect login/signup API endpoint
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
      }}
      dir="rtl"
    >
      <Container size="xs" style={{ width: "100%" }}>
        <Paper radius="xl" p="xl" withBorder shadow="md" style={{ backgroundColor: "#ffffff" }}>
          <Stack align="center" gap="xs" mb="lg">
            <Box
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: 28,
                boxShadow: "0 8px 18px rgba(37, 99, 235, 0.3)",
              }}
            >
              <i className="ph-car" />
            </Box>

            <Title order={2} style={{ fontSize: 26, fontWeight: 800, color: "#0f172a" }}>
              Autopia | אוטופיה
            </Title>
            <Text size="sm" c="dimmed">
              {mode === "login" ? "התחבר לחשבון שלך כדי להמשיך" : "צור חשבון חדש בחינם"}
            </Text>
          </Stack>

          <SegmentedControl
            fullWidth
            size="md"
            radius="md"
            value={mode}
            onChange={setMode}
            data={[
              { label: "התחברות", value: "login" },
              { label: "הרשמה", value: "signup" },
            ]}
            mb="lg"
            color="blue"
          />

          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              {mode === "signup" && (
                <Group grow gap="sm">
                  <TextInput
                    label="שם פרטי *"
                    placeholder="דניאל"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    leftSection={<i className="ph-user" style={{ fontSize: 18, color: "#94a3b8" }} />}
                    radius="md"
                  />
                  <TextInput
                    label="שם משפחה *"
                    placeholder="ישראלי"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    radius="md"
                  />
                </Group>
              )}

              <TextInput
                label="כתובת אימייל *"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                leftSection={<i className="ph-envelope-simple" style={{ fontSize: 18, color: "#94a3b8" }} />}
                radius="md"
              />

              <Box>
                <Group justify="space-between" mb={4}>
                  <Text size="sm" fw={700} c="gray.7">
                    סיסמה *
                  </Text>
                  {mode === "login" && (
                    <Anchor component="a" href="#forgot" size="xs" fw={600} c="blue.6">
                      שכחת סיסמה?
                    </Anchor>
                  )}
                </Group>
                <PasswordInput
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  leftSection={<i className="ph-lock-key" style={{ fontSize: 18, color: "#94a3b8" }} />}
                  radius="md"
                />
              </Box>

              {mode === "signup" && (
                <PasswordInput
                  label="אימות סיסמה *"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  leftSection={<i className="ph-lock-key-open" style={{ fontSize: 18, color: "#94a3b8" }} />}
                  radius="md"
                />
              )}

              <Checkbox
                checked={mode === "login" ? formData.rememberMe : formData.agreeTerms}
                onChange={(e) =>
                  handleChange(mode === "login" ? "rememberMe" : "agreeTerms", e.currentTarget.checked)
                }
                label={mode === "login" ? "זכור אותי במכשיר זה" : "אני מסכים לתנאי השימוש ומדיניות הפרטיות"}
                size="sm"
                color="blue"
              />

              <Button
                type="submit"
                fullWidth
                size="md"
                radius="md"
                color="blue"
                mt="xs"
                style={{
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  fontWeight: 700,
                  fontSize: 16,
                  boxShadow: "0 6px 16px rgba(37, 99, 235, 0.35)",
                }}
              >
                {mode === "login" ? "התחברות לחשבון" : "יצירת חשבון חדש"}
              </Button>
            </Stack>
          </form>

          <Box pt="lg" mt="lg" style={{ borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
            {mode === "login" ? (
              <Text size="sm" c="dimmed">
                עדיין אין לך חשבון?{" "}
                <Anchor
                  component="button"
                  type="button"
                  fw={700}
                  c="blue.6"
                  onClick={() => setMode("signup")}
                >
                  להרשמה בחינם
                </Anchor>
              </Text>
            ) : (
              <Text size="sm" c="dimmed">
                כבר יש לך חשבון?{" "}
                <Anchor component="button" type="button" fw={700} c="blue.6" onClick={() => setMode("login")}>
                  להתחברות
                </Anchor>
              </Text>
            )}

            <Box mt="md">
              <Anchor component={Link} to="/" size="xs" c="dimmed" fw={600}>
                ← חזרה לדף הבית
              </Anchor>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
