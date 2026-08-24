import {
  ClockCounterClockwise,
  Wrench,
  ArrowsLeftRight,
  MagnifyingGlass,
  DotsThreeCircle,
} from "@phosphor-icons/react";

export const MAINTENANCE_TYPE_CONFIG = {
  periodic: { label: "תקופתי", color: "orange", icon: ClockCounterClockwise },
  repair: { label: "תיקון", color: "red", icon: Wrench },
  replacement: { label: "החלפה", color: "grape", icon: ArrowsLeftRight },
  inspection: { label: "בדיקה", color: "teal", icon: MagnifyingGlass },
  other: { label: "אחר", color: "gray", icon: DotsThreeCircle },
};

export const MAINTENANCE_TYPES = Object.entries(MAINTENANCE_TYPE_CONFIG).map(
  ([value, config]) => ({
    value,
    ...config,
  }),
);

export const getMaintenanceTypeInfo = (type) =>
  MAINTENANCE_TYPE_CONFIG[type] || MAINTENANCE_TYPE_CONFIG.other;

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
