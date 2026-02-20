/**
 * Користувач (відповідь /users/me).
 */
export interface User {
  name: string;
  email: string;
  group_name?: string;
  role_name: string;
  avatar?: string;
}
