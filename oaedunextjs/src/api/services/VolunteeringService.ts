import { HttpClient } from "./HttpClient";
import type { ApiResponse } from "@/types/api.types";
import type { VolunteeringEntity } from "@/types/entities";

const http = new HttpClient({});

export interface VolunteeringCreateDto {
  title: string;
  description?: string;
  organization?: string;
}

export interface VolunteeringUpdateDto extends VolunteeringEntity {}

class VolunteeringService {
  async getAll(
    skip = 0,
    limit = 10
  ): Promise<ApiResponse<VolunteeringEntity>> {
    return http.get<ApiResponse<VolunteeringEntity>>(
      `/volunteering/get-all?skip=${skip}&limit=${limit}`
    );
  }
  async getById(id: number): Promise<VolunteeringEntity> {
    return http.get<VolunteeringEntity>(`/volunteering/get?id=${id}`);
  }
  async getByTitle(title: string): Promise<VolunteeringEntity> {
    return http.get<VolunteeringEntity>(
      `/volunteering/get-by-title?title=${encodeURIComponent(title)}`
    );
  }
  async create(
    volData: VolunteeringCreateDto
  ): Promise<VolunteeringEntity> {
    return http.post<VolunteeringEntity>("/volunteering/create", volData);
  }
  async update(
    volData: VolunteeringUpdateDto
  ): Promise<VolunteeringEntity> {
    return http.put<VolunteeringEntity>("/volunteering/update", volData);
  }
  async delete(id: number): Promise<void> {
    return http.delete<void>(`/volunteering/delete?id=${id}`);
  }
}

export default new VolunteeringService();
