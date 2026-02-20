import { HttpClient } from "./HttpClient";
import type { ApiResponse } from "@/types/api.types";
import type { SubjectEntity } from "@/types/entities";

const http = new HttpClient({});

export interface SubjectCreateDto {
  name: string;
}

export interface SubjectUpdateDto extends SubjectEntity {}

class SubjectService {
  async getAll(skip = 0, limit = 10): Promise<ApiResponse<SubjectEntity>> {
    return http.get<ApiResponse<SubjectEntity>>(
      `/subject/get-all?skip=${skip}&limit=${limit}`
    );
  }
  async getByName(name: string): Promise<SubjectEntity> {
    return http.get<SubjectEntity>(
      `/subject/get-by-name?name=${encodeURIComponent(name)}`
    );
  }
  async getById(id: number): Promise<SubjectEntity> {
    return http.get<SubjectEntity>(`/subject/get?id=${id}`);
  }
  async create(subjectData: SubjectCreateDto): Promise<SubjectEntity> {
    return http.post<SubjectEntity>("/subject/create", subjectData);
  }
  async update(subjectData: SubjectUpdateDto): Promise<SubjectEntity> {
    return http.put<SubjectEntity>("/subject/update", subjectData);
  }
  async delete(id: number): Promise<void> {
    return http.delete<void>(`/subject/delete?id=${id}`);
  }
}

export default new SubjectService();
