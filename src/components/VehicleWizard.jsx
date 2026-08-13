import { useState } from "react";
import { Alert, Box, Button, Card, Divider, Group, Stack, Text, Title } from "@mantine/core";
import StepProgress from "./AddVehicle/StepProgress";
import IsraeliLicensePlate from "./AddVehicle/IsraeliLicensePlate";
import StepGuidanceCard from "./AddVehicle/StepGuidanceCard";
import {
  formatPlateNumber,
  cleanPlateNumber,
  fetchVehicleDetailsByPlate,
} from "../services/licensePlateService";

export default function VehicleWizard({ onComplete, onCancel }) {
  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState({
    plateNumber: "",
    make: "",
    model: "",
    year: 2021,
    color: "לבן",
    fuelType: "בנזין",
    mileage: 124350,
    manualFile: null,
    manualFileName: "",
    lastServiceDate: "",
    lastServiceMileage: 0,
    serviceInterval: 'כל 15,000 ק"מ',
    testExpiryDate: "",
    insuranceExpiryDate: "01.05.2026",
  });

  const [plateInput, setPlateInput] = useState("123·45·678");
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
    const formatted = formatPlateNumber(e.target.value);
    setPlateInput(formatted);
    setSearchError("");
    setSearchNotice("");
  };

  const handlePlateSearch = async (targetPlate = plateInput) => {
    const cleanDigits = cleanPlateNumber(targetPlate);
    if (!cleanDigits || (cleanDigits.length !== 7 && cleanDigits.length !== 8)) {
      setSearchError("נא להזין מספר רישוי תקין (7 או 8 ספרות)");
      return;
    }

    setIsSearching(true);
    setSearchError("");
    setSearchNotice("");

    try {
      const result = await fetchVehicleDetailsByPlate(targetPlate);
      if (result.success && result.found) {
        setFormData((prev) => ({
          ...prev,
          plateNumber: cleanDigits,
          make: result.data.make || prev.make,
          model: result.data.model || prev.model,
          year: result.data.year || prev.year,
          color: result.data.color || prev.color,
          fuelType: result.data.fuelType || prev.fuelType,
          mileage: result.data.mileage || prev.mileage,
          testExpiryDate: result.data.testExpiryDate || prev.testExpiryDate,
        }));
        setSearchNotice(`אותר רכב: ${result.data.make} ${result.data.model} (${result.data.year})`);
      } else {
        setFormData((prev) => ({
          ...prev,
          plateNumber: cleanDigits,
        }));
        setSearchNotice("לא נשלפו נתונים אוטומטיים. ניתן להמשיך למילוי ידני.");
      }
    } catch {
      setSearchError("שגיאה בחיפוש מספר הרישוי. ניתן להמשיך ידנית.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleManualContinue = () => {
    const cleanDigits = cleanPlateNumber(plateInput);
    if (!cleanDigits || (cleanDigits.length !== 7 && cleanDigits.length !== 8)) {
      setSearchError("נא להזין מספר רישוי תקין להמשך");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      plateNumber: cleanDigits,
    }));
    setActiveStep(1);
  };

  const handleNextStep = () => {
    if (activeStep === 0) {
      const cleanDigits = cleanPlateNumber(plateInput);
      if (!cleanDigits || (cleanDigits.length !== 7 && cleanDigits.length !== 8)) {
        setSearchError("נא להזין מספר רישוי תקין לפני המשך");
        return;
      }
      setFormData((prev) => ({ ...prev, plateNumber: cleanDigits }));
    }
    if (activeStep < 4) {
      setActiveStep((prev) => prev + 1);
    } else {
      onComplete?.(formData);
    }
  };

  return (
    <Stack spacing="xl" dir="rtl" style={{ maxWidth: 1100, margin: "0 auto" }}>
      <Title
        order={2}
        align="center"
        style={{
          fontSize: "1.75rem",
          fontWeight: 800,
          color: "#0f172a",
          fontFamily: "var(--font-hebrew)",
        }}
      >
        הוספת רכב
      </Title>

      <StepProgress activeStep={activeStep} steps={stepsList} onStepClick={(idx) => setActiveStep(idx)} />

      {activeStep === 0 && (
        <Box
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
            alignItems: "stretch",
          }}
        >
          <Card
            shadow="sm"
            padding="xl"
            radius="xl"
            withBorder
            style={{
              backgroundColor: "#ffffff",
              borderColor: "#e2e8f0",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Stack spacing="lg" align="center">
              <div style={{ textAlign: "center" }}>
                <Title
                  order={3}
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    color: "#0f172a",
                    fontFamily: "var(--font-hebrew)",
                  }}
                >
                  הזנת מספר רכב
                </Title>
                <Text size="sm" c="dimmed" mt={4} style={{ fontFamily: "var(--font-hebrew)" }}>
                  הזן מספר רכב ואנחנו נעזור לך למצוא את הפרטים
                </Text>
              </div>

              <IsraeliLicensePlate
                value={plateInput}
                onChange={handlePlateChange}
                placeholder="123·45·678"
                autoFocus
              />

              {searchError && (
                <Alert color="red" radius="md" style={{ width: "100%" }}>
                  {searchError}
                </Alert>
              )}

              {searchNotice && (
                <Alert color="green" radius="md" style={{ width: "100%" }}>
                  {searchNotice}
                </Alert>
              )}

              <Button
                size="md"
                color="blue"
                radius="md"
                fullWidth
                loading={isSearching}
                onClick={() => handlePlateSearch()}
                leftSection={<i className="ph-bold ph-magnifying-glass" style={{ fontSize: 18 }} />}
                style={{
                  backgroundColor: "#2563eb",
                  height: 48,
                  fontSize: "1rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-hebrew)",
                }}
              >
                חיפוש רכב
              </Button>

              <div style={{ width: "100%" }}>
                <Divider my="xs" label="או" labelPosition="center" />
              </div>

              <Button
                variant="outline"
                color="blue"
                radius="md"
                fullWidth
                onClick={handleManualContinue}
                leftSection={<i className="ph-bold ph-pencil-simple" style={{ fontSize: 18 }} />}
                style={{
                  height: 46,
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  borderColor: "#2563eb",
                  color: "#2563eb",
                  fontFamily: "var(--font-hebrew)",
                }}
              >
                הזנה ידנית
              </Button>

              <Text size="xs" c="dimmed" align="center" style={{ fontFamily: "var(--font-hebrew)" }}>
                אם הרכב לא נמצא, אפשר להמשיך להזנה ידנית
              </Text>
            </Stack>
          </Card>

          <StepGuidanceCard
            title="מה קורה אחרי החיפוש?"
            subtitle="נמצא את פרטי הרכב שלך ונמלא עבורך את הפרטים הבסיסיים."
            items={guidanceItemsStep1}
          />
        </Box>
      )}

      {activeStep > 0 && (
        <Card shadow="sm" padding="xl" radius="xl" withBorder style={{ backgroundColor: "#ffffff" }}>
          <Stack align="center" py="xl">
            <Title order={3} style={{ fontFamily: "var(--font-hebrew)" }}>
              שלב {activeStep + 1} בפיתוח...
            </Title>
            <Text c="dimmed" style={{ fontFamily: "var(--font-hebrew)" }}>
              מספר הרישוי שנבחר: {formatPlateNumber(formData.plateNumber)} ({formData.plateNumber})
            </Text>
            <Button variant="light" onClick={() => setActiveStep(0)}>
              חזור לשלב 1
            </Button>
          </Stack>
        </Card>
      )}

      <Box style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        <Group spacing="md">
          <Button
            variant="outline"
            color="blue"
            radius="md"
            onClick={onCancel}
            style={{
              height: 46,
              padding: "0 28px",
              borderColor: "#cbd5e1",
              color: "#2563eb",
              fontFamily: "var(--font-hebrew)",
            }}
          >
            ביטול
          </Button>
          <Button
            size="md"
            color="blue"
            radius="md"
            onClick={handleNextStep}
            style={{
              backgroundColor: "#2563eb",
              height: 46,
              padding: "0 36px",
              fontWeight: 700,
              fontFamily: "var(--font-hebrew)",
            }}
          >
            המשך
          </Button>
        </Group>
      </Box>
    </Stack>
  );
}
