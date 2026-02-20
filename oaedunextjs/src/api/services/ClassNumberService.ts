import { HttpClient } from "./HttpClient";
import type { ApiResponse } from "@/types/api.types";
import type { ClassNumberEntity } from "@/types/entities";

const http = new HttpClient({});

export interface ClassNumberCreateDto {
  number: string | number;
  time_start: string;
  time_end: string;
}

export interface ClassNumberUpdateDto extends ClassNumberCreateDto {
  id: number;
}

class ClassNumberService {
  async getAll(skip = 0, limit = 10): Promise<ApiResponse<ClassNumberEntity>> {
    return http.get<ApiResponse<ClassNumberEntity>>(
      `/classnumber/get-all?skip=${skip}&limit=${limit}`
    );
  }
  async getById(id: number): Promise<ClassNumberEntity> {
    return http.get<ClassNumberEntity>(`/classnumber/get?id=${id}`);
  }
  async create(
    classNumberData: ClassNumberCreateDto
  ): Promise<ClassNumberEntity> {
    return http.post<ClassNumberEntity>(
      "/classnumber/create",
      classNumberData
    );
  }
  async update(
    classNumberData: ClassNumberUpdateDto
  ): Promise<ClassNumberEntity> {
    return http.put<ClassNumberEntity>(
      "/classnumber/update",
      classNumberData
    );
  }
  async delete(id: number): Promise<void> {
    return http.delete<void>(`/classnumber/delete?id=${id}`);
  }
}

export default new ClassNumberService();
