/**
 * Уніфікована структура відповіді API.
 * Бекенд може повертати або масив напряму T[], або об'єкт { data: T[] }.
 */
export type ApiResponse<T> = T[] | { data: T[] };

/**
 * Розпаковує відповідь API в масив елементів.
 */
export function unwrapApiResponse<T>(response: ApiResponse<T>): T[] {
  if (Array.isArray(response)) return response;
  if (
    response &&
    typeof response === "object" &&
    "data" in response &&
    Array.isArray((response as { data: T[] }).data)
  ) {
    return (response as { data: T[] }).data;
  }
  return [];
}

/**
 * Payload JWT токена.
 */
export interface JwtPayload {
  userid?: string;
}
