import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { ArrowsClockwise, Check, Trash } from "@phosphor-icons/react";
import {
  REMINDER_FREQUENCIES,
  REMINDER_TYPES,
  getReminderTypeInfo,
} from "../constants/reminderConstants";
import AppDateInput from "./AppDateInput";
import VehicleBanner from "./VehicleBanner";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export default function AddReminderForm({
  vehicle,
  initialValues,
  existingTypes = [],
  onSubmit,
  onCancel,
  onDelete,
  isSubmitting = false,
  isDeleting = false,
  isEdit = false,
}) {
  const availableTypes = isEdit
    ? REMINDER_TYPES
    : REMINDER_TYPES.filter((t) => !existingTypes.includes(t.value));

  const getDefaultType = () => {
    if (initialValues?.type) return initialValues.type;
    return availableTypes[0]?.value || "test";
  };

  const [type, setType] = useState(getDefaultType);
  const [title, setTitle] = useState(initialValues?.title || "");
  const [frequency, setFrequency] = useState(
    initialValues?.frequency || "yearly"
  );
  const [dueDate, setDueDate] = useState(() => {
    if (initialValues?.dueDate) {
      return new Date(initialValues.dueDate);
    }
    const defaultType = getDefaultType();
    if (defaultType === "test" && vehicle?.vehicleLicenseValidUntil) {
      return new Date(vehicle.vehicleLicenseValidUntil);
    }
    if (defaultType === "insurance" && vehicle?.insuranceExpiryDate) {
      return new Date(vehicle.insuranceExpiryDate);
    }
    return null;
  });

  const [errors, setErrors] = useState({});
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setType(initialValues.type || "test");
      setTitle(initialValues.title || "");
      setFrequency(initialValues.frequency || "yearly");
      setDueDate(initialValues.dueDate ? new Date(initialValues.dueDate) : null);
    }
  }, [initialValues]);

  const handleTypeSelect = (newType) => {
    setType(newType);
    if (errors.type) setErrors((prev) => ({ ...prev, type: null }));

    if (newType === "insurance") {
      setFrequency("yearly");
    }

    if (!isEdit && !initialValues) {
      if (newType === "test") {
        setDueDate(
          vehicle?.vehicleLicenseValidUntil
            ? new Date(vehicle.vehicleLicenseValidUntil)
            : null
        );
      } else if (newType === "insurance") {
        setDueDate(
          vehicle?.insuranceExpiryDate
            ? new Date(vehicle.insuranceExpiryDate)
            : null
        );
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!type) {
      newErrors.type = "נא לבחור סוג תזכורת";
    }

    if (!dueDate || isNaN(new Date(dueDate).getTime())) {
      newErrors.dueDate = "נא להזין תאריך יעד תקין";
    }

    if (!frequency) {
      newErrors.frequency = "נא לבחור תדירות";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    const payload = {
      type,
      dueDate: new Date(dueDate).toISOString(),
      frequency: type === "insurance" ? "yearly" : frequency,
      title: title.trim() || undefined,
    };

    onSubmit(payload);
  };

  const currentTypeInfo = getReminderTypeInfo(type);

  return (
    <>
      <Card
        withBorder
        radius="xl"
        shadow="xs"
        p={{ base: "md", sm: "xl" }}
        bg="white"
      >
        <form onSubmit={handleSubmit} noValidate>
          <Stack gap="lg">
            <VehicleBanner vehicle={vehicle} />

            <Stack gap="xs">
              <Text size="sm" fw={500}>
                סוג תזכורת <Text component="span" c="red">*</Text>
              </Text>

              {isEdit ? (
                <Group gap="xs">
                  <Badge size="lg" radius="md" variant="light" color="blue">
                    <Group gap={6}>
                      {currentTypeInfo?.icon ? (
                        <currentTypeInfo.icon size={16} aria-hidden="true" />
                      ) : null}
                      <span>{currentTypeInfo.label}</span>
                    </Group>
                  </Badge>
                </Group>
              ) : (
                <Group gap="xs" wrap="wrap">
                  {availableTypes.map((t) => {
                    const isSelected = type === t.value;
                    const TypeIcon = t.icon;
                    return (
                      <Button
                        key={t.value}
                        type="button"
                        variant={isSelected ? "filled" : "default"}
                        radius="md"
                        size="sm"
                        onClick={() => handleTypeSelect(t.value)}
                        leftSection={
                          isSelected ? (
                            <Check size={16} weight="bold" aria-hidden="true" />
                          ) : TypeIcon ? (
                            <TypeIcon size={16} aria-hidden="true" />
                          ) : null
                        }
                      >
                        {t.label}
                      </Button>
                    );
                  })}
                </Group>
              )}

              {errors.type && (
                <Text size="xs" c="red">
                  {errors.type}
                </Text>
              )}
            </Stack>

            <TextInput
              label="כותרת תזכורת (אופציונלי)"
              placeholder={`לדוגמה: ${currentTypeInfo.label}`}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: null }));
                }
              }}
              error={errors.title}
              size="md"
              radius="md"
            />

            <AppDateInput
              label="תאריך יעד לתזכורת"
              description="התאריך שבו יש לבצע את הטסט או לחדש את הביטוח"
              withAsterisk
              value={dueDate}
              onChange={(val) => {
                setDueDate(val);
                if (errors.dueDate) {
                  setErrors((prev) => ({ ...prev, dueDate: null }));
                }
              }}
              error={errors.dueDate}
              size="md"
              radius="md"
            />

            {type === "test" && (
              <Stack gap="xs">
                <Text size="sm" fw={500}>
                  תדירות חידוש <Text component="span" c="red">*</Text>
                </Text>

                <Group gap="xs" wrap="wrap">
                  {REMINDER_FREQUENCIES.map((f) => {
                    const isSelected = frequency === f.value;
                    return (
                      <Button
                        key={f.value}
                        type="button"
                        variant={isSelected ? "filled" : "default"}
                        radius="md"
                        size="sm"
                        onClick={() => {
                          setFrequency(f.value);
                          if (errors.frequency) {
                            setErrors((prev) => ({ ...prev, frequency: null }));
                          }
                        }}
                        leftSection={
                          isSelected ? (
                            <Check size={16} weight="bold" aria-hidden="true" />
                          ) : (
                            <ArrowsClockwise size={16} aria-hidden="true" />
                          )
                        }
                      >
                        {f.label}
                      </Button>
                    );
                  })}
                </Group>

                {errors.frequency && (
                  <Text size="xs" c="red">
                    {errors.frequency}
                  </Text>
                )}
              </Stack>
            )}

            <Stack gap="xs" mt="md">
              <Button
                type="submit"
                size="lg"
                radius="lg"
                h={50}
                fw={700}
                loading={isSubmitting}
                disabled={isDeleting}
                shadow="sm"
              >
                {isEdit ? "שמירת שינויים" : "שמירת תזכורת"}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                radius="lg"
                h={50}
                onClick={onCancel}
                disabled={isSubmitting || isDeleting}
              >
                ביטול
              </Button>

              {isEdit && onDelete && (
                <Button
                  type="button"
                  variant="light"
                  color="red"
                  size="lg"
                  radius="lg"
                  h={50}
                  onClick={() => setDeleteModalOpened(true)}
                  leftSection={<Trash size={18} aria-hidden="true" />}
                  disabled={isSubmitting || isDeleting}
                >
                  מחיקת תזכורת
                </Button>
              )}
            </Stack>
          </Stack>
        </form>
      </Card>

      {isEdit && onDelete && (
        <ConfirmDeleteModal
          opened={deleteModalOpened}
          onClose={() => setDeleteModalOpened(false)}
          onConfirm={onDelete}
          title="מחיקת תזכורת"
          message={`האם אתה בטוח שברצונך למחוק את תזכורת ה${initialValues?.title || currentTypeInfo?.label || "תזכורת"}?`}
          description="פעולה זו הינה בלתי הפיכה והתזכורת תוסר מרשימת התזכורות של הרכב."
          confirmLabel="אישור ומחיקה"
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}
