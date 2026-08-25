import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { CheckCircle, LockKey, PencilSimple } from "@phosphor-icons/react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createDraft = (user) => ({
  firstName: user?.firstName || "",
  lastName: user?.lastName || "",
  email: user?.email || "",
});

const validateDraft = (draft) => {
  const errors = {};

  if (!draft.firstName.trim()) {
    errors.firstName = "נא להזין שם פרטי";
  }

  if (!draft.lastName.trim()) {
    errors.lastName = "נא להזין שם משפחה";
  }

  if (!draft.email.trim()) {
    errors.email = "נא להזין כתובת אימייל";
  } else if (!EMAIL_PATTERN.test(draft.email.trim())) {
    errors.email = "כתובת האימייל אינה תקינה";
  }

  return errors;
};

const getBackendFieldErrors = (error) => {
  const backendErrors = error.fieldErrors || {};
  const fieldErrors = {};

  if (backendErrors.firstName) {
    fieldErrors.firstName = "נא להזין שם פרטי";
  }

  if (backendErrors.lastName) {
    fieldErrors.lastName = "נא להזין שם משפחה";
  }

  if (backendErrors.email) {
    fieldErrors.email = "כתובת האימייל אינה תקינה";
  }

  if (error.status === 409) {
    fieldErrors.email = "כתובת האימייל כבר רשומה במערכת";
  }

  return fieldErrors;
};

export default function UserProfile({
  user,
  isSaving,
  passwordChangeSuccess,
  onSave,
  onChangePassword,
  onStartEditing,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(() => createDraft(user));
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const details = [
    { id: "firstName", label: "שם פרטי", value: user?.firstName },
    { id: "lastName", label: "שם משפחה", value: user?.lastName },
    { id: "email", label: "כתובת אימייל", value: user?.email },
  ];

  const normalizedDraft = {
    firstName: draft.firstName.trim(),
    lastName: draft.lastName.trim(),
    email: draft.email.trim(),
  };
  const hasChanges = details.some(
    (detail) => normalizedDraft[detail.id] !== (detail.value || ""),
  );

  const handleEdit = () => {
    onStartEditing?.();
    setDraft(createDraft(user));
    setFieldErrors({});
    setSubmitError(null);
    setShowSuccess(false);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(createDraft(user));
    setFieldErrors({});
    setSubmitError(null);
    setIsEditing(false);
  };

  const handleFieldChange = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      return { ...current, [field]: null };
    });
    setSubmitError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    const validationErrors = validateDraft(draft);
    setFieldErrors(validationErrors);
    setSubmitError(null);

    if (Object.keys(validationErrors).length > 0 || !hasChanges) {
      return;
    }

    try {
      const updatedUser = await onSave(normalizedDraft);
      setDraft(createDraft(updatedUser));
      setIsEditing(false);
      setShowSuccess(true);
    } catch (error) {
      const backendFieldErrors = getBackendFieldErrors(error);
      setFieldErrors(backendFieldErrors);

      if (Object.keys(backendFieldErrors).length === 0) {
        setSubmitError(error.message || "לא הצלחנו לעדכן את פרטי החשבון");
      }
    }
  };

  return (
    <Card
      component="section"
      aria-labelledby="profile-details-title"
      withBorder
      radius="xl"
      shadow="sm"
      p={{ base: "md", sm: "xl" }}
    >
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start" wrap="wrap">
          <Stack gap={4}>
            <Title id="profile-details-title" order={2} size="h3">
              פרטים אישיים
            </Title>
          </Stack>

          {!isEditing && (
            <Group gap="sm">
              <Button
                variant="default"
                onClick={() => {
                  setShowSuccess(false);
                  onChangePassword?.();
                }}
                leftSection={<LockKey size={18} weight="bold" aria-hidden="true" />}
              >
                שינוי סיסמה
              </Button>
              <Button
                variant="light"
                onClick={handleEdit}
                leftSection={<PencilSimple size={18} weight="bold" aria-hidden="true" />}
              >
                עריכת פרטים
              </Button>
            </Group>
          )}
        </Group>

        {showSuccess && !isEditing && (
          <Group gap={6} c="green.7">
            <CheckCircle size={18} weight="bold" aria-hidden="true" />
            <Text size="sm" fw={600}>
              הפרטים עודכנו בהצלחה
            </Text>
          </Group>
        )}

        {passwordChangeSuccess && !isEditing && (
          <Group gap={6} c="green.7">
            <CheckCircle size={18} weight="bold" aria-hidden="true" />
            <Text size="sm" fw={600}>
              הסיסמה שונתה בהצלחה
            </Text>
          </Group>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput
                  label="שם פרטי"
                  withAsterisk
                  value={draft.firstName}
                  onChange={(event) =>
                    handleFieldChange("firstName", event.currentTarget.value)
                  }
                  error={fieldErrors.firstName}
                  disabled={isSaving}
                />
                <TextInput
                  label="שם משפחה"
                  withAsterisk
                  value={draft.lastName}
                  onChange={(event) =>
                    handleFieldChange("lastName", event.currentTarget.value)
                  }
                  error={fieldErrors.lastName}
                  disabled={isSaving}
                />
                <TextInput
                  label="כתובת אימייל"
                  withAsterisk
                  value={draft.email}
                  onChange={(event) =>
                    handleFieldChange("email", event.currentTarget.value)
                  }
                  error={fieldErrors.email}
                  disabled={isSaving}
                  styles={{ input: { direction: "ltr" } }}
                  style={{ gridColumn: "1 / -1" }}
                />
              </SimpleGrid>

              {submitError && (
                <Alert color="red" title="העדכון לא נשמר" radius="md">
                  {submitError}
                </Alert>
              )}

              <Group grow gap="sm" mt="xs">
                <Button
                  type="button"
                  variant="default"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  ביטול
                </Button>
                <Button
                  type="submit"
                  loading={isSaving}
                  disabled={!hasChanges || isSaving}
                >
                  שמור
                </Button>
              </Group>
            </Stack>
          </form>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {details.map((detail) => (
              <Paper
                key={detail.id}
                withBorder
                radius="md"
                p="md"
                bg="gray.0"
                style={
                  detail.id === "email" ? { gridColumn: "1 / -1" } : undefined
                }
              >
                <Stack gap={4}>
                  <Text size="xs" c="dimmed">
                    {detail.label}
                  </Text>
                  <Text
                    size="md"
                    fw={600}
                    dir={detail.id === "email" ? "ltr" : undefined}
                    style={{ overflowWrap: "anywhere" }}
                  >
                    {detail.value || "לא זמין"}
                  </Text>
                </Stack>
              </Paper>
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Card>
  );
}
