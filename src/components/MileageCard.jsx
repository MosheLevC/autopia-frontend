import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { useVehicleStore } from "../stores/VehicleStoreContext";
import MileageUpdateModal from "./MileageUpdateModal";

const formatMileage = (value) => Number(value).toLocaleString("he-IL");

const MileageCard = observer(function MileageCard() {
  const vehicleStore = useVehicleStore();
  const { activeVehicle } = vehicleStore;
  const [modalOpened, setModalOpened] = useState(false);
  const [successVehicleId, setSuccessVehicleId] = useState(null);

  if (!activeVehicle) {
    return null;
  }

  const currentMileage = Number(activeVehicle.currentMileage) || 0;
  const showSuccess = successVehicleId === activeVehicle._id;

  const handleOpen = () => {
    setSuccessVehicleId(null);
    setModalOpened(true);
  };

  const handleSubmit = async (newMileage) => {
    const vehicleId = activeVehicle._id;
    await vehicleStore.updateVehicle(vehicleId, {
      currentMileage: newMileage,
    });
    setSuccessVehicleId(vehicleId);
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
              {formatMileage(currentMileage)} ק״מ
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
        currentMileage={currentMileage}
        onSubmit={handleSubmit}
      />
    </>
  );
});

export default MileageCard;
