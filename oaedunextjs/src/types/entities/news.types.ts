/**
 * Елемент новини (для сторінок категорій).
 */
export interface NewsItem {
  image?: string;
  title: string;
  description?: string;
  meta?: string;
  faculty?: string;
  date?: string;
  content?: string;
  chatImage?: string;
}

/**
 * Payload для створення новини.
 */
export interface NewsCreatePayload {
  name?: string;
  desc?: string;
  description?: string;
  categ?: number;
  category?: number;
  depart?: number;
  department_id?: number;
  main_image?: File;
  gallery_images?: File[];
}
