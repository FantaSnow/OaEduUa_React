/**
 * Повертає URL зображення новини. На беку зберігається лише посилання (шлях).
 * Якщо це відносний шлях — дописуємо базовий URL API, щоб запит йшов на бекенд.
 */
export function getNewsImageUrl(
  path: string | null | undefined,
  placeholder = "/assets/images/NoPhoto.jpg"
): string {
  if (!path || path.trim() === "") return placeholder;
  const p = path.trim();
  if (p.startsWith("http://") || p.startsWith("https://")) return p;
  const base = typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
    : "/api";
  return `${base}${p.startsWith("/") ? p : `/${p}`}`;
}
