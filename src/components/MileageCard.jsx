import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { useVehicleStore } from "../stores/VehicleStoreContext";
import MileageUpdateModal from "./MileageUpdateModal";

const MOCK_SAVE_DELAY_MS = 700;

const formatMileage = (value) => Number(value).toLocaleString("he-IL");

const MileageCard = observer(function MileageCard() {
  const { activeVehicle } = useVehicleStore();
  const [modalOpened, setModalOpened] = useState(false);
  const [previewMileageByVehicle, setPreviewMileageByVehicle] = useState({});
  const [successVehicleId, setSuccessVehicleId] = useState(null);

  if (!activeVehicle) {
    return null;
  }

  const storedMileage = Number(activeVehicle.currentMileage) || 0;
  const displayedMileage = Object.hasOwn(
    previewMileageByVehicle,
    activeVehicle._id,
  )
    ? previewMileageByVehicle[activeVehicle._id]
    : storedMileage;
  const showSuccess = successVehicleId === activeVehicle._id;

  const handleOpen = () => {
    setSuccessVehicleId(null);
    setModalOpened(true);
  };

  const handleMockSubmit = async (newMileage) => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_SAVE_DELAY_MS));
    setPreviewMileageByVehicle((current) => ({
      ...current,
      [activeVehicle._id]: newMileage,
    }));
    setSuccessVehicleId(activeVehicle._id);
  };

  return (
    <>
      <Card
        component="section"
        aria-labelledby="mileage-card-title"
        withBorder
        radius="xl"
        shadow="sm"
        p={{ base: "md", sm: "xl" }}
      >
        <Group
          justify="space-between"
          align={{ base: "flex-start", sm: "center" }}
          gap="md"
          wrap="wrap"
        >
          <Stack gap={4}>
            <Title id="mileage-card-title" order={2} size="h3">
              קילומטראז&apos; נוכחי
            </Title>
            <Text fw={800} size="xl" dir="ltr">
              {formatMileage(displayedMileage)} ק״מ
            </Text>
            {showSuccess && (
              <Group gap={6} c="green.7">
                <i className="ph-bold ph-check-circle" aria-hidden="true" />
                <Text size="sm" fw={600}>
                  הקילומטראז&apos; עודכן בהצלחה
                </Text>
              </Group>
            )}
          </Stack>

          <Button
            variant="light"
            onClick={handleOpen}
            leftSection={
              <i className="ph-bold ph-gauge" aria-hidden="true" />
            }
          >
            עדכון קילומטראז&apos;
          </Button>
        </Group>
      </Card>

      <MileageUpdateModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        currentMileage={displayedMileage}
        onSubmit={handleMockSubmit}
      />
    </>
  );
});

export default MileageCard;
