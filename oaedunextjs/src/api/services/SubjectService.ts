import { HttpClient } from "./HttpClient";
import type { ApiResponse } from "@/types/api.types";
import type { SubjectEntity } from "@/types/entities";

const http = new HttpClient({});

/** Відповідає schemas.SubjectCreate (SubjectBase) */
export interface SubjectCreateDto {
  name: string;
  desc: string;
  lecture_count: number;
}

/** Відповідає schemas.SubjectUpdate */
export interface SubjectUpdateDto {
  id: number;
  name: string;
  desc: string;
  lecture_count: number;
}

class SubjectService {
  /** GET /subject/get-all — повертає List[Subject] */
  async getAll(skip = 0, limit = 10): Promise<ApiResponse<SubjectEntity>> {
    return http.get<ApiResponse<SubjectEntity>>(
      `/subject/get-all?skip=${skip}&limit=${limit}`
    );
  }

  /** GET /subject/get-by-name */
  async getByName(name: string): Promise<SubjectEntity> {
    return http.get<SubjectEntity>(
      `/subject/get-by-name?name=${encodeURIComponent(name)}`
    );
  }

  /** GET /subject/get?id= */
  async getById(id: number): Promise<SubjectEntity> {
    return http.get<SubjectEntity>(`/subject/get?id=${id}`);
  }

  /** POST /subject/create */
  async create(data: SubjectCreateDto): Promise<SubjectEntity> {
    return http.post<SubjectEntity>("/subject/create", data);
  }

  /** PUT /subject/update */
  async update(data: SubjectUpdateDto): Promise<SubjectEntity> {
    return http.put<SubjectEntity>("/subject/update", data);
  }

  /** DELETE /subject/delete?id= — бек повертає видалений Subject */
  async delete(id: number): Promise<SubjectEntity | void> {
    return http.delete<SubjectEntity>(`/subject/delete?id=${id}`);
  }
}

export default new SubjectService();
