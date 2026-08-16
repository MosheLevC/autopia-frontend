import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
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
import Logo from "../components/Logo";
import { useAuth } from "../stores/AuthStoreContext";

const AuthPage = observer(function AuthPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState("login");
  const [localError, setLocalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: true,
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setLocalError("");
    setFieldErrors({});
    auth.clearError();
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      errors.email = "נא להזין כתובת אימייל";
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = "כתובת אימייל אינה תקינה";
    }

    if (!formData.password) {
      errors.password = "נא להזין סיסמה";
    } else if (formData.password.length < 8) {
      errors.password = "הסיסמה חייבת להכיל לפחות 8 תווים";
    }

    if (mode === "signup") {
      if (!formData.firstName.trim()) {
        errors.firstName = "נא להזין שם פרטי";
      }
      if (!formData.lastName.trim()) {
        errors.lastName = "נא להזין שם משפחה";
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "הסיסמאות אינן תואמות";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    auth.clearError();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await auth.login(
          formData.email.trim(),
          formData.password,
          formData.rememberMe
        );
      } else {
        await auth.signup(
          {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim(),
            password: formData.password,
          },
          formData.rememberMe
        );
      }

      const redirectPath = location.state?.from?.pathname || "/home";
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setLocalError(err.message || "פעולה נכשלה, נא לנסות שוב");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentErrorMessage = localError || auth.error;

  return (
    <Box
      bg="gray.0"
      py="xl"
      px="md"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      dir="rtl"
    >
      <Container size="xs" style={{ width: "100%" }}>
        <Paper
          radius="xl"
          p="xl"
          withBorder
          shadow="md"
        >
          <Stack align="center" gap="xs" mb="lg">
            <Logo size={72} />

            <Title order={2} fw={800}>
              Autopia | אוטופיה
            </Title>
            <Text size="sm" c="dimmed">
              {mode === "login"
                ? "התחבר לחשבון שלך כדי להמשיך"
                : "צור חשבון חדש בחינם"}
            </Text>
          </Stack>

          {currentErrorMessage && (
            <Alert
              icon={
                <i className="ph-warning-circle" style={{ fontSize: 20 }} />
              }
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
              {mode === "signup" && (
                <Group grow gap="sm">
                  <TextInput
                    label="שם פרטי *"
                    placeholder="דניאל"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    error={fieldErrors.firstName}
                    leftSection={
                      <i
                        className="ph-user"
                        style={{
                          fontSize: 18,
                          color: "var(--mantine-color-dimmed)",
                        }}
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
              )}

              <TextInput
                label="כתובת אימייל *"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                error={fieldErrors.email}
                leftSection={
                  <i
                    className="ph-envelope-simple"
                    style={{
                      fontSize: 18,
                      color: "var(--mantine-color-dimmed)",
                    }}
                  />
                }
                radius="md"
              />

              <Box>
                <Group justify="space-between" mb={4}>
                  <Text size="sm" fw={700}>
                    סיסמה *
                  </Text>
                  {mode === "login" && (
                    <Anchor
                      component="button"
                      type="button"
                      size="xs"
                      fw={600}
                    >
                      שכחת סיסמה?
                    </Anchor>
                  )}
                </Group>
                <PasswordInput
                  placeholder="לפחות 8 תווים"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  error={fieldErrors.password}
                  leftSection={
                    <i
                      className="ph-lock-key"
                      style={{
                        fontSize: 18,
                        color: "var(--mantine-color-dimmed)",
                      }}
                    />
                  }
                  radius="md"
                />
              </Box>

              {mode === "signup" && (
                <PasswordInput
                  label="אימות סיסמה *"
                  placeholder="הזן שוב את הסיסמה"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  error={fieldErrors.confirmPassword}
                  leftSection={
                    <i
                      className="ph-lock-key-open"
                      style={{
                        fontSize: 18,
                        color: "var(--mantine-color-dimmed)",
                      }}
                    />
                  }
                  radius="md"
                />
              )}

              {mode === "login" && (
                <Checkbox
                  checked={formData.rememberMe}
                  onChange={(e) =>
                    handleChange("rememberMe", e.currentTarget.checked)
                  }
                  label="זכור אותי במכשיר זה"
                  size="sm"
                />
              )}

              <Button
                type="submit"
                fullWidth
                size="md"
                radius="md"
                mt="xs"
                loading={isSubmitting}
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
