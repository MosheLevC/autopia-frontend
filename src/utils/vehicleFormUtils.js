export const MIN_VEHICLE_YEAR = 1900;

export const FUEL_TYPE_OPTIONS = [
  "בנזין",
  "סולר",
  "היברידי",
  "חשמלי",
  'גפ"מ',
  "אחר",
];

export const parseInteger = (value) => {
  if (typeof value === "number") {
    return Number.isInteger(value) ? value : null;
  }

  if (typeof value === "string" && value.trim()) {
    const parsedValue = Number(value.replaceAll(",", ""));
    return Number.isInteger(parsedValue) ? parsedValue : null;
  }

  return null;
};

export const isValidDateInput = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  return (
    parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() === month - 1 &&
    parsedDate.getUTCDate() === day
  );
};

export const toDateInputValue = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    const datePrefix = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0];

    if (datePrefix && isValidDateInput(datePrefix)) {
      return datePrefix;
    }
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().slice(0, 10);
};

