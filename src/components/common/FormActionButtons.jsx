import { Button, Stack } from "@mantine/core";
import { Trash } from "@phosphor-icons/react";

export default function FormActionButtons({
  isEdit = false,
  submitLabel,
  cancelLabel = "ביטול",
  deleteLabel = "מחיקה",
  onCancel,
  onDelete,
  isSubmitting = false,
  isDeleting = false,
  disabled = false,
  mt = "md",
  size = "lg",
  h = 50,
  radius = "lg",
}) {
  const defaultSubmitLabel = isEdit ? "שמירת שינויים" : "שמירה";
  const finalSubmitLabel = submitLabel || defaultSubmitLabel;

  return (
    <Stack gap="xs" mt={mt} w="100%">
      <Button
        type="submit"
        size={size}
        radius={radius}
        h={h}
        fw={700}
        loading={isSubmitting}
        disabled={disabled || isDeleting}
        shadow="sm"
      >
        {finalSubmitLabel}
      </Button>

      {onCancel && (
        <Button
          type="button"
          variant="outline"
          size={size}
          radius={radius}
          h={h}
          onClick={onCancel}
          disabled={isSubmitting || isDeleting}
        >
          {cancelLabel}
        </Button>
      )}

      {isEdit && onDelete && (
        <Button
          type="button"
          variant="light"
          color="red"
          size={size}
          radius={radius}
          h={h}
          onClick={onDelete}
          leftSection={<Trash size={18} aria-hidden="true" />}
          disabled={isSubmitting || isDeleting}
        >
          {deleteLabel}
        </Button>
      )}
    </Stack>
  );
}
