import { useState } from "react";
import {
  Card,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

const SERVICE_INTERVAL_OPTIONS = [
  { value: "8000", label: "8,000 ק״מ" },
  { value: "10000", label: "10,000 ק״מ" },
  { value: "15000", label: "15,000 ק״מ" },
  { value: "custom", label: "מותאם אישית" },
];

const PRESET_INTERVALS = [8000, 10000, 15000];

const parseInteger = (value) => {
  if (typeof value === "number") {
    return Number.isInteger(value) ? value : null;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replaceAll(",", ""));
    return Number.isInteger(parsed) ? parsed : null;
  }

  return null;
};

const isValidDateInput = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  return (
    parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() === month - 1 &&
    parsedDate.getUTCDate() === day
  );
};

const toDateInputValue = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    const datePrefix = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0];

    if (datePrefix && isValidDateInput(datePrefix)) {
      return datePrefix;
    }
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().slice(0, 10);
};

const getInitialIntervalSelection = (value) => {
  const parsed = parseInteger(value);

  if (parsed === null) {
    return null;
  }

  return PRESET_INTERVALS.includes(parsed) ? String(parsed) : "custom";
};

const getInitialCustomInterval = (value) => {
  const parsed = parseInteger(value);
  return parsed !== null && !PRESET_INTERVALS.includes(parsed) ? parsed : "";
};

