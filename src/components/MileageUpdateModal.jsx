import { useEffect, useState } from "react";
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Grid,
  Group,
  Loader,
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
import {
  Gauge,
  Minus,
  Plus,
  ArrowCounterClockwise,
} from "@phosphor-icons/react";

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

function MileageFlowSummary({
  currentMileage,
  finalMileage,
  difference,
  hasError,
}) {
  const hasValidSummary = !hasError && finalMileage !== null;
  const addedMileage =
    hasValidSummary && difference > 0 ? difference : 0;

  return (
    <Grid gutter="sm">
      <Grid.Col span={{ base: 12, xs: 4 }}>
        <Paper
          component="section"
          aria-label="סיכום הקילומטראז׳ הנוכחי"
          withBorder
          radius="lg"
          shadow="xs"
          p="md"
          bg="gray.0"
          h="100%"
        >
          <Stack gap={4} align="center" justify="center" ta="center" h="100%">
            <ThemeIcon color="blue" variant="light" size={36} radius="xl">
              <Gauge size={20} weight="bold" aria-hidden="true" />
            </ThemeIcon>
            <Text size="xs" c="dimmed" fw={600}>
              קילומטראז׳ נוכחי
            </Text>
            <Text
              fw={800}
              fz={{ base: "1.6rem", sm: "1.45rem" }}
              c="gray.9"
              dir="ltr"
              lh={1.15}
            >
              {formatMileage(currentMileage)} ק״מ
            </Text>
          </Stack>
        </Paper>
      </Grid.Col>

      <Grid.Col span={{ base: 6, xs: 4 }}>
        <Paper
          component="section"
          aria-label="סיכום הקילומטראז׳ החדש"
          withBorder
          radius="lg"
          shadow="xs"
          p="md"
          h="100%"
        >
          <Stack gap={4} align="center" justify="center" ta="center" h="100%">
            <Text size="xs" c="dimmed" fw={600}>
              קילומטראז׳ חדש
            </Text>
            <Text
              fw={800}
              fz={{ base: "1.15rem", sm: "1.35rem" }}
              c="gray.9"
              dir="ltr"
              lh={1.2}
            >
              {hasValidSummary
                ? `${formatMileage(finalMileage)} ק״מ`
                : "—"}
            </Text>
          </Stack>
        </Paper>
      </Grid.Col>

      <Grid.Col span={{ base: 6, xs: 4 }}>
        <Paper
          component="section"
          aria-label="סיכום הקילומטרים שנוספו"
          withBorder
          radius="lg"
          shadow="xs"
          p="md"
          bg="gray.0"
          h="100%"
        >
          <Stack gap={4} align="center" justify="center" ta="center" h="100%">
            <Text size="xs" c="dimmed" fw={600}>
              תוספת
            </Text>
            <Text
              fw={800}
              fz={{ base: "1.15rem", sm: "1.35rem" }}
              c={hasValidSummary && addedMileage > 0 ? "blue.7" : "gray.7"}
              dir="ltr"
              lh={1.2}
            >
              {hasValidSummary
                ? `+${formatMileage(addedMileage)} ק״מ`
                : "—"}
            </Text>
          </Stack>
        </Paper>
      </Grid.Col>
    </Grid>
  );
}

function UpdateFeedback({ error, isSaving }) {
  if (!error && !isSaving) {
    return null;
  }

  return (
    <Box
      w="100%"
      aria-live="polite"
      style={{ display: "flex", alignItems: "center" }}
    >
      {error ? (
        <Alert
          color="red"
          title="הקילומטראז׳ לא עודכן"
          radius="md"
          w="100%"
        >
          {error}
        </Alert>
      ) : isSaving ? (
        <Group justify="center" gap="xs" w="100%">
          <Loader size="xs" />
          <Text size="sm" c="dimmed">
            מעדכנים את הקילומטראז׳...
          </Text>
        </Group>
      ) : null}
    </Box>
  );
}

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

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="עדכון קילומטראז׳"
      centered={!isMobile}
      size={680}
      radius="lg"
      padding={{ base: "md", sm: "lg" }}
      xOffset={
        isMobile ? "var(--mantine-spacing-xs)" : "var(--mantine-spacing-md)"
      }
      yOffset={isMobile ? "var(--mantine-spacing-xs)" : "5dvh"}
      removeScrollProps={{ removeScrollBar: false }}
      closeOnClickOutside={!isSaving}
      closeOnEscape={!isSaving}
      withCloseButton={!isSaving}
    >
      <form onSubmit={handleSubmit}>
        <Stack gap={{ base: "sm", sm: "md" }}>
          <MileageFlowSummary
            currentMileage={currentMileage}
            finalMileage={finalMileage}
            difference={difference}
            hasError={Boolean(inputError)}
          />

          <SegmentedControl
            fullWidth
            value={mode}
            onChange={handleModeChange}
            disabled={isSaving}
            radius="md"
            size="md"
            color="blue"
            autoContrast
            bg="gray.1"
            styles={{
              root: {
                border: "1px solid var(--mantine-color-gray-2)",
              },
              indicator: {
                boxShadow: "var(--mantine-shadow-sm)",
              },
              label: {
                fontWeight: 600,
              },
            }}
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
            <Text size="sm" fw={700}>
              {mode === INPUT_MODES.newMileage
                ? "הזנת קריאת מד המרחק החדשה"
                : "כמה קילומטרים נוספו?"}
            </Text>

            <Group gap="xs" wrap="nowrap" align="flex-start" dir="ltr">
              <ActionIcon
                type="button"
                variant="default"
                size={56}
                radius="md"
                shadow="xs"
                aria-label="הפחתת קילומטר אחד"
                onClick={() => handleAdjustment(-1)}
                disabled={
                  isSaving ||
                  parsedInput === null ||
                  parsedInput <= minimumValue
                }
              >
                <Minus size={20} weight="bold" aria-hidden="true" />
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
                    height: 56,
                    direction: "ltr",
                    textAlign: "center",
                    fontSize: "var(--mantine-font-size-xl)",
                    fontWeight: 800,
                    boxShadow: "var(--mantine-shadow-xs)",
                  },
                  error: {
                    direction: "rtl",
                    textAlign: "right",
                  },
                }}
              />

              <ActionIcon
                type="button"
                variant="default"
                size={56}
                radius="md"
                shadow="xs"
                aria-label="הוספת קילומטר אחד"
                onClick={() => handleAdjustment(1)}
                disabled={isSaving}
              >
                <Plus size={20} weight="bold" aria-hidden="true" />
              </ActionIcon>
            </Group>

            <SimpleGrid cols={4} spacing="xs">
              {QUICK_INCREMENTS.map((increment) => (
                <Button
                  key={increment}
                  type="button"
                  variant="default"
                  onClick={() => handleAdjustment(increment)}
                  disabled={isSaving}
                  px="xs"
                  h={44}
                  radius="md"
                  shadow="xs"
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
                size="sm"
                radius="md"
                onClick={handleReset}
                disabled={isSaving}
                leftSection={
                  <ArrowCounterClockwise size={16} weight="bold" aria-hidden="true" />
                }
              >
                איפוס לנוכחי
              </Button>
            </Group>
          </Stack>

          <UpdateFeedback error={submitError} isSaving={isSaving} />

          <Group grow gap="sm">
            <Button
              type="button"
              variant="default"
              size="lg"
              radius="md"
              fw={600}
              onClick={handleClose}
              disabled={isSaving}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              size="lg"
              radius="md"
              fw={700}
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
