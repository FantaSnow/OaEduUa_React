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
 * Спеціальність (SpecialtyBase + id).
 */
export interface Specialty {
  id: number;
  name: string;
  specialty_number: number;
  department_id: number;
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
 * Предмет (SubjectBase + id).
 */
export interface SubjectEntity {
  id: number;
  name: string;
  desc: string;
  lecture_count: number;
}

/**
 * Елемент галереї новини.
 */
export interface NewsGalleryItem {
  image_path?: string;
}

/**
 * Категорія новин.
 */
export interface NewsCategory {
  id: number;
  name: string;
}

/**
 * Новина (для адмінки). Відповідає бекенду: name, description, newscategory_id, department_id, user_id, photo_path, gallery_photos.
 */
export interface NewsEntity {
  id: number;
  name: string;
  description: string;
  newscategory_id: number;
  department_id: number;
  user_id?: number;
  created_at?: string;
  photo_path?: string | null;
  gallery_photos?: NewsGalleryItem[];
  newscategory?: { id: number; name: string };
  department?: { id: number; name: string };
  users?: { id: number; name: string; email?: string };
}

/**
 * Волонтерство (VolunteeringBase + id).
 */
export interface VolunteeringEntity {
  id: number;
  name: string;
  desc: string;
  date_start: string;
  date_end: string;
  location: string;
  department_id: number;
  user_id: number;
  goal: number;
  volunteeringcategory_id: number;
  volunteeringcategory?: { id: number; name: string };
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
