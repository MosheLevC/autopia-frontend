const ADDITIONAL_DETAIL_DEFINITIONS = [
  {
    key: "roadRegistrationMonth",
    rawKey: "moed_aliya_lakvish",
    label: "מועד עלייה לכביש",
    format: formatYearMonth,
  },
  {
    key: "frontTireSize",
    rawKey: "zmig_kidmi",
    label: "מידת צמיג קדמי",
    format: formatText,
  },
  {
    key: "rearTireSize",
    rawKey: "zmig_ahori",
    label: "מידת צמיג אחורי",
    format: formatText,
  },
  {
    key: "lastVehicleTestDate",
    rawKey: "mivchan_acharon_dt",
    label: "מועד הטסט האחרון",
    format: formatIsoDate,
  },
];

function formatText(value) {
  if (typeof value !== "string" && typeof value !== "number") {
    return "";
  }

  return String(value).trim();
}

function isValidDateParts(year, month, day) {
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function formatIsoDate(value) {
  const normalized = formatText(value);
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:T.*)?$/.exec(normalized);

  if (!match) {
    return "";
  }

  const [, yearPart, monthPart, dayPart] = match;
  const year = Number(yearPart);
  const month = Number(monthPart);
  const day = Number(dayPart);

  if (!isValidDateParts(year, month, day)) {
    return "";
  }

  return `${dayPart.padStart(2, "0")}.${monthPart.padStart(2, "0")}.${yearPart}`;
}

function formatYearMonth(value) {
  const normalized = formatText(value);
  const match = /^(\d{4})-(\d{1,2})$/.exec(normalized);

  if (!match) {
    return "";
  }

  const [, year, monthPart] = match;
  const month = Number(monthPart);

  if (month < 1 || month > 12) {
    return "";
  }

  return `${monthPart.padStart(2, "0")}.${year}`;
}

export function getAdditionalVehicleDetails(vehicle) {
  const raw = vehicle?.governmentData?.raw;

  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return [];
  }

  return ADDITIONAL_DETAIL_DEFINITIONS.map((definition) => ({
    key: definition.key,
    label: definition.label,
    value: definition.format(raw[definition.rawKey]),
  })).filter((detail) => detail.value);
}
