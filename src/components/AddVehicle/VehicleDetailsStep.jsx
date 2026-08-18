import { useState } from "react";
import {
  Autocomplete,
  Button,
  Card,
  Grid,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  cleanLicensePlate,
  formatLicensePlate,
} from "../../utils/plateUtils";
import {
  FUEL_TYPE_OPTIONS,
  MIN_VEHICLE_YEAR,
} from "../../utils/vehicleFormUtils";
import IsraeliLicensePlate from "./IsraeliLicensePlate";

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 102 }, (_, index) =>
  String(CURRENT_YEAR + 1 - index),
);
const getPlateError = (licensePlate) => {
  const cleanPlate = cleanLicensePlate(licensePlate);
  return cleanPlate.length === 7 || cleanPlate.length === 8
    ? null
    : "נא להזין מספר רישוי תקין (7 או 8 ספרות)";
};

const getYearValue = (year) => {
  if (typeof year === "number") {
    return year;
  }

  if (typeof year === "string" && year.trim()) {
    return Number(year);
  }

  return Number.NaN;
};

const filterYearOptions = ({ options, search }) => {
  const query = search.trim();
  const matchesExistingYear = options.some(
    (option) => option.value === query,
  );

  if (!query || matchesExistingYear) {
    return options;
  }

  return options.filter((option) => option.value.startsWith(query));
};

