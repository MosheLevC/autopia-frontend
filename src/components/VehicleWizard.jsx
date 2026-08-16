import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import StepProgress from "./AddVehicle/StepProgress";
import IsraeliLicensePlate from "./AddVehicle/IsraeliLicensePlate";
import StepGuidanceCard from "./AddVehicle/StepGuidanceCard";
import {
  formatLicensePlate,
  cleanLicensePlate,
} from "../utils/plateUtils";
import vehicleService from "../services/vehicleService";

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
  });

  const [plateInput, setPlateInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchNotice, setSearchNotice] = useState("");

  const stepsList = [
    { title: "הזנת מספר רכב" },
    { title: "פרטי רכב" },
    { title: "פרטי בעלים" },
    { title: "העדפות" },
    { title: "סיכום" },
  ];

  const guidanceItemsStep1 = [
    {
      title: "נמצא את פרטי הרכב אוטומטית",
      desc: "נשלוף מידע ממאגרי המידע הרשמיים ונציג לך את פרטי הרכב.",
      icon: "ph-car",
    },
    {
      title: "נמלא עבורך שדות בסיסיים",
      desc: "נתוני הרכב יוזנו אוטומטית כדי לחסוך לך זמן ומאמץ.",
      icon: "ph-clipboard-text",
    },
    {
      title: "תוכל לערוך ולשפר אחר כך",
      desc: "תמיד תוכל להוסיף, לשנות ולעדכן כל פרט בהמשך.",
      icon: "ph-pencil-simple-line",
    },
  ];

  const handlePlateChange = (e) => {
    const formatted = formatLicensePlate(e.target.value);
    setPlateInput(formatted);
    setSearchError("");
    setSearchNotice("");
  };

  const handlePlateSearch = async (targetPlate = plateInput) => {
    const cleanDigits = cleanLicensePlate(targetPlate);
    if (!cleanDigits || (cleanDigits.length !== 7 && cleanDigits.length !== 8)) {
      setSearchError("נא להזין מספר רישוי תקין (7 או 8 ספרות)");
      return;
    }

    setIsSearching(true);
    setSearchError("");
    setSearchNotice("");

    try {
      const result = await vehicleService.lookupVehicle(cleanDigits);
      if (result.success && result.found && result.vehicle) {
        const v = result.vehicle;
        setFormData((prev) => ({
          ...prev,
          licensePlate: cleanDigits,
          manufacturer: v.manufacturer || prev.manufacturer,
          model: v.model || prev.model,
          year: v.year || prev.year,
          color: v.color || prev.color,
          fuelType: v.fuelType || prev.fuelType,
          trimLevel: v.trimLevel || prev.trimLevel,
          currentMileage: v.currentMileage ?? prev.currentMileage,
          vehicleLicenseValidUntil: v.vehicleLicenseValidUntil || prev.vehicleLicenseValidUntil,
        }));
        setSearchNotice(
          `אותר רכב: ${v.manufacturer} ${v.model} (${v.year})`
        );
      } else {
        setFormData((prev) => ({
          ...prev,
          licensePlate: cleanDigits,
        }));
        setSearchNotice("הרכב לא נמצא במאגר. ניתן להמשיך להזנה ידנית.");
      }
    } catch (err) {
      setSearchError(err.message || "שגיאה בחיפוש מספר הרישוי. ניתן להמשיך ידנית.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleManualContinue = () => {
    const cleanDigits = cleanLicensePlate(plateInput);
    if (!cleanDigits || (cleanDigits.length !== 7 && cleanDigits.length !== 8)) {
      setSearchError("נא להזין מספר רישוי תקין להמשך");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      licensePlate: cleanDigits,
    }));
    setActiveStep(1);
  };

  const handleNextStep = () => {
    if (activeStep === 0) {
      const cleanDigits = cleanLicensePlate(plateInput);
      if (!cleanDigits || (cleanDigits.length !== 7 && cleanDigits.length !== 8)) {
        setSearchError("נא להזין מספר רישוי תקין לפני המשך");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        licensePlate: cleanDigits,
      }));
    }
    if (activeStep < 4) {
      setActiveStep((prev) => prev + 1);
    } else {
      onComplete?.(formData);
    }
  };

  return (
    <Stack gap="xl" dir="rtl" maw={1100} mx="auto">
      <Title order={2} ta="center" fw={800}>
        הוספת רכב
      </Title>

      <StepProgress
        activeStep={activeStep}
        steps={stepsList}
        onStepClick={(idx) => setActiveStep(idx)}
      />

      {activeStep === 0 && (
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <Card
            shadow="sm"
            p="xl"
            radius="xl"
            withBorder
            h="100%"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Stack gap="lg" align="center">
              <Stack gap={4} ta="center">
                <Title order={3} fw={800}>
                  הזנת מספר רכב
                </Title>
                <Text size="sm" c="dimmed">
                  הזן מספר רכב ואנחנו נעזור לך למצוא את הפרטים
                </Text>
              </Stack>

              <IsraeliLicensePlate
                value={plateInput}
                onChange={handlePlateChange}
                onSearch={() => handlePlateSearch()}
                placeholder="123·45·678"
                autoFocus
              />

              {searchError && (
                <Alert color="red" radius="md" w="100%">
                  {searchError}
                </Alert>
              )}

              {searchNotice && (
                <Alert color="green" radius="md" w="100%">
                  {searchNotice}
                </Alert>
              )}

              <Button
                size="md"
                radius="md"
                fullWidth
                loading={isSearching}
                onClick={() => handlePlateSearch()}
                leftSection={
                  <i
                    className="ph-bold ph-magnifying-glass"
                    style={{ fontSize: 18 }}
                  />
                }
              >
                חיפוש רכב
              </Button>

              <Divider my="xs" label="או" labelPosition="center" w="100%" />

              <Button
                variant="default"
                radius="md"
                fullWidth
                onClick={handleManualContinue}
                leftSection={
                  <i
                    className="ph-bold ph-pencil-simple"
                    style={{ fontSize: 18 }}
                  />
                }
              >
                הזנה ידנית
              </Button>

              <Text size="xs" c="dimmed" ta="center">
                אם הרכב לא נמצא, אפשר להמשיך להזנה ידנית
              </Text>
            </Stack>
          </Card>

          <StepGuidanceCard
            title="מה קורה אחרי החיפוש?"
            subtitle="נמצא את פרטי הרכב שלך ונמלא עבורך את הפרטים הבסיסיים."
            items={guidanceItemsStep1}
          />
        </SimpleGrid>
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
        <Button size="md" radius="md" onClick={handleNextStep} px="xl">
          המשך
        </Button>
      </Group>
    </Stack>
  );
}
