import { HttpClient } from "./HttpClient";
import type { ApiResponse } from "@/types/api.types";
import type { NewsEntity } from "@/types/entities";
import type { NewsCreatePayload } from "@/types/entities";

const http = new HttpClient({});

class NewsService {
  async getAll(skip = 0, limit = 10): Promise<ApiResponse<NewsEntity>> {
    return http.get<ApiResponse<NewsEntity>>(
      `/news/get-all?skip=${skip}&limit=${limit}`
    );
  }
  async getById(id: number): Promise<NewsEntity> {
    return http.get<NewsEntity>(`/news/get-by-id?id=${id}`);
  }
  async getByDepartment(
    departament_id: number
  ): Promise<ApiResponse<NewsEntity>> {
    return http.get<ApiResponse<NewsEntity>>(
      `/news/get-by-departament?departament_id=${departament_id}`
    );
  }
  async create(data: FormData | NewsCreatePayload): Promise<NewsEntity> {
    if (data instanceof FormData) {
      return http.post<NewsEntity>("/news/create", data);
    }
    const formData = new FormData();
    formData.append("name", String(data.name ?? ""));
    formData.append("desc", String(data.desc ?? data.description ?? ""));
    formData.append("categ", String(data.categ ?? data.category ?? 0));
    formData.append("depart", String(data.depart ?? data.department_id ?? 0));
    if (data.main_image instanceof File) {
      formData.append("main_image", data.main_image);
    }
    if (Array.isArray(data.gallery_images)) {
      data.gallery_images.forEach((file: File) =>
        formData.append("gallery_images", file)
      );
    }
    return http.post<NewsEntity>("/news/create", formData);
  }
  async update(newsData: FormData | Partial<NewsEntity>): Promise<NewsEntity> {
    if (newsData instanceof FormData) {
      return http.post<NewsEntity>("/news/update", newsData);
    }
    return http.put<NewsEntity>("/news/update", newsData);
  }
  async delete(id: number): Promise<void> {
    return http.delete<void>(`/news/delete?id=${id}`);
  }
}

export default new NewsService();
