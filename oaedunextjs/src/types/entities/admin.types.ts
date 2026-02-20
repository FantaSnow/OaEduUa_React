/**
 * Кафедра.
 */
export interface Department {
  id: number;
  name: string;
}

/**
 * Роль користувача.
 */
export interface Role {
  id: number;
  name: string;
}

/**
 * Номер заняття (для адмінки).
 */
export interface ClassNumberEntity {
  id: number;
  number: string | number;
  time_start: string;
  time_end: string;
}

/**
 * Тип заняття (для адмінки).
 */
export interface ClassTypeEntity {
  id: number;
  name: string;
}

/**
 * Спеціальність.
 */
export interface Specialty {
  id: number;
  name: string;
  specialty_number?: string;
  department_id?: number | string;
}

/**
 * Група (для адмінки).
 */
export interface GroupEntity {
  id: number;
  name: string;
  specialty_id?: number;
  specialty?: { name: string };
}

/**
 * Викладач (для адмінки).
 */
export interface TeacherEntity {
  id: number;
  name: string;
  email?: string;
  department_id?: number;
  connectionCode?: string;
}

/**
 * Предмет (для адмінки).
 */
export interface SubjectEntity {
  id: number;
  name: string;
}

/**
 * Елемент галереї новини.
 */
export interface NewsGalleryItem {
  image_path?: string;
}

/**
 * Новина (для адмінки).
 */
export interface NewsEntity {
  id: number;
  name: string;
  desc?: string;
  categ?: number;
  depart?: number;
  main_image?: string;
  gallery_images?: string[];
  gallery_photos?: NewsGalleryItem[];
}

/**
 * Волонтерство (для адмінки).
 */
export interface VolunteeringEntity {
  id: number;
  title: string;
  description?: string;
  organization?: string;
  date?: string;
  location?: string;
  org?: string;
  orgLogo?: string;
  image?: string;
  category?: string;
  is_active?: boolean;
}

/**
 * Категорія волонтерства.
 */
export interface VolunteeringCategory {
  id: number;
  name: string;
}

/**
 * Розклад (для адмінки).
 */
export interface ScheduleAdminItem {
  id?: number;
  subject_id?: number;
  group_id?: number;
  teacher_id?: number;
  class_type_id?: number;
  class_number_id?: number;
  class_type?: number;
  auditory?: string;
  connectionCode?: string;
  date?: string;
  date_start?: string;
  date_end?: string;
  subject?: { name: string };
  group?: { name: string };
  teacher?: { name: string };
  class_type_obj?: { name: string };
  [key: string]: unknown;
}
