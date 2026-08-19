import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Group,
  Modal,
  PasswordInput,
  Stack,
} from "@mantine/core";

const EMPTY_FORM = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const validatePasswordForm = (formData) => {
  const errors = {};

  if (!formData.currentPassword) {
    errors.currentPassword = "נא להזין את הסיסמה הנוכחית";
  }

  if (!formData.newPassword) {
    errors.newPassword = "נא להזין סיסמה חדשה";
  } else if (formData.newPassword.length < 8) {
    errors.newPassword = "הסיסמה החדשה חייבת להכיל לפחות 8 תווים";
  } else if (formData.newPassword === formData.currentPassword) {
    errors.newPassword = "הסיסמה החדשה חייבת להיות שונה מהסיסמה הנוכחית";
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "נא לאמת את הסיסמה החדשה";
  } else if (formData.confirmPassword !== formData.newPassword) {
    errors.confirmPassword = "הסיסמאות אינן תואמות";
  }

  return errors;
};

export default function ChangePasswordModal({
  opened,
  isSubmitting,
  onClose,
  onSubmit,
  onSuccess,
}) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const submissionInProgress = useRef(false);

  useEffect(() => {
    if (opened) {
      submissionInProgress.current = false;
      setFormData(EMPTY_FORM);
      setFieldErrors({});
      setSubmitError(null);
    }
  }, [opened]);

  const handleClose = () => {
    if (!isSubmitting && !submissionInProgress.current) {
      setFormData(EMPTY_FORM);
      setFieldErrors({});
      setSubmitError(null);
      onClose();
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
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

    if (isSubmitting || submissionInProgress.current) {
      return;
    }

    const validationErrors = validatePasswordForm(formData);
    setFieldErrors(validationErrors);
    setSubmitError(null);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    submissionInProgress.current = true;

    try {
      await onSubmit({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setFormData(EMPTY_FORM);
      onClose();
      onSuccess();
    } catch (error) {
      setSubmitError(error.message || "לא הצלחנו לשנות את הסיסמה");
    } finally {
      submissionInProgress.current = false;
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="שינוי סיסמה"
      centered
      size="sm"
      radius="lg"
      padding={{ base: "md", sm: "xl" }}
      closeOnClickOutside={!isSubmitting}
      closeOnEscape={!isSubmitting}
      withCloseButton={!isSubmitting}
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <PasswordInput
            label="סיסמה נוכחית"
            withAsterisk
            autoComplete="current-password"
            value={formData.currentPassword}
            onChange={(event) =>
              handleFieldChange("currentPassword", event.currentTarget.value)
            }
            error={fieldErrors.currentPassword}
            disabled={isSubmitting}
          />
          <PasswordInput
            label="סיסמה חדשה"
            withAsterisk
            autoComplete="new-password"
            value={formData.newPassword}
            onChange={(event) =>
              handleFieldChange("newPassword", event.currentTarget.value)
            }
            error={fieldErrors.newPassword}
            disabled={isSubmitting}
          />
          <PasswordInput
            label="אימות סיסמה חדשה"
            withAsterisk
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={(event) =>
              handleFieldChange("confirmPassword", event.currentTarget.value)
            }
            error={fieldErrors.confirmPassword}
            disabled={isSubmitting}
          />

          {submitError && (
            <Alert color="red" title="הסיסמה לא שונתה" radius="md">
              {submitError}
            </Alert>
          )}

          <Group grow gap="sm" mt="xs">
            <Button
              type="button"
              variant="default"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              שמור
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
