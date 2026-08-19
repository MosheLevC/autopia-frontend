import { useState } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Flex,
  Group,
  Modal,
  MultiSelect,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  ALL_MAINTENANCE_PARTS,
  getPartLabel,
  MAINTENANCE_TYPES,
  QUICK_PARTS,
} from "../constants/maintenanceConstants";
import { formatLicensePlate } from "../utils/plateUtils";
import { getVehicleBackground } from "../utils/vehicleBackground";

const filterParts = ({ options, search }) => {
  const query = search.toLowerCase().trim();
  if (!query) return options;

  const filtered = options.filter((option) =>
    option.label.toLowerCase().includes(query),
  );

  if (filtered.length === 0) {
    const otherOption = options.find((o) => o.value === "other");
    return otherOption ? [otherOption] : [];
  }

  return filtered;
};

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
  const [partsModalOpened, setPartsModalOpened] = useState(false);

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

  const quickPartValues = new Set(QUICK_PARTS.map((p) => p.value));
  const extraSelectedParts = selectedParts.filter(
    (p) => !quickPartValues.has(p),
  );

  const manufacturer = vehicle?.manufacturer || vehicle?.make || "";
  const model = vehicle?.model || "";
  const formattedPlate = vehicle?.licensePlate
    ? formatLicensePlate(vehicle.licensePlate)
    : "";
  const vehicleBackground = getVehicleBackground(vehicle?.color);

  return (
    <>
      <Card withBorder radius="xl" shadow="xs" p={{ base: "md", sm: "xl" }} bg="white">
        <form onSubmit={handleSubmit} noValidate>
          <Stack gap="lg">
            {vehicle && (
              <Card
                withBorder
                radius="lg"
                p={0}
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.72) 42%, rgba(255, 255, 255, 0.18) 72%, transparent 88%), url("${vehicleBackground}")`,
                  backgroundPosition: "right 62%",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  overflow: "hidden",
                }}
              >
                <Flex dir="ltr" mih={{ base: 110, sm: 120 }}>
                  <Stack
                    dir="rtl"
                    gap={4}
                    align="flex-start"
                    justify="center"
                    p={{ base: "sm", sm: "md" }}
                  >
                    {manufacturer && (
                      <Text size="xs" c="dimmed" fw={600} lh={1.1}>
                        {manufacturer}
                      </Text>
                    )}
                    {model && (
                      <Text size="md" fw={800} c="gray.9" lh={1.2}>
                        {model}
                      </Text>
                    )}
                    {formattedPlate && (
                      <Text
                        dir="ltr"
                        fw={700}
                        c="dark.8"
                        bg="#ffd43b"
                        px={8}
                        py={2}
                        fz="xs"
                        mt={2}
                        style={{
                          border: "1.5px solid var(--mantine-color-dark-8)",
                          borderRadius: "var(--mantine-radius-xs)",
                          boxShadow: "var(--mantine-shadow-xs)",
                          letterSpacing: "0.08em",
                          display: "inline-flex",
                        }}
                      >
                        {formattedPlate}
                      </Text>
                    )}
                  </Stack>
                </Flex>
              </Card>
            )}

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
              error={errors.maintenanceDate}
              leftSection={<i className="ph-calendar" aria-hidden="true" />}
              leftSectionPointerEvents="none"
              size="md"
              radius="md"
              locale="he"
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

            <Stack gap="xs">
              <Group gap={6} align="center">
                <Text size="sm" fw={500}>
                  חלקי חילוף <Text component="span" c="red">*</Text>
                </Text>
                <Tooltip label="בחר את החלקים שהוחלפו או טופלו" position="top" withArrow>
                  <ActionIcon variant="transparent" size="xs" color="gray" aria-label="מידע">
                    <i className="ph-info" style={{ fontSize: "1rem" }} aria-hidden="true" />
                  </ActionIcon>
                </Tooltip>
              </Group>

              <Group gap="xs" wrap="wrap">
                {QUICK_PARTS.map((part) => {
                  const isSelected = selectedParts.includes(part.value);
                  return (
                    <Button
                      key={part.value}
                      type="button"
                      variant={isSelected ? "light" : "default"}
                      radius="md"
                      size="sm"
                      onClick={() => handleTogglePart(part.value)}
                      leftSection={
                        isSelected ? (
                          <i className="ph-check" aria-hidden="true" />
                        ) : undefined
                      }
                    >
                      {part.label}
                    </Button>
                  );
                })}

                {extraSelectedParts.map((partValue) => (
                  <Badge
                    key={partValue}
                    size="lg"
                    radius="md"
                    variant="light"
                    h={36}
                    px="sm"
                    rightSection={
                      <ActionIcon
                        size="xs"
                        variant="transparent"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePart(partValue);
                        }}
                        aria-label="הסר חלק"
                      >
                        <i className="ph-x" aria-hidden="true" />
                      </ActionIcon>
                    }
                  >
                    {getPartLabel(partValue)}
                  </Badge>
                ))}

                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  radius="md"
                  onClick={() => setPartsModalOpened(true)}
                  leftSection={<i className="ph-plus" aria-hidden="true" />}
                >
                  חלקים נוספים
                </Button>
              </Group>
              {errors.parts && (
                <Text size="xs" c="red">
                  {errors.parts}
                </Text>
              )}
            </Stack>

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

      <Modal
        opened={partsModalOpened}
        onClose={() => setPartsModalOpened(false)}
        title="בחירת חלקי חילוף"
        centered
        radius="lg"
        size="md"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            בחר חלקי חילוף שהוחלפו או טופלו מתוך הרשימה המלאה:
          </Text>
          <MultiSelect
            data={ALL_MAINTENANCE_PARTS}
            value={selectedParts}
            onChange={handleModalPartsChange}
            filter={filterParts}
            placeholder="חפש ובחר חלקי חילוף..."
            searchable
            clearable
            size="md"
            radius="md"
          />
          <Group justify="flex-end" mt="md">
            <Button onClick={() => setPartsModalOpened(false)}>
              אישור
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
