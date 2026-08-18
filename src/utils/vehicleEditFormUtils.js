import {
  isValidDateInput,
  MIN_VEHICLE_YEAR,
  parseInteger,
  toDateInputValue,
} from "./vehicleFormUtils";

const EDITABLE_FIELDS = [
  "manufacturer",
  "model",
  "year",
  "fuelType",
  "trimLevel",
  "color",
  "currentMileage",
  "lastServiceDate",
  "serviceIntervalKm",
  "vehicleLicenseValidUntil",
  "insuranceExpiryDate",
];

const DATE_FIELDS = [
  "lastServiceDate",
  "vehicleLicenseValidUntil",
  "insuranceExpiryDate",
];

const trimValue = (value) =>
  typeof value === "string" ? value.trim() : "";

export const createVehicleEditDraft = (vehicle) => ({
  manufacturer: vehicle.manufacturer || "",
  model: vehicle.model || "",
  year: vehicle.year ?? "",
  fuelType: vehicle.fuelType || "",
  trimLevel: vehicle.trimLevel || "",
  color: vehicle.color || "",
  currentMileage: vehicle.currentMileage ?? "",
  lastServiceDate: toDateInputValue(vehicle.lastServiceDate),
  serviceIntervalKm: vehicle.serviceIntervalKm ?? "",
  vehicleLicenseValidUntil: toDateInputValue(
    vehicle.vehicleLicenseValidUntil,
  ),
  insuranceExpiryDate: toDateInputValue(vehicle.insuranceExpiryDate),
});

const normalizeDraft = (draft) => {
  const serviceIntervalValue =
    draft.serviceIntervalKm === "" || draft.serviceIntervalKm == null
      ? null
      : parseInteger(draft.serviceIntervalKm);

  return {
    manufacturer: trimValue(draft.manufacturer),
    model: trimValue(draft.model),
    year: parseInteger(draft.year),
    fuelType: trimValue(draft.fuelType),
    trimLevel: trimValue(draft.trimLevel),
    color: trimValue(draft.color),
    currentMileage: parseInteger(draft.currentMileage),
    lastServiceDate: trimValue(draft.lastServiceDate) || null,
    serviceIntervalKm: serviceIntervalValue,
    vehicleLicenseValidUntil:
      trimValue(draft.vehicleLicenseValidUntil) || null,
    insuranceExpiryDate: trimValue(draft.insuranceExpiryDate) || null,
  };
};

const comparableDraft = (draft) => ({
  manufacturer: trimValue(draft.manufacturer),
  model: trimValue(draft.model),
  year: String(draft.year ?? "").trim(),
  fuelType: trimValue(draft.fuelType),
  trimLevel: trimValue(draft.trimLevel),
  color: trimValue(draft.color),
  currentMileage: String(draft.currentMileage ?? "").replaceAll(",", "").trim(),
  lastServiceDate: trimValue(draft.lastServiceDate),
  serviceIntervalKm: String(draft.serviceIntervalKm ?? "")
    .replaceAll(",", "")
    .trim(),
  vehicleLicenseValidUntil: trimValue(draft.vehicleLicenseValidUntil),
  insuranceExpiryDate: trimValue(draft.insuranceExpiryDate),
});

export const hasVehicleEditChanges = (vehicle, draft) => {
  const initialValues = comparableDraft(createVehicleEditDraft(vehicle));
  const draftValues = comparableDraft(draft);

  return EDITABLE_FIELDS.some(
    (field) => initialValues[field] !== draftValues[field],
  );
};

export const validateVehicleEditDraft = (vehicle, draft) => {
  const values = normalizeDraft(draft);
  const initialValues = normalizeDraft(createVehicleEditDraft(vehicle));
  const errors = {};
  const maximumYear = new Date().getFullYear() + 1;

  if (!values.manufacturer) {
    errors.manufacturer = "נא להזין יצרן";
  }

  if (!values.model) {
    errors.model = "נא להזין דגם";
  }

  if (!values.fuelType) {
    errors.fuelType = "נא להזין סוג דלק";
  }

  if (
    values.year === null ||
    values.year < MIN_VEHICLE_YEAR ||
    values.year > maximumYear
  ) {
    errors.year = "נא להזין שנת ייצור תקינה";
  }

  if (values.currentMileage === null || values.currentMileage < 0) {
    errors.currentMileage = "נא להזין קילומטראז׳ תקין";
  }

  if (
    (draft.serviceIntervalKm !== "" &&
      draft.serviceIntervalKm != null &&
      values.serviceIntervalKm === null) ||
    (values.serviceIntervalKm !== null && values.serviceIntervalKm < 1)
  ) {
    errors.serviceIntervalKm = "נא להזין מרווח טיפולים חיובי";
  }

  for (const field of DATE_FIELDS) {
    if (values[field] !== null && !isValidDateInput(values[field])) {
      errors[field] = "נא להזין תאריך תקין";
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, payload: null };
  }

  const payload = Object.fromEntries(
    EDITABLE_FIELDS.filter(
      (field) => !Object.is(values[field], initialValues[field]),
    ).map((field) => [field, values[field]]),
  );

  return { errors: {}, payload };
};
