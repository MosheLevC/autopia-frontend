import { useState } from "react";
import { Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import LicensePlateStep from "./AddVehicle/LicensePlateStep";
import StepProgress from "./AddVehicle/StepProgress";
import VehicleDetailsStep from "./AddVehicle/VehicleDetailsStep";
import VehicleManualStep from "./AddVehicle/VehicleManualStep";
import { formatLicensePlate } from "../utils/plateUtils";

const VEHICLE_DETAILS_FORM_ID = "vehicle-details-form";

export default function VehicleWizard({ onComplete, onCancel }) {
  const [activeStep, setActiveStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);

  const [formData, setFormData] = useState({
    licensePlate: "",
    manufacturer: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    fuelType: "",
    trimLevel: "",
    currentMileage: 0,
    vehicleLicenseValidUntil: "",
    insuranceExpiryDate: "",
    manualFile: null,
    manualFileName: "",
    lastServiceDate: "",
    lastServiceMileage: 0,
    serviceInterval: "",
    governmentData: null,
  });

  const stepsList = [
    { title: "הזנת מספר רכב" },
    { title: "פרטי רכב" },
    { title: "ספר רכב" },
    { title: "העדפות" },
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
      vehicleLicenseValidUntil: "",
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
      currentMileage: vehicle.currentMileage ?? prev.currentMileage,
      vehicleLicenseValidUntil: vehicle.vehicleLicenseValidUntil || "",
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

  const handleNextStep = () => {
    if (activeStep < 4) {
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      setFurthestStep((current) => Math.max(current, nextStep));
    } else {
      onComplete?.(formData);
    }
  };

  const handlePreviousStep = () => {
    setActiveStep((current) => Math.max(current - 1, 0));
  };

  const handleStepClick = (step) => {
    if (step <= furthestStep) {
      setActiveStep(step);
    }
  };

  return (
    <Stack gap="xl" dir="rtl" maw={1100} mx="auto">
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

      {activeStep === 2 && <VehicleManualStep onContinue={handleNextStep} />}

      {activeStep > 2 && (
        <Card shadow="sm" p="xl" radius="xl" withBorder>
          <Stack align="center" py="xl">
            <Title order={3}>
              שלב {activeStep + 1} בפיתוח...
            </Title>
            <Text c="dimmed">
              מספר הרישוי שנבחר: {formatLicensePlate(formData.licensePlate)} (
              {formData.licensePlate})
            </Text>
            <Button variant="light" onClick={() => setActiveStep(0)}>
              חזור לשלב 1
            </Button>
          </Stack>
        </Card>
      )}

      <Group justify="center" w="100%" gap="md" mt="xs">
        <Button
          variant="default"
          size="md"
          radius="md"
          w={{ base: "100%", xs: 128 }}
          onClick={onCancel}
        >
          ביטול
        </Button>

        {activeStep > 0 && activeStep <= 2 && (
          <Button
            variant="default"
            size="md"
            radius="md"
            w={{ base: "100%", xs: 128 }}
            onClick={handlePreviousStep}
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
          >
            המשך
          </Button>
        )}

        {activeStep > 1 && (
          <Button
            size="md"
            radius="md"
            w={{ base: "100%", xs: 128 }}
            onClick={handleNextStep}
          >
            המשך
          </Button>
        )}
      </Group>
    </Stack>
  );
}
