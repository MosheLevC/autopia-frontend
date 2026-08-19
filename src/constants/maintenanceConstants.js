export const MAINTENANCE_TYPES = [
  { value: "periodic", label: "תקופתי" },
  { value: "repair", label: "תיקון" },
  { value: "replacement", label: "החלפה" },
  { value: "inspection", label: "בדיקה" },
  { value: "other", label: "אחר" },
];

export const QUICK_PARTS = [
  { value: "engineOil", label: "שמן מנוע" },
  { value: "oilFilter", label: "פילטר שמן" },
  { value: "brakePads", label: "רפידות בלם" },
  { value: "airFilter", label: "פילטר אוויר" },
  { value: "cabinFilter", label: "פילטר מזגן" },
  { value: "battery", label: "מצבר" },
  { value: "wipers", label: "מגבים" },
  { value: "coolant", label: "נוזל קירור" },
];

export const ALL_MAINTENANCE_PARTS = [
  { value: "engineOil", label: "שמן מנוע" },
  { value: "oilFilter", label: "פילטר שמן" },
  { value: "brakePads", label: "רפידות בלם" },
  { value: "brakeDiscs", label: "צלחות בלם" },
  { value: "brakeFluid", label: "נוזל בלמים" },
  { value: "airFilter", label: "פילטר אוויר" },
  { value: "cabinFilter", label: "פילטר מזגן" },
  { value: "fuelFilter", label: "פילטר דלק" },
  { value: "tires", label: "צמיגים" },
  { value: "battery", label: "מצבר" },
  { value: "coolant", label: "נוזל קירור" },
  { value: "sparkPlugs", label: "מצתים (פלאגים)" },
  { value: "timingBelt", label: "רצועת טיימינג" },
  { value: "timingChain", label: "שרשרת טיימינג" },
  { value: "transmissionFluid", label: "שמן גיר" },
  { value: "wipers", label: "מגבים" },
  { value: "lights", label: "נורות" },
  { value: "airConditioning", label: "מיזוג אוויר" },
  { value: "suspension", label: "מתלים ובולמי זעזועים" },
  { value: "steering", label: "מערכת היגוי" },
  { value: "exhaust", label: "אגזוז ומערכת פליטה" },
  { value: "starter", label: "מתנע (סטרטר)" },
  { value: "alternator", label: "אלטרנטור" },
  { value: "other", label: "אחר" },
];

export const getPartLabel = (value) => {
  const found = ALL_MAINTENANCE_PARTS.find((p) => p.value === value);
  return found ? found.label : value;
};
