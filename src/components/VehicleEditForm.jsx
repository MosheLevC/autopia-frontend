import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Group,
  NumberInput,
  Select,
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
    field: "lastMaintenanceDate",
    label: "תאריך טיפול אחרון",
  },
  {
    field: "insuranceExpiryDate",
    label: "תוקף ביטוח חובה",
  },
  {
    field: "vehicleLicenseValidUntil",
    label: "תוקף רישיון רכב / טסט",
    fullWidthOnMobile: true,
  },
];

const FIELD_GRID_GUTTER = { base: "sm", sm: "md" };

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
    <Box component="form" w="100%" onSubmit={handleSubmit}>
      <Stack gap={{ base: "md", sm: "lg" }}>
        <Stack gap="sm">
          <Title order={3} size="h4">
            פרטים כלליים
          </Title>

          <Grid gutter={FIELD_GRID_GUTTER} w="100%">
            <Grid.Col span={{ base: 6, sm: 4 }} miw={0}>
              <TextInput
                w="100%"
                label="יצרן"
                description="שדה חובה"
                withAsterisk
                value={draft.manufacturer}
                onChange={(event) =>
                  handleFieldChange("manufacturer", event.currentTarget.value)
                }
                error={fieldErrors.manufacturer}
                disabled={isSaving}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 6, sm: 4 }} miw={0}>
              <TextInput
                w="100%"
                label="דגם"
                description="שדה חובה"
                withAsterisk
                value={draft.model}
                onChange={(event) =>
                  handleFieldChange("model", event.currentTarget.value)
                }
                error={fieldErrors.model}
                disabled={isSaving}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 6, sm: 4 }} miw={0}>
              <NumberInput
                w="100%"
                label="שנת ייצור"
                description="שדה חובה"
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
            </Grid.Col>
            <Grid.Col span={{ base: 6, sm: 4 }} miw={0}>
              <Select
                w="100%"
                label="סוג דלק"
                description="שדה חובה"
                withAsterisk
                value={draft.fuelType || null}
                onChange={(value) => handleFieldChange("fuelType", value || "")}
                data={fuelTypeOptions}
                searchable
                allowDeselect={false}
                error={fieldErrors.fuelType}
                disabled={isSaving}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 6, sm: 4 }} miw={0}>
              <TextInput
                w="100%"
                label="רמת גימור"
                description="אופציונלי"
                value={draft.trimLevel}
                onChange={(event) =>
                  handleFieldChange("trimLevel", event.currentTarget.value)
                }
                disabled={isSaving}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 6, sm: 4 }} miw={0}>
              <TextInput
                w="100%"
                label="צבע"
                description="אופציונלי"
                value={draft.color}
                onChange={(event) =>
                  handleFieldChange("color", event.currentTarget.value)
                }
                disabled={isSaving}
              />
            </Grid.Col>
          </Grid>
        </Stack>

        <Stack gap="sm">
          <Stack gap={2}>
            <Title order={3} size="h4">
              קילומטראז׳ ותחזוקה
            </Title>
            <Text size="sm" c="dimmed">
              עריכת הקילומטראז׳ מאפשרת גם תיקון לערך נמוך יותר.
            </Text>
          </Stack>

          <Grid gutter={FIELD_GRID_GUTTER} w="100%">
            <Grid.Col span={6} miw={0}>
              <NumberInput
                w="100%"
                label="קילומטראז׳ נוכחי"
                description="שדה חובה"
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
            </Grid.Col>
            <Grid.Col span={6} miw={0}>
              <NumberInput
                w="100%"
                label="מרווח טיפולים"
                description="אופציונלי"
                value={draft.maintenanceInterval}
                onChange={(value) =>
                  handleFieldChange("maintenanceInterval", value)
                }
                error={fieldErrors.maintenanceInterval}
                suffix=" ק״מ"
                thousandSeparator=","
                allowDecimal={false}
                allowNegative={false}
                clampBehavior="none"
                hideControls
                inputMode="numeric"
                disabled={isSaving}
              />
            </Grid.Col>
          </Grid>
        </Stack>

        <Stack gap="sm">
          <Title order={3} size="h4">
            תאריכים
          </Title>

          <Grid gutter={FIELD_GRID_GUTTER} w="100%">
            {DATE_FIELDS.map(({ field, label, fullWidthOnMobile }) => (
              <Grid.Col
                key={field}
                span={{ base: fullWidthOnMobile ? 12 : 6, sm: 4 }}
                miw={0}
              >
                <TextInput
                  w="100%"
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
              </Grid.Col>
            ))}
          </Grid>
        </Stack>

        <Group grow gap="sm" mt="xs" w="100%" wrap="nowrap">
          <Button
            miw={0}
            type="button"
            variant="default"
            onClick={onCancel}
            disabled={isSaving}
          >
            ביטול
          </Button>
          <Button
            miw={0}
            type="submit"
            loading={isSaving}
            disabled={!hasChanges || isSaving}
          >
            שמירת שינויים
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}
