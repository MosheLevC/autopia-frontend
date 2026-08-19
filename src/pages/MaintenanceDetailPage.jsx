import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Center,
  Container,
  Loader,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router";
import { observer } from "mobx-react-lite";
import { useHeaderTitle } from "../context/HeaderContext";
import { useVehicleStore } from "../stores/VehicleStoreContext";
import { useMaintenanceStore } from "../stores/MaintenanceStoreContext";
import AddMaintenanceForm from "../components/AddMaintenanceForm";
import MaintenanceDetailView from "../components/MaintenanceDetail/MaintenanceDetailView";
import NoVehicleSelected from "../components/NoVehicleSelected";

const MaintenanceDetailPage = observer(function MaintenanceDetailPage() {
  const navigate = useNavigate();
  const { vehicleId, maintenanceId } = useParams();
  const vehicleStore = useVehicleStore();
  const maintenanceStore = useMaintenanceStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pageError, setPageError] = useState(null);

  useHeaderTitle(isEditing ? "עריכת טיפול" : "פרטי טיפול");

  const currentVehicle = vehicleId
    ? vehicleStore.vehicles.find((v) => v._id === vehicleId)
    : vehicleStore.activeVehicle;

  const currentVehicleId = currentVehicle?._id || vehicleId;

  useEffect(() => {
    if (currentVehicleId && maintenanceId) {
      maintenanceStore
        .fetchMaintenanceById(currentVehicleId, maintenanceId)
        .catch((err) => {
          setPageError(err.message || "שגיאה בטעינת פרטי הטיפול");
        });
    }
  }, [currentVehicleId, maintenanceId, maintenanceStore]);

  const handleBack = () => {
    if (currentVehicleId) {
      navigate(`/vehicles/${currentVehicleId}/maintenances`);
    } else {
      navigate("/maintenances");
    }
  };

  if (vehicleStore.isLoading && vehicleStore.vehicles.length === 0) {
    return (
      <Center h={320}>
        <Stack align="center" gap="sm">
          <Loader size="lg" />
          <Text size="sm" c="dimmed">
            טוען את פרטי הרכב...
          </Text>
        </Stack>
      </Center>
    );
  }

  if (!currentVehicle) {
    return (
      <NoVehicleSelected
        title="לא נבחר רכב"
        description="לא ניתן להציג את פרטי הטיפול מכיוון שלא נבחר רכב."
        icon="ph-wrench"
      />
    );
  }

  const maintenance =
    maintenanceStore.activeMaintenance?._id === maintenanceId
      ? maintenanceStore.activeMaintenance
      : maintenanceStore.maintenances.find((m) => m._id === maintenanceId);

  if (maintenanceStore.isLoading && !maintenance) {
    return (
      <Center h={320}>
        <Stack align="center" gap="sm">
          <Loader size="lg" />
          <Text size="sm" c="dimmed">
            טוען את פרטי הטיפול...
          </Text>
        </Stack>
      </Center>
    );
  }

  if (!maintenanceStore.isLoading && !maintenance) {
    return (
      <Container size="sm" py="xl">
        <Card withBorder radius="xl" shadow="xs" p="xl" bg="white" ta="center">
          <Stack align="center" gap="md" py="lg">
            <ThemeIcon size={64} radius="xl" variant="light" color="red">
              <i className="ph-warning-circle" style={{ fontSize: "2rem" }} aria-hidden="true" />
            </ThemeIcon>
            <Stack gap={4} align="center">
              <Title order={4} fw={700}>
                טיפול לא נמצא
              </Title>
              <Text size="sm" c="dimmed" maw={360}>
                פרטי הטיפול המבוקש אינם קיימים או שנמחקו.
              </Text>
            </Stack>
            <Button
              variant="light"
              onClick={handleBack}
              leftSection={<i className="ph-arrow-right" aria-hidden="true" />}
            >
              חזרה ליומן הטיפולים
            </Button>
          </Stack>
        </Card>
      </Container>
    );
  }

  const handleUpdate = async (payload) => {
    setIsSubmitting(true);
    setPageError(null);

    try {
      await maintenanceStore.updateMaintenance(currentVehicleId, maintenanceId, payload);

      const vehicleUpdates = {};
      if (
        payload.mileageAtMaintenance !== undefined &&
        Number(payload.mileageAtMaintenance) > Number(currentVehicle.currentMileage || 0)
      ) {
        vehicleUpdates.currentMileage = Number(payload.mileageAtMaintenance);
      }

      if (
        payload.maintenanceDate &&
        (!currentVehicle.lastMaintenanceDate ||
          new Date(payload.maintenanceDate) >= new Date(currentVehicle.lastMaintenanceDate))
      ) {
        vehicleUpdates.lastMaintenanceDate = payload.maintenanceDate;
      }

      if (Object.keys(vehicleUpdates).length > 0) {
        await vehicleStore.updateVehicle(currentVehicleId, vehicleUpdates).catch(() => {});
      }

      await maintenanceStore.fetchMaintenanceById(currentVehicleId, maintenanceId);
      setIsEditing(false);
    } catch (err) {
      setPageError(err.message || "שגיאה בעדכון הטיפול. נא לנסות שוב.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setPageError(null);

    try {
      await maintenanceStore.deleteMaintenance(currentVehicleId, maintenanceId);
      navigate(`/vehicles/${currentVehicleId}/maintenances`);
    } catch (err) {
      setPageError(err.message || "שגיאה במחיקת הטיפול. נא לנסות שוב.");
      setIsDeleting(false);
    }
  };

  return (
    <Container size="sm" py="md">
      <Stack gap="md">
        {pageError && (
          <Alert
            color="red"
            variant="light"
            radius="md"
            title="שגיאה"
            icon={<i className="ph-warning-circle" aria-hidden="true" />}
          >
            {pageError}
          </Alert>
        )}

        {isEditing ? (
          <AddMaintenanceForm
            vehicle={currentVehicle}
            initialValues={maintenance}
            isEdit={true}
            onSubmit={handleUpdate}
            onCancel={() => {
              setPageError(null);
              setIsEditing(false);
            }}
            onDelete={handleDelete}
            isSubmitting={isSubmitting}
            isDeleting={isDeleting}
          />
        ) : (
          <MaintenanceDetailView
            maintenance={maintenance}
            vehicle={currentVehicle}
            onEdit={() => {
              setPageError(null);
              setIsEditing(true);
            }}
            onBack={handleBack}
          />
        )}
      </Stack>
    </Container>
  );
});

export default MaintenanceDetailPage;

