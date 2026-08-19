import { useState } from "react";
import {
  Button,
  Card,
  Group,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { MAINTENANCE_TYPES } from "../constants/maintenanceConstants";
import MaintenanceVehicleBanner from "./AddMaintenance/MaintenanceVehicleBanner";
import MaintenancePartsPicker from "./AddMaintenance/MaintenancePartsPicker";

export default function AddMaintenanceForm({
  vehicle,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const [title, setTitle] = useState("");
  const [maintenanceDate, setMaintenanceDate] = useState(() => new Date());
  const [type, setType] = useState("periodic");
  const [selectedParts, setSelectedParts] = useState([]);
  const [mileage, setMileage] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  const handleTogglePart = (partValue) => {
    setSelectedParts((prev) => {
      const next = prev.includes(partValue)
        ? prev.filter((p) => p !== partValue)
        : [...prev, partValue];
      if (next.length > 0 && errors.parts) {
        setErrors((current) => ({ ...current, parts: null }));
      }
      return next;
    });
  };

  const handleModalPartsChange = (newValues) => {
    setSelectedParts(newValues);
    if (newValues.length > 0 && errors.parts) {
      setErrors((current) => ({ ...current, parts: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "נא להזין כותרת לטיפול";
    }

    if (!maintenanceDate) {
      newErrors.maintenanceDate = "נא להזין תאריך טיפול";
    } else {
      const selected = new Date(maintenanceDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (selected > today) {
        newErrors.maintenanceDate = "תאריך הטיפול לא יכול להיות בעתיד";
      }
    }

    if (!type) {
      newErrors.type = "נא לבחור סוג טיפול";
    }

    if (!selectedParts || selectedParts.length === 0) {
      newErrors.parts = "נא לבחור לפחות חלק חילוף אחד";
    }

    if (
      totalCost === null ||
      totalCost === undefined ||
      totalCost === "" ||
      Number(totalCost) < 0
    ) {
      newErrors.totalCost = "נא להזין עלות טיפול (0 ומעלה)";
    }

    if (mileage !== "" && mileage !== null && mileage < 0) {
      newErrors.mileage = "קילומטראז' אינו יכול להיות שלילי";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    const payload = {
      title: title.trim(),
      maintenanceDate: new Date(maintenanceDate).toISOString(),
      type,
      totalCost: Number(totalCost) || 0,
      description: description.trim() || undefined,
      parts: selectedParts.length > 0 ? selectedParts : undefined,
    };

    if (mileage !== "" && mileage !== null && mileage !== undefined) {
      payload.mileageAtMaintenance = Number(mileage);
    }

    onSubmit(payload);
  };

  return (
    <Card withBorder radius="xl" shadow="xs" p={{ base: "md", sm: "xl" }} bg="white">
      <form onSubmit={handleSubmit} noValidate>
        <Stack gap="lg">
          <MaintenanceVehicleBanner vehicle={vehicle} />

          <TextInput
            label="כותרת הטיפול"
            placeholder="לדוגמה: החלפת שמן ופילטרים"
            withAsterisk
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
            }}
            error={errors.title}
            size="md"
            radius="md"
          />

            <DateInput
              label="תאריך"
              placeholder="DD/MM/YYYY"
              valueFormat="DD/MM/YYYY"
              withAsterisk
              value={maintenanceDate}
              onChange={(val) => {
                setMaintenanceDate(val);
                if (errors.maintenanceDate) {
                  setErrors((prev) => ({ ...prev, maintenanceDate: null }));
                }
              }}
              maxDate={new Date()}
              firstDayOfWeek={0}
              weekendDays={[5, 6]}
              error={errors.maintenanceDate}
              leftSection={<i className="ph-calendar" aria-hidden="true" />}
              leftSectionPointerEvents="none"
              size="md"
              radius="md"
              locale="he"
              styles={{ weekday: { textAlign: "center" } }}
            />

          <Stack gap="xs">
            <Text size="sm" fw={500}>
              סוג טיפול <Text component="span" c="red">*</Text>
            </Text>
            <Group gap="xs" wrap="wrap">
              {MAINTENANCE_TYPES.map((t) => {
                const isSelected = type === t.value;
                return (
                  <Button
                    key={t.value}
                    type="button"
                    variant={isSelected ? "filled" : "default"}
                    radius="md"
                    size="sm"
                    onClick={() => {
                      setType(t.value);
                      if (errors.type) setErrors((prev) => ({ ...prev, type: null }));
                    }}
                    leftSection={
                      isSelected ? (
                        <i className="ph-check" aria-hidden="true" />
                      ) : undefined
                    }
                  >
                    {t.label}
                  </Button>
                );
              })}
            </Group>
            {errors.type && (
              <Text size="xs" c="red">
                {errors.type}
              </Text>
            )}
          </Stack>

          <MaintenancePartsPicker
            selectedParts={selectedParts}
            onTogglePart={handleTogglePart}
            onModalPartsChange={handleModalPartsChange}
            error={errors.parts}
          />

          <NumberInput
            label="קילומטראז'"
            placeholder={
              vehicle?.currentMileage
                ? `נוכחי: ${Number(vehicle.currentMileage).toLocaleString("he-IL")}`
                : "לדוגמה: 124,350"
            }
            value={mileage}
            onChange={(val) => {
              setMileage(val);
              if (errors.mileage) setErrors((prev) => ({ ...prev, mileage: null }));
            }}
            error={errors.mileage}
            leftSection={<i className="ph-gauge" aria-hidden="true" />}
            suffix=" ק״מ"
            thousandSeparator=","
            allowDecimal={false}
            allowNegative={false}
            clampBehavior="none"
            hideControls
            inputMode="numeric"
            size="md"
            radius="md"
          />

          <NumberInput
            label="עלות הטיפול"
            withAsterisk
            value={totalCost}
            onChange={(val) => {
              setTotalCost(val);
              if (errors.totalCost) setErrors((prev) => ({ ...prev, totalCost: null }));
            }}
            error={errors.totalCost}
            leftSection={<Text fw={700} size="sm" c="dimmed">₪</Text>}
            thousandSeparator=","
            min={0}
            allowNegative={false}
            clampBehavior="strict"
            hideControls
            inputMode="numeric"
            size="md"
            radius="md"
          />

          <Textarea
            label="תיאור"
            placeholder="הוסף תיאור..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            minRows={3}
            autosize
            size="md"
            radius="md"
          />

          <Stack gap="xs" mt="md">
            <Button
              type="submit"
              size="lg"
              radius="lg"
              h={50}
              fw={700}
              loading={isSubmitting}
              shadow="sm"
            >
              שמירת טיפול
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              radius="lg"
              h={50}
              onClick={onCancel}
              disabled={isSubmitting}
            >
              ביטול
            </Button>
          </Stack>
        </Stack>
      </form>
    </Card>
  );
}
