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
