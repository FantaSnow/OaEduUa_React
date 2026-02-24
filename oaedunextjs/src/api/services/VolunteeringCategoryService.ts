import { HttpClient } from "./HttpClient";
import type { ApiResponse } from "@/types/api.types";
import type { VolunteeringCategory } from "@/types/entities";

const http = new HttpClient({});

/** Шлях на бекенді: /volunteeringcategory/volunteering-category (роутер підключено з prefix="/volunteeringcategory") */
const BASE = "/volunteeringcategory/volunteering-category";

export interface VolunteeringCategoryCreateDto {
  name: string;
}

export interface VolunteeringCategoryUpdateDto extends VolunteeringCategory {}

class VolunteeringCategoryService {
  async getAll(
    skip = 0,
    limit = 10
  ): Promise<ApiResponse<VolunteeringCategory>> {
    return http.get<ApiResponse<VolunteeringCategory>>(
      `${BASE}/get-all?skip=${skip}&limit=${limit}`
    );
  }
  async getByName(name: string): Promise<VolunteeringCategory> {
    return http.get<VolunteeringCategory>(
      `${BASE}/get-by-name?name=${encodeURIComponent(name)}`
    );
  }
  async getById(id: number): Promise<VolunteeringCategory> {
    return http.get<VolunteeringCategory>(`${BASE}/get?id=${id}`);
  }
  async create(
    categoryData: VolunteeringCategoryCreateDto
  ): Promise<VolunteeringCategory> {
    return http.post<VolunteeringCategory>(`${BASE}/create`, categoryData);
  }
  async update(
    categoryData: VolunteeringCategoryUpdateDto
  ): Promise<VolunteeringCategory> {
    return http.put<VolunteeringCategory>(`${BASE}/update`, categoryData);
  }
  async delete(id: number): Promise<void> {
    return http.delete<void>(`${BASE}/delete?id=${id}`);
  }
}

export default new VolunteeringCategoryService();
