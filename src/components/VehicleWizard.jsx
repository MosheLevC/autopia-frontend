import { useRef, useState } from "react";
import { Alert, Button, Group, Stack } from "@mantine/core";
import LicensePlateStep from "./AddVehicle/LicensePlateStep";
import StepProgress from "./AddVehicle/StepProgress";
import VehicleDetailsStep from "./AddVehicle/VehicleDetailsStep";
import VehicleSummaryStep from "./AddVehicle/VehicleSummaryStep";
import VehicleUsageStep from "./AddVehicle/VehicleUsageStep";
import { cleanLicensePlate } from "../utils/plateUtils";
import {
  isValidDateInput,
  MIN_VEHICLE_YEAR,
  parseInteger,
} from "../utils/vehicleFormUtils";

const VEHICLE_DETAILS_FORM_ID = "vehicle-details-form";
const VEHICLE_USAGE_FORM_ID = "vehicle-usage-form";

const buildFinalVehiclePayload = (formData) => {
  const licensePlate = cleanLicensePlate(formData.licensePlate);
  const manufacturer = formData.manufacturer?.trim();
  const model = formData.model?.trim();
  const fuelType = formData.fuelType?.trim();
  const year = parseInteger(formData.year);
  const currentMileage = parseInteger(formData.currentMileage);
  const currentYear = new Date().getFullYear();

  if (
    (licensePlate.length !== 7 && licensePlate.length !== 8) ||
    !manufacturer ||
    !model ||
    !fuelType ||
    year === null ||
    year < MIN_VEHICLE_YEAR ||
    year > currentYear + 1 ||
    currentMileage === null ||
    currentMileage < 0
  ) {
    return null;
  }

  const payload = {
    licensePlate,
    manufacturer,
    model,
    year,
    fuelType,
    currentMileage,
  };

  ["color", "trimLevel"].forEach((field) => {
    const value = formData[field]?.trim();

    if (value) {
      payload[field] = value;
    }
  });

  for (const field of [
    "vehicleLicenseValidUntil",
    "lastMaintenanceDate",
    "insuranceExpiryDate",
  ]) {
    const value = formData[field]?.trim();

    if (value) {
      if (!isValidDateInput(value)) {
        return null;
      }

      payload[field] = value;
    }
  }

  if (formData.maintenanceInterval !== "") {
    const maintenanceInterval = parseInteger(formData.maintenanceInterval);

    if (maintenanceInterval === null || maintenanceInterval < 1) {
      return null;
    }

    payload.maintenanceInterval = maintenanceInterval;
  }

  if (formData.governmentData !== null) {
    if (
      typeof formData.governmentData !== "object" ||
      Array.isArray(formData.governmentData)
    ) {
      return null;
    }

    payload.governmentData = formData.governmentData;
  }

  return payload;
};

