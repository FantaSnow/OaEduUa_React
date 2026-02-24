import { HttpClient } from "./HttpClient";
import type { ApiResponse } from "@/types/api.types";
import type { NewsEntity } from "@/types/entities";

const http = new HttpClient({});

export interface NewsCreateDto {
  name: string;
  desc: string;
  categ: number;
  depart: number;
  main_image: File;
  gallery_images?: File[];
}

export interface NewsUpdateDto {
  id: number;
  name: string;
  description: string;
  newscategory_id: number;
  department_id: number;
}

class NewsService {
  async getAll(skip = 0, limit = 10): Promise<ApiResponse<NewsEntity>> {
    return http.get<ApiResponse<NewsEntity>>(
      `/news/get-all?skip=${skip}&limit=${limit}`
    );
  }

  async getById(id: number): Promise<NewsEntity> {
    const raw = await http.get<NewsEntity | NewsEntity[]>(
      `/news/get-by-id?id=${id}`
    );
    // Якщо бекенд повертає масив — беремо перший елемент
    if (Array.isArray(raw)) {
      const first = raw[0];
      if (!first) return Promise.reject(new Error("Новину не знайдено"));
      return first as NewsEntity;
    }
    return raw as NewsEntity;
  }

  async create(data: NewsCreateDto): Promise<NewsEntity> {
    const formData = new FormData();
    formData.append("main_image", data.main_image);
    if (data.gallery_images?.length) {
      data.gallery_images.forEach((file) =>
        formData.append("gallery_images", file)
      );
    }
    return http.post<NewsEntity>("/news/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        name: data.name.trim(),
        desc: data.desc.trim(),
        categ: data.categ,
        depart: data.depart,
      },
    });
  }

  async update(newsData: NewsUpdateDto): Promise<NewsEntity> {
    const id = parseInt(String(newsData.id), 10);
    const ncat = parseInt(String(newsData.newscategory_id), 10);
    const dept = parseInt(String(newsData.department_id), 10);
    if (Number.isNaN(id) || Number.isNaN(ncat) || Number.isNaN(dept)) {
      return Promise.reject(new Error("Невірні id, категорія або кафедра"));
    }
    const body = {
      id,
      name: String(newsData.name ?? "").trim(),
      description: String(newsData.description ?? "").trim(),
      newscategory_id: ncat,
      department_id: dept,
    };
    return http.put<NewsEntity>("/news/update", body);
  }

  async delete(id: number): Promise<void> {
    return http.delete<void>(`/news/delete?id=${id}`);
  }
}

export default new NewsService();
