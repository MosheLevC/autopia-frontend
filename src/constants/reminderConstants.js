export const REMINDER_TYPES = [
  {
    value: "test",
    label: "טסט שנתי",
    subtitle: "מבחן רישוי שנתי",
    icon: "ph-car",
  },
  {
    value: "insurance",
    label: "ביטוח רכב",
    subtitle: "ביטוח חובה / מקיף",
    icon: "ph-shield-check",
  },
];

export const REMINDER_FREQUENCIES = [
  {
    value: "yearly",
    label: "שנתי (12 חודשים)",
    shortLabel: "שנתי",
    months: 12,
  },
  {
    value: "halfYearly",
    label: "חצי שנתי (6 חודשים)",
    shortLabel: "חצי שנתי",
    months: 6,
  },
];

export const REMINDER_FREQUENCY_MONTHS = {
  yearly: 12,
  halfYearly: 6,
};

export function getFrequenciesForType(type) {
  if (type === "insurance") {
    return REMINDER_FREQUENCIES.filter((f) => f.value === "yearly");
  }
  return REMINDER_FREQUENCIES;
}

export function getReminderTypeInfo(type) {
  return REMINDER_TYPES.find((t) => t.value === type) || {
    value: type,
    label: type,
    subtitle: "",
    icon: "ph-bell",
  };
}

export function getReminderFrequencyInfo(frequency) {
  return REMINDER_FREQUENCIES.find((f) => f.value === frequency) || {
    value: frequency,
    label: frequency,
    shortLabel: frequency,
    months: 12,
  };
}

export function getDaysDifference(targetDate) {
  if (!targetDate) return 0;
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function getReminderStatus(dueDate) {
  const days = getDaysDifference(dueDate);

  if (days < 0) {
    const absDays = Math.abs(days);
    return {
      key: "overdue",
      statusLabel: "פג תוקף",
      color: "red",
      badgeVariant: "light",
      countdownText: absDays === 1 ? "פג תוקף אתמול" : `פג תוקף לפני ${absDays} ימים`,
      daysRemaining: days,
      canRenew: true,
    };
  }

  if (days === 0) {
    return {
      key: "today",
      statusLabel: "פג היום",
      color: "red",
      badgeVariant: "filled",
      countdownText: "פג תוקף היום!",
      daysRemaining: 0,
      canRenew: true,
    };
  }

  if (days <= 60) {
    return {
      key: "soon",
      statusLabel: "מתקרב",
      color: "orange",
      badgeVariant: "light",
      countdownText: days === 1 ? "נותר יום אחד" : `נותרו ${days} ימים`,
      daysRemaining: days,
      canRenew: true,
    };
  }

  return {
    key: "valid",
    statusLabel: "בתוקף",
    color: "teal",
    badgeVariant: "light",
    countdownText: `נותרו ${days} ימים`,
    daysRemaining: days,
    canRenew: false,
  };
}

export function calculateRenewedDate(currentDueDate, frequency = "yearly") {
  if (!currentDueDate) return new Date();
  const result = new Date(currentDueDate);
  const months = REMINDER_FREQUENCY_MONTHS[frequency] || 12;
  const dayOfMonth = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  const lastDayOfMonth = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0
  ).getDate();
  result.setDate(Math.min(dayOfMonth, lastDayOfMonth));
  return result;
}

export function formatHebrewDate(dateValue) {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
