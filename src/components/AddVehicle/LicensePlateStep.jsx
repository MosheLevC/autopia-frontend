import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Divider,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import vehicleService from "../../services/vehicleService";
import {
  cleanLicensePlate,
  formatLicensePlate,
} from "../../utils/plateUtils";
import LicensePlate from "../LicensePlate/LicensePlate";
import StepGuidanceCard from "./StepGuidanceCard";

const GUIDANCE_ITEMS = [
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

const getCleanPlateOrError = (plateInput) => {
  const cleanDigits = cleanLicensePlate(plateInput);
  return cleanDigits.length === 7 || cleanDigits.length === 8
    ? cleanDigits
    : null;
};

export default function LicensePlateStep({
  licensePlate,
  onLookupSuccess,
  onLookupNotFound,
  onManualContinue,
}) {
  const [plateInput, setPlateInput] = useState(() =>
    formatLicensePlate(licensePlate),
  );
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchWarning, setSearchWarning] = useState("");
  const [searchNotice, setSearchNotice] = useState("");

  const clearMessages = () => {
    setSearchError("");
    setSearchWarning("");
    setSearchNotice("");
  };

  const handlePlateChange = (event) => {
    setPlateInput(formatLicensePlate(event.target.value));
    clearMessages();
  };

  const handlePlateSearch = async () => {
    const cleanDigits = getCleanPlateOrError(plateInput);
    if (!cleanDigits) {
      setSearchError("נא להזין מספר רישוי תקין (7 או 8 ספרות)");
      return;
    }

    setIsSearching(true);
    clearMessages();

    try {
      const result = await vehicleService.lookupVehicle(cleanDigits);
      if (result.success && result.found && result.vehicle) {
        const vehicle = {
          ...result.vehicle,
          licensePlate: cleanDigits,
        };
        setPlateInput(formatLicensePlate(cleanDigits));
        setSearchNotice(
          `אותר רכב: ${vehicle.manufacturer} ${vehicle.model} (${vehicle.year})`,
        );
        onLookupSuccess(vehicle);
        return;
      }

      setPlateInput(formatLicensePlate(cleanDigits));
      setSearchWarning("הרכב לא נמצא במאגר. ניתן להמשיך להזנה ידנית.");
      onLookupNotFound(cleanDigits);
    } catch (error) {
      setSearchError(
        error.message || "שגיאה בחיפוש מספר הרישוי. ניתן להמשיך ידנית.",
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleManualContinue = () => {
    const cleanDigits = getCleanPlateOrError(plateInput);
    if (!cleanDigits) {
      setSearchError("נא להזין מספר רישוי תקין להמשך");
      return;
    }

    setPlateInput(formatLicensePlate(cleanDigits));
    onManualContinue(cleanDigits);
  };

  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
      <Card
        shadow="sm"
        p={{ base: "md", sm: "xl" }}
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

          <LicensePlate
            value={plateInput}
            onChange={handlePlateChange}
            onSearch={handlePlateSearch}
            placeholder="123·45·678"
            autoFocus
          />

          {searchError && (
            <Alert color="red" radius="md" w="100%">
              {searchError}
            </Alert>
          )}

          {searchWarning && (
            <Alert color="yellow" radius="md" w="100%">
              {searchWarning}
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
            onClick={handlePlateSearch}
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
            size="md"
            radius="md"
            fullWidth
            onClick={handleManualContinue}
            disabled={isSearching}
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
        items={GUIDANCE_ITEMS}
      />
    </SimpleGrid>
  );
}
