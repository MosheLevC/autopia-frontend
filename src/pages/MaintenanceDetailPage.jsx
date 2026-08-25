import { useEffect, useState } from "react";
import { Alert, Container, Stack } from "@mantine/core";
import { useNavigate, useParams } from "react-router";
import { observer } from "mobx-react-lite";
import { Car, Plus, WarningCircle } from "@phosphor-icons/react";
import { useHeaderTitle } from "../hooks/useHeader";
import { useCurrentVehicle } from "../hooks/useCurrentVehicle";
import { useMaintenanceStore } from "../stores";

import AddMaintenanceForm from "../components/AddMaintenanceForm";
import MaintenanceDetailView from "../components/MaintenanceDetail/MaintenanceDetailView";
import NoVehicleSelected from "../components/NoVehicleSelected";
import PageLoading from "../components/common/PageLoading";
import NotFoundCard from "../components/common/NotFoundCard";

const MaintenanceDetailPage = observer(function MaintenanceDetailPage() {
  const navigate = useNavigate();
  const { maintenanceId } = useParams();
  const { vehicle, vehicleId, isVehicleLoading, hasNoVehicle, vehicleStore } =
    useCurrentVehicle();
  const maintenanceStore = useMaintenanceStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pageError, setPageError] = useState(null);

  useHeaderTitle(isEditing ? "עריכת טיפול" : "פרטי טיפול");

  useEffect(() => {
    if (vehicleId && maintenanceId) {
      maintenanceStore
        .fetchMaintenanceById(vehicleId, maintenanceId)
        .catch((err) => {
          setPageError(err.message || "שגיאה בטעינת פרטי הטיפול");
        });
    }
  }, [vehicleId, maintenanceId, maintenanceStore]);

  const handleBack = () => {
    if (vehicleId) {
      navigate(`/vehicles/${vehicleId}/maintenances`);
    } else {
      navigate("/maintenances");
    }
  };

  if (isVehicleLoading) {
    return <PageLoading message="טוען את פרטי הרכב..." height={320} />;
  }

  if (hasNoVehicle) {
    return (
      <NoVehicleSelected
        title="עדיין לא הוספת רכב"
        description="לא ניתן להציג את פרטי הטיפול מכיוון שעדיין לא הוספת רכב."
        icon={Car}
        actionLabel="הוספת רכב"
        actionPath="/vehicles/add"
        actionIcon={Plus}
      />
    );
  }

  const maintenance =
    maintenanceStore.activeMaintenance?._id === maintenanceId
      ? maintenanceStore.activeMaintenance
      : maintenanceStore.maintenances.find((m) => m._id === maintenanceId);

  if (maintenanceStore.isLoading && !maintenance) {
    return <PageLoading message="טוען את פרטי הטיפול..." height={320} />;
  }

  if (!maintenanceStore.isLoading && !maintenance) {
    return (
      <Container size="sm" py="xl">
        <NotFoundCard
          title="טיפול לא נמצא"
          description="פרטי הטיפול המבוקש אינם קיימים או שנמחקו."
          backLabel="חזרה ליומן הטיפולים"
          onBack={handleBack}
        />
      </Container>
    );
  }

  const handleUpdate = async (payload) => {
    setIsSubmitting(true);
    setPageError(null);

    try {
      const result = await maintenanceStore.updateMaintenance(
        vehicleId,
        maintenanceId,
        payload
      );

      if (result?.vehicle) {
        vehicleStore.updateVehicleLocally(result.vehicle);
      }

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
      await maintenanceStore.deleteMaintenance(
        vehicleId,
        maintenanceId
      );
      navigate(`/vehicles/${vehicleId}/maintenances`);
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
            icon={<WarningCircle size={20} aria-hidden="true" />}
          >
            {pageError}
          </Alert>
        )}

        {isEditing ? (
          <AddMaintenanceForm
            vehicle={vehicle}
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
            vehicle={vehicle}
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