export default function VehicleDetailsStep({
  formId,
  vehicleData,
  isGovernmentAssisted,
  onFieldChange,
  onContinue,
  onChangePlate,
}) {
  const [plateInput, setPlateInput] = useState(() =>
    formatLicensePlate(vehicleData.licensePlate),
  );
  const [fieldErrors, setFieldErrors] = useState({});

  const clearFieldError = (field) => {
    if (fieldErrors[field]) {
      setFieldErrors((current) => ({ ...current, [field]: null }));
    }
  };

  const handleTextChange = (field, value) => {
    onFieldChange(field, value);
    clearFieldError(field);
  };

  const handleYearChange = (value) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 4);
    onFieldChange("year", digitsOnly ? Number(digitsOnly) : "");
    clearFieldError("year");
  };

  const currentFuelType = vehicleData.fuelType?.trim() || "";
  const fuelTypeOptions =
    currentFuelType && !FUEL_TYPE_OPTIONS.includes(currentFuelType)
      ? [currentFuelType, ...FUEL_TYPE_OPTIONS]
      : FUEL_TYPE_OPTIONS;

  const handlePlateChange = (event) => {
    const formattedPlate = formatLicensePlate(event.target.value);
    setPlateInput(formattedPlate);
    onFieldChange("licensePlate", cleanLicensePlate(formattedPlate));
    clearFieldError("licensePlate");
  };

  const validate = () => {
    const errors = {};
    const cleanPlate = cleanLicensePlate(plateInput);
    const parsedYear = getYearValue(vehicleData.year);
    const plateError = getPlateError(cleanPlate);

    if (plateError) {
      errors.licensePlate = plateError;
    }
    if (!vehicleData.manufacturer.trim()) {
      errors.manufacturer = "נא להזין יצרן";
    }
    if (!vehicleData.model.trim()) {
      errors.model = "נא להזין דגם";
    }
    if (
      !Number.isInteger(parsedYear) ||
      parsedYear < MIN_VEHICLE_YEAR ||
      parsedYear > CURRENT_YEAR + 1
    ) {
      errors.year = "נא להזין שנת ייצור תקינה";
    }
    if (!vehicleData.fuelType.trim()) {
      errors.fuelType = "נא להזין סוג דלק";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return null;
    }

    return {
      licensePlate: cleanPlate,
      manufacturer: vehicleData.manufacturer.trim(),
      model: vehicleData.model.trim(),
      year: parsedYear,
      fuelType: vehicleData.fuelType.trim(),
      color: vehicleData.color.trim(),
    };
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validatedDetails = validate();
    if (validatedDetails) {
      onContinue(validatedDetails);
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <Card shadow="sm" p={{ base: "md", sm: "xl" }} radius="xl" withBorder>
        <Stack gap="xl">
          <Stack gap={4} ta="center">
            <Title order={3} fw={800}>
              פרטי הרכב
            </Title>
            <Text size="sm" c="dimmed">
              אפשר לעדכן את הפרטים לפני שממשיכים
            </Text>
          </Stack>

          <Grid gutter={{ base: "md", md: "xl" }} align="stretch">
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Paper
                withBorder
                radius="lg"
                py={{ base: "md", sm: "lg" }}
                px={{ base: "md", md: "sm" }}
                bg="gray.0"
                h="100%"
              >
                <Stack gap="sm" align="center" justify="center" h="100%">
                  <Text size="sm" fw={700}>
                    מספר רישוי
                  </Text>
                  <IsraeliLicensePlate
                    value={plateInput}
                    onChange={handlePlateChange}
                    readOnly={isGovernmentAssisted}
                  />
                  {fieldErrors.licensePlate && (
                    <Text size="xs" c="red.7" ta="center">
                      {fieldErrors.licensePlate}
                    </Text>
                  )}
                  {isGovernmentAssisted && (
                    <Button
                      type="button"
                      variant="subtle"
                      size="compact-sm"
                      onClick={onChangePlate}
                      leftSection={
                        <i
                          className="ph-bold ph-pencil-simple"
                          aria-hidden="true"
                        />
                      }
                    >
                      שינוי מספר רכב
                    </Button>
                  )}
                </Stack>
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 7 }}>
              <Stack gap="md">
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  <TextInput
                    label="יצרן"
                    withAsterisk
                    value={vehicleData.manufacturer}
                    onChange={(event) =>
                      handleTextChange("manufacturer", event.target.value)
                    }
                    error={fieldErrors.manufacturer}
                    size="md"
                    radius="md"
                  />
                  <TextInput
                    label="דגם"
                    withAsterisk
                    value={vehicleData.model}
                    onChange={(event) =>
                      handleTextChange("model", event.target.value)
                    }
                    error={fieldErrors.model}
                    size="md"
                    radius="md"
                  />
                  <Autocomplete
                    label="שנת ייצור"
                    withAsterisk
                    placeholder="בחרו או הקלידו שנה"
                    value={
                      vehicleData.year === ""
                        ? ""
                        : String(vehicleData.year)
                    }
                    onChange={handleYearChange}
                    data={YEAR_OPTIONS}
                    filter={filterYearOptions}
                    maxDropdownHeight={240}
                    inputMode="numeric"
                    rightSection={
                      <i className="ph-bold ph-caret-down" aria-hidden="true" />
                    }
                    rightSectionPointerEvents="none"
                    error={fieldErrors.year}
                    size="md"
                    radius="md"
                  />
                  <Select
                    label="סוג דלק"
                    withAsterisk
                    placeholder="בחרו סוג דלק"
                    value={currentFuelType || null}
                    onChange={(value) =>
                      handleTextChange("fuelType", value || "")
                    }
                    data={fuelTypeOptions}
                    searchable
                    allowDeselect={false}
                    error={fieldErrors.fuelType}
                    size="md"
                    radius="md"
                  />
                  <TextInput
                    label="צבע"
                    description="אופציונלי"
                    value={vehicleData.color}
                    onChange={(event) =>
                      handleTextChange("color", event.target.value)
                    }
                    size="md"
                    radius="md"
                  />
                </SimpleGrid>

                {isGovernmentAssisted && (
                  <Group gap="xs" justify="center">
                    <i className="ph-bold ph-info" aria-hidden="true" />
                    <Text size="xs" c="dimmed">
                      הפרטים אותרו במאגר הממשלתי וניתנים לעריכה
                    </Text>
                  </Group>
                )}
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      </Card>
    </form>
  );
}