export default function VehicleWizard({
  onComplete,
  onCancel,
  isLoading = false,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [finalSubmissionError, setFinalSubmissionError] = useState("");
  const submissionInFlightRef = useRef(false);

  const [formData, setFormData] = useState({
    licensePlate: "",
    manufacturer: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    fuelType: "",
    trimLevel: "",
    currentMileage: "",
    vehicleLicenseValidUntil: "",
    insuranceExpiryDate: "",
    lastMaintenanceDate: "",
    maintenanceInterval: "",
    governmentData: null,
  });

  const stepsList = [
    { title: "הזנת מספר רכב" },
    { title: "פרטי רכב" },
    { title: "תחזוקה ראשונית" },
    { title: "סיכום" },
  ];

  const storePlateForManualEntry = (licensePlate) => {
    setFormData((prev) => ({
      ...prev,
      licensePlate,
      manufacturer: "",
      model: "",
      year: new Date().getFullYear(),
      color: "",
      fuelType: "",
      trimLevel: "",
      currentMileage: "",
      vehicleLicenseValidUntil: "",
      insuranceExpiryDate: "",
      lastMaintenanceDate: "",
      maintenanceInterval: "",
      governmentData: null,
    }));
  };

  const handleLookupSuccess = (vehicle) => {
    setFormData((prev) => ({
      ...prev,
      licensePlate: vehicle.licensePlate,
      manufacturer: vehicle.manufacturer || "",
      model: vehicle.model || "",
      year: vehicle.year ?? new Date().getFullYear(),
      color: vehicle.color || "",
      fuelType: vehicle.fuelType || "",
      trimLevel: vehicle.trimLevel || "",
      currentMileage: "",
      vehicleLicenseValidUntil: vehicle.vehicleLicenseValidUntil || "",
      insuranceExpiryDate: "",
      lastMaintenanceDate: "",
      maintenanceInterval: "",
      governmentData: vehicle.governmentData ?? null,
    }));
    setActiveStep(1);
    setFurthestStep(1);
  };

  const handleManualContinue = (licensePlate) => {
    storePlateForManualEntry(licensePlate);
    setActiveStep(1);
    setFurthestStep(1);
  };

  const handleLookupNotFound = (licensePlate) => {
    storePlateForManualEntry(licensePlate);
    setFurthestStep(0);
  };

  const handleVehicleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFurthestStep((current) => Math.min(current, 1));
  };

  const handleVehicleDetailsContinue = (vehicleDetails) => {
    setFormData((prev) => ({ ...prev, ...vehicleDetails }));
    setActiveStep(2);
    setFurthestStep(2);
  };

  const handleVehicleUsageDirty = () => {
    setFurthestStep((current) => Math.min(current, 2));
  };

  const handleVehicleUsageContinue = (usageDetails) => {
    setFormData((prev) => ({ ...prev, ...usageDetails }));
    setActiveStep(3);
    setFurthestStep(3);
  };

  const handlePreviousStep = () => {
    setFinalSubmissionError("");
    setActiveStep((current) => Math.max(current - 1, 0));
  };

  const handleStepClick = (step) => {
    if (!isLoading && step <= furthestStep) {
      setFinalSubmissionError("");
      setActiveStep(step);
    }
  };

  const handleFinalSubmit = async () => {
    if (isLoading || submissionInFlightRef.current) {
      return;
    }

    const payload = buildFinalVehiclePayload(formData);

    if (!payload || typeof onComplete !== "function") {
      setFinalSubmissionError(
        "חלק מפרטי החובה אינם תקינים. חזרו לשלבים הקודמים ובדקו את הפרטים.",
      );
      return;
    }

    setFinalSubmissionError("");
    submissionInFlightRef.current = true;

    try {
      await onComplete(payload);
    } catch {
      // The existing Vehicle store/page error UI reports creation failures.
    } finally {
      submissionInFlightRef.current = false;
    }
  };

  return (
    <Stack gap="xl" dir="rtl" maw={850} mx="auto" w="100%">
      <StepProgress
        activeStep={activeStep}
        steps={stepsList}
        onStepClick={handleStepClick}
      />

      {activeStep === 0 && (
        <LicensePlateStep
          licensePlate={formData.licensePlate}
          onLookupSuccess={handleLookupSuccess}
          onLookupNotFound={handleLookupNotFound}
          onManualContinue={handleManualContinue}
        />
      )}

      {activeStep === 1 && (
        <VehicleDetailsStep
          formId={VEHICLE_DETAILS_FORM_ID}
          vehicleData={formData}
          isGovernmentAssisted={Boolean(formData.governmentData)}
          onFieldChange={handleVehicleFieldChange}
          onContinue={handleVehicleDetailsContinue}
          onChangePlate={() => setActiveStep(0)}
        />
      )}

      {activeStep === 2 && (
        <VehicleUsageStep
          formId={VEHICLE_USAGE_FORM_ID}
          usageData={formData}
          onDirty={handleVehicleUsageDirty}
          onContinue={handleVehicleUsageContinue}
        />
      )}

      {activeStep === 3 && <VehicleSummaryStep vehicleData={formData} />}

      {activeStep === 3 && finalSubmissionError && (
        <Alert color="red" radius="md">
          {finalSubmissionError}
        </Alert>
      )}

      <Group justify="center" w="100%" gap="md" mt="xs">
        <Button
          variant="default"
          size="md"
          radius="md"
          w={{ base: "100%", xs: 128 }}
          onClick={onCancel}
          disabled={isLoading}
        >
          ביטול
        </Button>

        {activeStep > 0 && (
          <Button
            variant="default"
            size="md"
            radius="md"
            w={{ base: "100%", xs: 128 }}
            onClick={handlePreviousStep}
            disabled={isLoading}
          >
            חזרה
          </Button>
        )}

        {activeStep === 1 && (
          <Button
            type="submit"
            form={VEHICLE_DETAILS_FORM_ID}
            size="md"
            radius="md"
            w={{ base: "100%", xs: 128 }}
            disabled={isLoading}
          >
            המשך
          </Button>
        )}

        {activeStep === 2 && (
          <Button
            type="submit"
            form={VEHICLE_USAGE_FORM_ID}
            size="md"
            radius="md"
            w={{ base: "100%", xs: 128 }}
            disabled={isLoading}
          >
            המשך
          </Button>
        )}

        {activeStep === 3 && (
          <Button
            size="md"
            radius="md"
            w={{ base: "100%", xs: 128 }}
            onClick={handleFinalSubmit}
            loading={isLoading}
            disabled={isLoading}
          >
            הוספת רכב
          </Button>
        )}
      </Group>
    </Stack>
  );
}
