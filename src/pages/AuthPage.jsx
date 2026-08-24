import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
import {
  Alert,
  Anchor,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Group,
  Paper,
  PasswordInput,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  EnvelopeSimple,
  LockKey,
  LockKeyOpen,
  User,
  WarningCircle,
} from "@phosphor-icons/react";
import Logo from "../components/Logo";
import { useAuth } from "../stores/AuthStoreContext";

const AuthPage = observer(function AuthPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
  });
  const [fieldErrors, setFieldErrors] = useState({});

  if (auth.isAuthenticated) {
    const from = location.state?.from?.pathname || "/home";
    return <Navigate to={from} replace />;
  }

  const handleModeChange = (newMode) => {
    setMode(newMode);
    auth.clearError();
    setFieldErrors({});
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errors = {};

    if (mode === "signup") {
      if (!formData.firstName.trim()) {
        errors.firstName = "נא להזין שם פרטי";
      }
      if (!formData.lastName.trim()) {
        errors.lastName = "נא להזין שם משפחה";
      }
    }

    if (!formData.email.trim()) {
      errors.email = "נא להזין כתובת אימייל";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "כתובת אימייל לא תקינה";
    }

    if (!formData.password) {
      errors.password = "נא להזין סיסמה";
    } else if (formData.password.length < 8) {
      errors.password = "הסיסמה חייבת להכיל לפחות 8 תווים";
    }

    if (mode === "signup" && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "הסיסמאות אינן תואמות";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || auth.isSubmitting) return;

    try {
      if (mode === "login") {
        await auth.login(formData.email, formData.password, formData.rememberMe);
      } else {
        await auth.signup(
          formData.firstName,
          formData.lastName,
          formData.email,
          formData.password,
          formData.rememberMe,
        );
      }
      const from = location.state?.from?.pathname || "/home";
      navigate(from, { replace: true });
    } catch {
      // Error is stored in authStore.error
    }
  };

  const currentErrorMessage = auth.error;

  return (
    <Box
      bg="gray.0"
      py={{ base: "xl", sm: 48 }}
      px="md"
      style={{ minHeight: "100vh" }}
      dir="rtl"
    >
      <Container size={440}>
        <Stack align="center" gap="sm" mb="xl">
          <Logo size={56} />
          <Title order={2} fw={800} c="blue.6">
            Autopia
          </Title>
        </Stack>

        <Paper radius="xl" p={{ base: "lg", sm: "xl" }} withBorder shadow="sm">
          <Stack align="center" gap={4} mb="lg">
            <Title order={3} fw={700}>
              {mode === "login" ? "התחברות" : "הרשמה"}
            </Title>
            <Text size="sm" c="dimmed">
              {mode === "login"
                ? "התחבר לחשבון שלך כדי להמשיך"
                : "צור חשבון חדש בחינם"}
            </Text>
          </Stack>

          {currentErrorMessage && (
            <Alert
              icon={<WarningCircle size={20} aria-hidden="true" />}
              title="שגיאה"
              color="red"
              radius="md"
              mb="md"
              variant="light"
            >
              {currentErrorMessage}
            </Alert>
          )}

          <SegmentedControl
            fullWidth
            size="md"
            radius="md"
            value={mode}
            onChange={handleModeChange}
            data={[
              { label: "התחברות", value: "login" },
              { label: "הרשמה", value: "signup" },
            ]}
            mb="lg"
          />

          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <div
                className={`auth-expandable-row ${mode === "signup" ? "expanded" : ""
                  }`}
              >
                <div className="auth-expandable-content">
                  <Group grow gap="sm" pb="xs">
                    <TextInput
                      label="שם פרטי *"
                      placeholder="דניאל"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleChange("firstName", e.target.value)
                      }
                      error={fieldErrors.firstName}
                      leftSection={
                        <User
                          size={18}
                          color="var(--mantine-color-dimmed)"
                          aria-hidden="true"
                        />
                      }
                      radius="md"
                    />
                    <TextInput
                      label="שם משפחה *"
                      placeholder="ישראלי"
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      error={fieldErrors.lastName}
                      radius="md"
                    />
                  </Group>
                </div>
              </div>

              <TextInput
                label="כתובת אימייל *"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                error={fieldErrors.email}
                leftSection={
                  <EnvelopeSimple
                    size={18}
                    color="var(--mantine-color-dimmed)"
                    aria-hidden="true"
                  />
                }
                radius="md"
              />

              <Box>
                <Group justify="space-between" mb={4}>
                  <Text size="sm" fw={700}>
                    סיסמה *
                  </Text>
                </Group>
                <PasswordInput
                  placeholder="לפחות 8 תווים"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  error={fieldErrors.password}
                  leftSection={
                    <LockKey
                      size={18}
                      color="var(--mantine-color-dimmed)"
                      aria-hidden="true"
                    />
                  }
                  radius="md"
                />
              </Box>

              <div
                className={`auth-expandable-row ${mode === "signup" ? "expanded" : ""
                  }`}
              >
                <div className="auth-expandable-content">
                  <Box pt="xs">
                    <PasswordInput
                      label="אימות סיסמה *"
                      placeholder="הזן שוב את הסיסמה"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleChange("confirmPassword", e.target.value)
                      }
                      error={fieldErrors.confirmPassword}
                      leftSection={
                        <LockKeyOpen
                          size={18}
                          color="var(--mantine-color-dimmed)"
                          aria-hidden="true"
                        />
                      }
                      radius="md"
                    />
                  </Box>
                </div>
              </div>

              <div
                className={`auth-expandable-row ${mode === "login" ? "expanded" : ""
                  }`}
              >
                <div className="auth-expandable-content">
                  <Box pt="2px">
                    <Checkbox
                      checked={formData.rememberMe}
                      onChange={(e) =>
                        handleChange("rememberMe", e.currentTarget.checked)
                      }
                      label="זכור אותי במכשיר זה"
                      size="sm"
                    />
                  </Box>
                </div>
              </div>

              <Button
                type="submit"
                fullWidth
                size="md"
                radius="md"
                mt="xs"
                loading={auth.isSubmitting}
              >
                {mode === "login" ? "התחברות לחשבון" : "יצירת חשבון חדש"}
              </Button>
            </Stack>
          </form>

          <Divider my="lg" />

          <Stack align="center" gap="sm">
            {mode === "login" ? (
              <Text size="sm" c="dimmed">
                עדיין אין לך חשבון?{" "}
                <Anchor
                  component="button"
                  type="button"
                  fw={700}
                  onClick={() => handleModeChange("signup")}
                >
                  להרשמה בחינם
                </Anchor>
              </Text>
            ) : (
              <Text size="sm" c="dimmed">
                כבר יש לך חשבון?{" "}
                <Anchor
                  component="button"
                  type="button"
                  fw={700}
                  onClick={() => handleModeChange("login")}
                >
                  להתחברות
                </Anchor>
              </Text>
            )}

            <Anchor component={Link} to="/" size="xs" c="dimmed" fw={600}>
              ← חזרה לדף הבית
            </Anchor>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
});

export default AuthPage;
