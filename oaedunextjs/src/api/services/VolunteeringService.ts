import { HttpClient } from "./HttpClient";
import type { ApiResponse } from "@/types/api.types";
import type { VolunteeringEntity } from "@/types/entities";

const http = new HttpClient({});

/** Відповідає VolunteeringCreate. user_id бек ставить з auth. */
export interface VolunteeringCreateDto {
  name: string;
  desc: string;
  date_start: string;
  date_end: string;
  location: string;
  department_id: number;
  goal: number;
  volunteeringcategory_id: number;
}

/** Відповідає VolunteeringUpdate (VolunteeringBase + id) */
export interface VolunteeringUpdateDto {
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
}

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
    return http.get<VolunteeringEntity>(`/volunteering/get-by-id?id=${id}`);
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
