/**
 * Перетворює час у форматі "HH:mm" або "HH:mm:ss" у ISO-8601 "HH:mm:ss.000Z"
 */
export function toIsoTime(time: string): string {
  if (!time) return "";
  const [h, m, s] = time.split(":");
  if (s !== undefined) {
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}:${s.padStart(2, "0")}.000Z`;
  }
  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}:00.000Z`;
}

/**
 * Повертає дату у форматі YYYY-MM-DD для input type="date" з ISO-рядка
 */
export function toDateOnly(value: string | null | undefined): string {
  if (value == null || value === "") return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Форматує ISO-дату або datetime тільки як дату: DD.MM.YYYY (без годин і хвилин)
 */
export function formatDateOnlyEuropean(value: string | null | undefined): string {
  if (value == null || value === "") return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Форматує ISO-дату або datetime у європейський формат: DD.MM.YYYY або DD.MM.YYYY, HH:mm
 */
export function formatDateEuropean(value: string | null | undefined): string {
  if (value == null || value === "") return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const hasTime =
    value.includes("T") ||
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(value.trim());
  if (hasTime) {
    return date.toLocaleString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).replace(",", ", ");
  }
  return date.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
