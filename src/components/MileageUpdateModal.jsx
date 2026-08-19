import { useEffect, useState } from "react";
import {
  ActionIcon,
  Alert,
  Button,
  Group,
  Modal,
  NumberInput,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

const INPUT_MODES = {
  newMileage: "newMileage",
  addedMileage: "addedMileage",
};

const QUICK_INCREMENTS = [10, 50, 100, 500];

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

const getMileageError = (value, mode, currentMileage) => {
  const parsed = parseMileage(value);

  if (parsed === null || !Number.isSafeInteger(parsed) || parsed < 0) {
    return "נא להזין מספר קילומטרים תקין";
  }

  if (mode === INPUT_MODES.newMileage && parsed < currentMileage) {
    return "הקילומטראז׳ החדש לא יכול להיות נמוך מהקילומטראז׳ הנוכחי";
  }

  return null;
};

export default function MileageUpdateModal({
  opened,
  onClose,
  currentMileage,
  onSubmit,
}) {
  const isMobile = useMediaQuery("(max-width: 48em)", false, {
    getInitialValueInEffect: false,
  });
  const [mode, setMode] = useState(INPUT_MODES.newMileage);
  const [inputValue, setInputValue] = useState(currentMileage);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (opened) {
      setMode(INPUT_MODES.newMileage);
      setInputValue(currentMileage);
      setSubmitError(null);
    }
  }, [currentMileage, opened]);

  const parsedInput = parseMileage(inputValue);
  const inputError = getMileageError(inputValue, mode, currentMileage);
  const finalMileage =
    parsedInput === null
      ? null
      : mode === INPUT_MODES.addedMileage
        ? currentMileage + parsedInput
        : parsedInput;
  const difference =
    finalMileage === null ? null : finalMileage - currentMileage;
  const canSubmit = !inputError && difference !== null && difference > 0;
  const minimumValue =
    mode === INPUT_MODES.newMileage ? currentMileage : 0;

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  const handleModeChange = (nextMode) => {
    const parsed = parseMileage(inputValue);

    if (nextMode === INPUT_MODES.addedMileage) {
      setInputValue(
        parsed !== null && parsed >= currentMileage
          ? parsed - currentMileage
          : 0,
      );
    } else {
      setInputValue(currentMileage + (parsed ?? 0));
    }

    setMode(nextMode);
    setSubmitError(null);
  };

  const handleMileageChange = (value) => {
    setInputValue(value);
    setSubmitError(null);
  };

  const handleAdjustment = (amount) => {
    const parsed = parseMileage(inputValue) ?? minimumValue;
    setInputValue(Math.max(minimumValue, parsed + amount));
    setSubmitError(null);
  };

  const handleReset = () => {
    setInputValue(minimumValue);
    setSubmitError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canSubmit || finalMileage === null || isSaving) {
      return;
    }

    setIsSaving(true);
    setSubmitError(null);
    try {
      await onSubmit(finalMileage);
      onClose();
    } catch (error) {
      setSubmitError(
        error.message || "לא הצלחנו לעדכן את הקילומטראז׳. נסה שוב.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const previewColor = inputError
    ? "red"
    : difference > 0
      ? "green"
      : "gray";
  const previewIcon = inputError
    ? "ph-warning-circle"
    : difference > 0
      ? "ph-check-circle"
      : "ph-minus-circle";

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="עדכון קילומטראז׳"
      centered={!isMobile}
      fullScreen={isMobile}
      size={540}
      radius="lg"
      padding={{ base: "md", sm: "xl" }}
      closeOnClickOutside={!isSaving}
      closeOnEscape={!isSaving}
      withCloseButton={!isSaving}
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="lg">
          <Paper withBorder radius="lg" p="md" bg="blue.0">
            <Stack gap={2} align="center" ta="center">
              <Text size="sm" c="blue.8" fw={600}>
                קילומטראז׳ נוכחי
              </Text>
              <Text
                fw={800}
                fz={{ base: "1.75rem", sm: "2rem" }}
                c="gray.9"
                dir="ltr"
                lh={1.2}
              >
                {formatMileage(currentMileage)} ק״מ
              </Text>
            </Stack>
          </Paper>

          <SegmentedControl
            fullWidth
            value={mode}
            onChange={handleModeChange}
            disabled={isSaving}
            radius="md"
            data={[
              {
                value: INPUT_MODES.newMileage,
                label: "קילומטראז׳ חדש",
              },
              {
                value: INPUT_MODES.addedMileage,
                label: "הוספת ק״מ",
              },
            ]}
          />

          <Stack gap="xs">
            <Text size="sm" fw={600}>
              {mode === INPUT_MODES.newMileage
                ? "הזנת קריאת מד המרחק החדשה"
                : "כמה קילומטרים נוספו?"}
            </Text>

            <Group gap="xs" wrap="nowrap" align="flex-start" dir="ltr">
              <ActionIcon
                type="button"
                variant="default"
                size="xl"
                radius="md"
                aria-label="הפחתת קילומטר אחד"
                onClick={() => handleAdjustment(-1)}
                disabled={
                  isSaving ||
                  parsedInput === null ||
                  parsedInput <= minimumValue
                }
              >
                <i className="ph-bold ph-minus" aria-hidden="true" />
              </ActionIcon>

              <NumberInput
                dir="rtl"
                aria-label={
                  mode === INPUT_MODES.newMileage
                    ? "קילומטראז׳ חדש"
                    : "מספר הקילומטרים שנוספו"
                }
                value={inputValue}
                onChange={handleMileageChange}
                error={inputError || undefined}
                thousandSeparator=","
                suffix=" ק״מ"
                min={minimumValue}
                step={1}
                allowDecimal={false}
                allowNegative={false}
                clampBehavior="none"
                hideControls
                inputMode="numeric"
                selectAllOnFocus
                size="xl"
                disabled={isSaving}
                style={{ flex: 1 }}
                styles={{
                  input: {
                    direction: "ltr",
                    textAlign: "center",
                    fontWeight: 700,
                  },
                }}
              />

              <ActionIcon
                type="button"
                variant="default"
                size="xl"
                radius="md"
                aria-label="הוספת קילומטר אחד"
                onClick={() => handleAdjustment(1)}
                disabled={isSaving}
              >
                <i className="ph-bold ph-plus" aria-hidden="true" />
              </ActionIcon>
            </Group>

            <SimpleGrid cols={4} spacing="xs">
              {QUICK_INCREMENTS.map((increment) => (
                <Button
                  key={increment}
                  type="button"
                  variant="light"
                  onClick={() => handleAdjustment(increment)}
                  disabled={isSaving}
                  px="xs"
                  dir="ltr"
                >
                  +{formatMileage(increment)}
                </Button>
              ))}
            </SimpleGrid>

            <Group justify="flex-start">
              <Button
                type="button"
                variant="subtle"
                color="gray"
                size="compact-sm"
                onClick={handleReset}
                disabled={isSaving}
                leftSection={
                  <i className="ph-bold ph-arrow-counter-clockwise" aria-hidden="true" />
                }
              >
                איפוס לנוכחי
              </Button>
            </Group>
          </Stack>

          <Paper
            withBorder
            radius="lg"
            p="md"
            bg={`${previewColor}.0`}
            style={{
              borderColor: `var(--mantine-color-${previewColor}-2)`,
            }}
          >
            <Group gap="sm" wrap="nowrap" align="flex-start">
              <ThemeIcon
                color={previewColor}
                variant="light"
                radius="xl"
                size="lg"
                style={{ flexShrink: 0 }}
              >
                <i className={`ph-bold ${previewIcon}`} aria-hidden="true" />
              </ThemeIcon>

              <Stack gap={2}>
                <Text fw={700} c={`${previewColor}.8`}>
                  {inputError
                    ? "יש לתקן את הערך שהוזן"
                    : difference > 0
                      ? `נוספו ${formatMileage(difference)} ק״מ מאז העדכון הקודם`
                      : "לא בוצע שינוי בקילומטראז׳"}
                </Text>
                {!inputError && difference > 0 && (
                  <Text size="sm" c="dimmed">
                    הקילומטראז׳ החדש יהיה {formatMileage(finalMileage)} ק״מ
                  </Text>
                )}
              </Stack>
            </Group>
          </Paper>

          {submitError && (
            <Alert color="red" title="הקילומטראז׳ לא עודכן" radius="md">
              {submitError}
            </Alert>
          )}

          <Group grow gap="sm">
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
              disabled={!canSubmit || isSaving}
            >
              שמור ועדכן
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
