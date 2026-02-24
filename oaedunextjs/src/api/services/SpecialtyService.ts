import { HttpClient } from "./HttpClient";
import type { ApiResponse } from "@/types/api.types";
import type { Specialty } from "@/types/entities";

const http = new HttpClient({});

/** Відповідає SpecialtyCreate: name, specialty_number (int), department_id (int) */
export interface SpecialtyCreateDto {
  name: string;
  specialty_number: number;
  department_id: number;
}

/** Відповідає SpecialtyUpdate */
export interface SpecialtyUpdateDto {
  id: number;
  name: string;
  specialty_number: number;
  department_id: number;
}

class SpecialtyService {
  async getAll(skip = 0, limit = 10): Promise<ApiResponse<Specialty>> {
    return http.get<ApiResponse<Specialty>>(
      `/specialty/get-all?skip=${skip}&limit=${limit}`
    );
  }
  async getByName(name: string): Promise<Specialty> {
    return http.get<Specialty>(
      `/specialty/get-by-name?name=${encodeURIComponent(name)}`
    );
  }
  async getById(id: number): Promise<Specialty> {
    return http.get<Specialty>(`/specialty/get?id=${id}`);
  }
  async create(specialtyData: SpecialtyCreateDto): Promise<Specialty> {
    return http.post<Specialty>("/specialty/create", specialtyData);
  }
  async update(specialtyData: SpecialtyUpdateDto): Promise<Specialty> {
    return http.put<Specialty>("/specialty/update", specialtyData);
  }
  async delete(id: number): Promise<void> {
    return http.delete<void>(`/specialty/delete?id=${id}`);
  }
}

export default new SpecialtyService();
