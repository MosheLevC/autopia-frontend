const DEFAULT_TITLE = "שיחה חדשה";
const DEFAULT_TITLE_MAX_LENGTH = 56;

export const createAIEntityId = (prefix) =>
  globalThis.crypto?.randomUUID?.() ||
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const createConversationTitle = (
  content,
  maxLength = DEFAULT_TITLE_MAX_LENGTH,
) => {
  const normalizedContent = String(content || "")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalizedContent) return DEFAULT_TITLE;
  if (normalizedContent.length <= maxLength) return normalizedContent;

  const truncateAt = Math.max(1, maxLength - 1);
  let title = normalizedContent.slice(0, truncateAt).trimEnd();
  const lastSpace = title.lastIndexOf(" ");

  if (lastSpace >= Math.floor(truncateAt * 0.6)) {
    title = title.slice(0, lastSpace);
  }

  return `${title}…`;
};

export const formatConversationTimestamp = (value, now = new Date()) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfConversationDay = new Date(date);
  startOfConversationDay.setHours(0, 0, 0, 0);

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  let dateLabel;
  if (startOfConversationDay.getTime() === startOfToday.getTime()) {
    dateLabel = "היום";
  } else if (
    startOfConversationDay.getTime() === startOfYesterday.getTime()
  ) {
    dateLabel = "אתמול";
  } else {
    dateLabel = new Intl.DateTimeFormat("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  }

  const timeLabel = new Intl.DateTimeFormat("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  return `${dateLabel} · ${timeLabel}`;
};
