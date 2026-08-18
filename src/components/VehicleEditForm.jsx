import { useMemo, useState } from "react";
import {
  Button,
  Group,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { FUEL_TYPE_OPTIONS } from "../utils/vehicleFormUtils";
import {
  createVehicleEditDraft,
  hasVehicleEditChanges,
  validateVehicleEditDraft,
} from "../utils/vehicleEditFormUtils";

const DATE_FIELDS = [
  {
    field: "lastServiceDate",
    label: "תאריך טיפול אחרון",
  },
  {
    field: "vehicleLicenseValidUntil",
    label: "תוקף רישיון רכב / טסט",
  },
  {
    field: "insuranceExpiryDate",
    label: "תוקף ביטוח חובה",
  },
];

export default function VehicleEditForm({
  vehicle,
  isSaving,
  onCancel,
  onSubmit,
}) {
  const [draft, setDraft] = useState(() => createVehicleEditDraft(vehicle));
  const [fieldErrors, setFieldErrors] = useState({});
  const hasChanges = hasVehicleEditChanges(vehicle, draft);

  const fuelTypeOptions = useMemo(() => {
    const currentFuelType = draft.fuelType.trim();
    return currentFuelType && !FUEL_TYPE_OPTIONS.includes(currentFuelType)
      ? [currentFuelType, ...FUEL_TYPE_OPTIONS]
      : FUEL_TYPE_OPTIONS;
  }, [draft.fuelType]);

  const handleFieldChange = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      return { ...current, [field]: null };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    const result = validateVehicleEditDraft(vehicle, draft);
    setFieldErrors(result.errors);

    if (!result.payload || Object.keys(result.payload).length === 0) {
      return;
    }

    onSubmit(result.payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="xl">
        <Stack gap="md">
          <Title order={3} size="h4">
            פרטים כלליים
          </Title>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <TextInput
              label="יצרן"
              withAsterisk
              value={draft.manufacturer}
              onChange={(event) =>
                handleFieldChange("manufacturer", event.currentTarget.value)
              }
              error={fieldErrors.manufacturer}
              disabled={isSaving}
            />
            <TextInput
              label="דגם"
              withAsterisk
              value={draft.model}
              onChange={(event) =>
                handleFieldChange("model", event.currentTarget.value)
              }
              error={fieldErrors.model}
              disabled={isSaving}
            />
            <NumberInput
              label="שנת ייצור"
              withAsterisk
              value={draft.year}
              onChange={(value) => handleFieldChange("year", value)}
              error={fieldErrors.year}
              allowDecimal={false}
              allowNegative={false}
              clampBehavior="none"
              hideControls
              inputMode="numeric"
              disabled={isSaving}
            />
            <Select
              label="סוג דלק"
              withAsterisk
              value={draft.fuelType || null}
              onChange={(value) => handleFieldChange("fuelType", value || "")}
              data={fuelTypeOptions}
              searchable
              allowDeselect={false}
              error={fieldErrors.fuelType}
              disabled={isSaving}
            />
            <TextInput
              label="רמת גימור"
              description="אופציונלי"
              value={draft.trimLevel}
              onChange={(event) =>
                handleFieldChange("trimLevel", event.currentTarget.value)
              }
              disabled={isSaving}
            />
            <TextInput
              label="צבע"
              description="אופציונלי"
              value={draft.color}
              onChange={(event) =>
                handleFieldChange("color", event.currentTarget.value)
              }
              disabled={isSaving}
            />
          </SimpleGrid>
        </Stack>

        <Stack gap="md">
          <Stack gap={2}>
            <Title order={3} size="h4">
              קילומטראז׳ ותחזוקה
            </Title>
            <Text size="sm" c="dimmed">
              עריכת הקילומטראז׳ מאפשרת גם תיקון לערך נמוך יותר.
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <NumberInput
              label="קילומטראז׳ נוכחי"
              withAsterisk
              value={draft.currentMileage}
              onChange={(value) =>
                handleFieldChange("currentMileage", value)
              }
              error={fieldErrors.currentMileage}
              suffix=" ק״מ"
              thousandSeparator=","
              allowDecimal={false}
              allowNegative={false}
              clampBehavior="none"
              hideControls
              inputMode="numeric"
              disabled={isSaving}
            />
            <NumberInput
              label="מרווח טיפולים"
              description="אופציונלי"
              value={draft.serviceIntervalKm}
              onChange={(value) =>
                handleFieldChange("serviceIntervalKm", value)
              }
              error={fieldErrors.serviceIntervalKm}
              suffix=" ק״מ"
              thousandSeparator=","
              allowDecimal={false}
              allowNegative={false}
              clampBehavior="none"
              hideControls
              inputMode="numeric"
              disabled={isSaving}
            />
          </SimpleGrid>
        </Stack>

        <Stack gap="md">
          <Title order={3} size="h4">
            תאריכים
          </Title>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {DATE_FIELDS.map(({ field, label }) => (
              <TextInput
                key={field}
                type="date"
                label={label}
                description="אופציונלי"
                value={draft[field]}
                onChange={(event) =>
                  handleFieldChange(field, event.currentTarget.value)
                }
                error={fieldErrors[field]}
                styles={{ input: { direction: "ltr" } }}
                disabled={isSaving}
              />
            ))}
          </SimpleGrid>
        </Stack>

        <Group grow gap="sm" mt="xs">
          <Button
            type="button"
            variant="default"
            onClick={onCancel}
            disabled={isSaving}
          >
            ביטול
          </Button>
          <Button
            type="submit"
            loading={isSaving}
            disabled={!hasChanges || isSaving}
          >
            שמירת שינויים
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

