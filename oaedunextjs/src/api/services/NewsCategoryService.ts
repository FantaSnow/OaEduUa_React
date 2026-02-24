import { HttpClient } from "./HttpClient";
import type { ApiResponse } from "@/types/api.types";
import type { NewsCategory } from "@/types/entities";

const http = new HttpClient({});
const BASE = "/newscategory";

export interface NewsCategoryCreateDto {
  name: string;
}

export interface NewsCategoryUpdateDto {
  id: number;
  name?: string;
}

class NewsCategoryService {
  async getAll(skip = 0, limit = 10): Promise<ApiResponse<NewsCategory>> {
    return http.get<ApiResponse<NewsCategory>>(
      `${BASE}/get-all?skip=${skip}&limit=${limit}`
    );
  }

  async getByName(name: string): Promise<NewsCategory> {
    return http.get<NewsCategory>(
      `${BASE}/get-by-name?name=${encodeURIComponent(name)}`
    );
  }

  async getById(id: number): Promise<NewsCategory> {
    return http.get<NewsCategory>(`${BASE}/get?id=${id}`);
  }

  async create(data: NewsCategoryCreateDto): Promise<NewsCategory> {
    return http.post<NewsCategory>(`${BASE}/create`, data);
  }

  async update(data: NewsCategoryUpdateDto): Promise<NewsCategory> {
    return http.put<NewsCategory>(`${BASE}/update`, data);
  }

  async delete(id: number): Promise<void> {
    return http.delete<void>(`${BASE}/delete?id=${id}`);
  }
}

export default new NewsCategoryService();
