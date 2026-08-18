import { useEffect, useState } from "react";
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";

const QUICK_INCREMENTS = [50, 100, 500, 1000];

const formatMileage = (value) => Number(value).toLocaleString("he-IL");

const parseMileage = (value) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replaceAll(",", ""));
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const getMileageError = (value, currentMileage) => {
  const parsed = parseMileage(value);

  if (parsed === null || !Number.isInteger(parsed) || parsed < 0) {
    return "נא להזין קילומטראז' תקין";
  }

  if (parsed < currentMileage) {
    return "הקילומטראז' החדש לא יכול להיות נמוך מהקילומטראז' הנוכחי";
  }

  return null;
};

export default function MileageUpdateModal({
  opened,
  onClose,
  currentMileage,
  onSubmit,
}) {
  const [newMileage, setNewMileage] = useState(currentMileage);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (opened) {
      setNewMileage(currentMileage);
      setSubmitError(null);
    }
  }, [currentMileage, opened]);

  const parsedMileage = parseMileage(newMileage);
  const inputError = getMileageError(newMileage, currentMileage);
  const difference = parsedMileage === null ? null : parsedMileage - currentMileage;

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  const handleIncrement = (amount) => {
    const baseMileage = parseMileage(newMileage) ?? currentMileage;
    setNewMileage(baseMileage + amount);
    setSubmitError(null);
  };

  const handleMileageChange = (value) => {
    setNewMileage(value);
    setSubmitError(null);
  };

  const handleReset = () => {
    setNewMileage(currentMileage);
    setSubmitError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (inputError || parsedMileage === null || isSaving) {
      return;
    }

    setIsSaving(true);
    setSubmitError(null);
    try {
      await onSubmit(parsedMileage);
      onClose();
    } catch (error) {
      setSubmitError(error.message || "לא הצלחנו לעדכן את הקילומטראז'. נסה שוב.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="עדכון קילומטראז'"
      centered
      size="sm"
      radius="lg"
      padding={{ base: "md", sm: "xl" }}
      closeOnClickOutside={!isSaving}
      closeOnEscape={!isSaving}
      withCloseButton={!isSaving}
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Stack gap={2}>
            <Text size="sm" c="dimmed">
              קילומטראז&apos; נוכחי
            </Text>
            <Text fw={700} size="lg" dir="ltr">
              {formatMileage(currentMileage)} ק״מ
            </Text>
          </Stack>

          <NumberInput
            label="קילומטראז' חדש"
            value={newMileage}
            onChange={handleMileageChange}
            error={inputError || undefined}
            thousandSeparator=","
            allowDecimal={false}
            allowNegative={false}
            clampBehavior="none"
            hideControls
            inputMode="numeric"
            selectAllOnFocus
            size="md"
            disabled={isSaving}
          />

          <SimpleGrid cols={{ base: 2, xs: 4 }} spacing="xs">
            {QUICK_INCREMENTS.map((increment) => (
              <Button
                key={increment}
                type="button"
                variant="default"
                onClick={() => handleIncrement(increment)}
                disabled={isSaving}
              >
                +{formatMileage(increment)}
              </Button>
            ))}
          </SimpleGrid>

          <Group justify="flex-end">
            <Button
              type="button"
              variant="subtle"
              color="gray"
              size="compact-sm"
              onClick={handleReset}
              disabled={isSaving}
            >
              איפוס
            </Button>
          </Group>

          <Paper withBorder radius="md" p="sm" bg="gray.0">
            <Stack align="center" gap={4}>
              <Group gap="xs" wrap="nowrap" dir="ltr">
                <Text size="sm" c="dimmed">
                  {formatMileage(currentMileage)}
                </Text>
                <Text size="sm" c="dimmed" aria-hidden="true">
                  →
                </Text>
                <Text size="sm" fw={700}>
                  {parsedMileage === null ? "—" : formatMileage(parsedMileage)}
                </Text>
              </Group>
              <Text
                size="xs"
                fw={600}
                c={difference !== null && difference < 0 ? "red.7" : "dimmed"}
                dir="ltr"
              >
                {difference === null
                  ? "—"
                  : `${difference >= 0 ? "+" : ""}${formatMileage(difference)} ק״מ`}
              </Text>
            </Stack>
          </Paper>

          {submitError && (
            <Text size="sm" c="red.7" ta="center">
              {submitError}
            </Text>
          )}

          <Group grow gap="sm" mt="xs">
            <Button
              type="button"
              variant="default"
              onClick={handleClose}
              disabled={isSaving}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              loading={isSaving}
              disabled={Boolean(inputError)}
            >
              עדכון
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
