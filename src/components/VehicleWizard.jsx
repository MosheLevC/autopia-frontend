import { useState } from "react";
import { Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import LicensePlateStep from "./AddVehicle/LicensePlateStep";
import StepProgress from "./AddVehicle/StepProgress";
import { formatLicensePlate } from "../utils/plateUtils";

export default function VehicleWizard({ onComplete, onCancel }) {
  const [activeStep, setActiveStep] = useState(0);

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
    { title: "פרטי בעלים" },
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
  };

  const handleManualContinue = (licensePlate) => {
    storePlateForManualEntry(licensePlate);
    setActiveStep(1);
  };

  const handleNextStep = () => {
    if (activeStep < 4) {
      setActiveStep((prev) => prev + 1);
    } else {
      onComplete?.(formData);
    }
  };

  return (
    <Stack gap="xl" dir="rtl" maw={1100} mx="auto">
      <StepProgress
        activeStep={activeStep}
        steps={stepsList}
        onStepClick={(idx) => setActiveStep(idx)}
      />

      {activeStep === 0 && (
        <LicensePlateStep
          licensePlate={formData.licensePlate}
          onLookupSuccess={handleLookupSuccess}
          onLookupNotFound={storePlateForManualEntry}
          onManualContinue={handleManualContinue}
        />
      )}

      {activeStep > 0 && (
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

      <Group justify="flex-end" w="100%" gap="md">
        <Button variant="default" radius="md" onClick={onCancel} px="xl">
          ביטול
        </Button>
        {activeStep > 0 && (
          <Button size="md" radius="md" onClick={handleNextStep} px="xl">
            המשך
          </Button>
        )}
      </Group>
    </Stack>
  );
}