export default function VehicleUsageStep({
  formId,
  usageData,
  onDirty,
  onContinue,
}) {
  const [currentMileage, setCurrentMileage] = useState(
    usageData.currentMileage ?? "",
  );
  const [lastServiceDate, setLastServiceDate] = useState(
    toDateInputValue(usageData.lastServiceDate),
  );
  const [vehicleLicenseValidUntil, setVehicleLicenseValidUntil] = useState(
    toDateInputValue(usageData.vehicleLicenseValidUntil),
  );
  const [insuranceExpiryDate, setInsuranceExpiryDate] = useState(
    toDateInputValue(usageData.insuranceExpiryDate),
  );
  const [intervalSelection, setIntervalSelection] = useState(() =>
    getInitialIntervalSelection(usageData.serviceIntervalKm),
  );
  const [customInterval, setCustomInterval] = useState(() =>
    getInitialCustomInterval(usageData.serviceIntervalKm),
  );
  const [fieldErrors, setFieldErrors] = useState({});

  const clearFieldError = (field) => {
    if (fieldErrors[field]) {
      setFieldErrors((current) => ({ ...current, [field]: null }));
    }
  };

  const handleMileageChange = (value) => {
    setCurrentMileage(value);
    clearFieldError("currentMileage");
    onDirty?.();
  };

  const handleDateChange = (field, setValue, value) => {
    setValue(value);
    clearFieldError(field);
    onDirty?.();
  };

  const handleIntervalSelection = (value) => {
    setIntervalSelection(value);
    clearFieldError("serviceIntervalKm");
    onDirty?.();
  };

  const handleCustomIntervalChange = (value) => {
    setCustomInterval(value);
    clearFieldError("serviceIntervalKm");
    onDirty?.();
  };

  const validate = () => {
    const errors = {};
    const parsedMileage = parseInteger(currentMileage);
    const normalizedLastServiceDate = lastServiceDate.trim();
    const normalizedVehicleLicenseDate = vehicleLicenseValidUntil.trim();
    const normalizedInsuranceDate = insuranceExpiryDate.trim();
    let serviceIntervalKm = "";

    if (parsedMileage === null || parsedMileage < 0) {
      errors.currentMileage = "נא להזין קילומטראז' נוכחי תקין";
    }

    if (
      normalizedLastServiceDate &&
      !isValidDateInput(normalizedLastServiceDate)
    ) {
      errors.lastServiceDate = "נא להזין תאריך טיפול תקין";
    }

    if (
      normalizedVehicleLicenseDate &&
      !isValidDateInput(normalizedVehicleLicenseDate)
    ) {
      errors.vehicleLicenseValidUntil = "נא להזין תאריך תוקף רישיון תקין";
    }

    if (
      normalizedInsuranceDate &&
      !isValidDateInput(normalizedInsuranceDate)
    ) {
      errors.insuranceExpiryDate = "נא להזין תאריך תוקף ביטוח תקין";
    }

    if (intervalSelection === "custom") {
      const parsedCustomInterval = parseInteger(customInterval);

      if (parsedCustomInterval === null || parsedCustomInterval < 1) {
        errors.serviceIntervalKm = "נא להזין מרווח טיפולים חיובי";
      } else {
        serviceIntervalKm = parsedCustomInterval;
      }
    } else if (intervalSelection) {
      serviceIntervalKm = Number(intervalSelection);
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return null;
    }

    return {
      currentMileage: parsedMileage,
      lastServiceDate: normalizedLastServiceDate,
      serviceIntervalKm,
      vehicleLicenseValidUntil: normalizedVehicleLicenseDate,
      insuranceExpiryDate: normalizedInsuranceDate,
    };
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validatedUsage = validate();

    if (validatedUsage) {
      onContinue(validatedUsage);
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <Card shadow="sm" p={{ base: "md", sm: "xl" }} radius="xl" withBorder>
        <Stack gap="xl" align="center">
          <Stack gap={4} ta="center">
            <Title order={3} fw={800}>
              פרטי תחזוקה ראשוניים
            </Title>
            <Text size="sm" c="dimmed" maw={560}>
              כמה פרטים בסיסיים יעזרו לנו להתאים את מעקב התחזוקה לרכב שלך
            </Text>
          </Stack>

          <Stack gap="lg" w="100%" maw={760}>
            <NumberInput
              label="קילומטראז' נוכחי"
              withAsterisk
              value={currentMileage}
              onChange={handleMileageChange}
              error={fieldErrors.currentMileage}
              placeholder="לדוגמה: 124,350"
              suffix=" ק״מ"
              thousandSeparator=","
              allowDecimal={false}
              allowNegative={false}
              clampBehavior="none"
              hideControls
              inputMode="numeric"
              size="md"
              radius="md"
            />

            <Stack gap="sm">
              <Text fw={700}>תחזוקה ראשונית</Text>
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                <TextInput
                  type="date"
                  label="מתי עשית טיפול אחרון?"
                  description="אופציונלי"
                  value={lastServiceDate}
                  onChange={(event) =>
                    handleDateChange(
                      "lastServiceDate",
                      setLastServiceDate,
                      event.currentTarget.value,
                    )
                  }
                  error={fieldErrors.lastServiceDate}
                  size="md"
                  radius="md"
                  styles={{ input: { direction: "ltr" } }}
                />

                <Stack gap="sm">
                  <Select
                    label="מרווח טיפולים בקילומטרים"
                    description="אופציונלי"
                    placeholder="בחרו מרווח"
                    data={SERVICE_INTERVAL_OPTIONS}
                    value={intervalSelection}
                    onChange={handleIntervalSelection}
                    clearable
                    size="md"
                    radius="md"
                    error={
                      intervalSelection !== "custom"
                        ? fieldErrors.serviceIntervalKm
                        : undefined
                    }
                  />

                  {intervalSelection === "custom" && (
                    <NumberInput
                      label="מרווח מותאם אישית"
                      value={customInterval}
                      onChange={handleCustomIntervalChange}
                      error={fieldErrors.serviceIntervalKm}
                      placeholder="לדוגמה: 12,000"
                      suffix=" ק״מ"
                      thousandSeparator=","
                      allowDecimal={false}
                      allowNegative={false}
                      clampBehavior="none"
                      hideControls
                      inputMode="numeric"
                      size="md"
                      radius="md"
                    />
                  )}
                </Stack>
              </SimpleGrid>
            </Stack>

            <Stack gap="sm">
              <Text fw={700}>תאריכי תוקף</Text>
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                <TextInput
                  type="date"
                  label="תוקף רישיון רכב / טסט"
                  description="בתוקף עד · אופציונלי"
                  value={vehicleLicenseValidUntil}
                  onChange={(event) =>
                    handleDateChange(
                      "vehicleLicenseValidUntil",
                      setVehicleLicenseValidUntil,
                      event.currentTarget.value,
                    )
                  }
                  error={fieldErrors.vehicleLicenseValidUntil}
                  size="md"
                  radius="md"
                  styles={{ input: { direction: "ltr" } }}
                />

                <TextInput
                  type="date"
                  label="ביטוח חובה"
                  description="בתוקף עד · אופציונלי"
                  value={insuranceExpiryDate}
                  onChange={(event) =>
                    handleDateChange(
                      "insuranceExpiryDate",
                      setInsuranceExpiryDate,
                      event.currentTarget.value,
                    )
                  }
                  error={fieldErrors.insuranceExpiryDate}
                  size="md"
                  radius="md"
                  styles={{ input: { direction: "ltr" } }}
                />
              </SimpleGrid>
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </form>
  );
}
