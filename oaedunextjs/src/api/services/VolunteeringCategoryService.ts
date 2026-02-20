import { HttpClient } from "./HttpClient";
import type { ApiResponse } from "@/types/api.types";
import type { VolunteeringCategory } from "@/types/entities";

const http = new HttpClient({});

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
      `/volunteering-category/get-all?skip=${skip}&limit=${limit}`
    );
  }
  async getByName(name: string): Promise<VolunteeringCategory> {
    return http.get<VolunteeringCategory>(
      `/volunteering-category/get-by-name?name=${encodeURIComponent(name)}`
    );
  }
  async getById(id: number): Promise<VolunteeringCategory> {
    return http.get<VolunteeringCategory>(
      `/volunteering-category/get?id=${id}`
    );
  }
  async create(
    categoryData: VolunteeringCategoryCreateDto
  ): Promise<VolunteeringCategory> {
    return http.post<VolunteeringCategory>(
      "/volunteering-category/create",
      categoryData
    );
  }
  async update(
    categoryData: VolunteeringCategoryUpdateDto
  ): Promise<VolunteeringCategory> {
    return http.put<VolunteeringCategory>(
      "/volunteering-category/update",
      categoryData
    );
  }
  async delete(id: number): Promise<void> {
    return http.delete<void>(`/volunteering-category/delete?id=${id}`);
  }
}

export default new VolunteeringCategoryService();
