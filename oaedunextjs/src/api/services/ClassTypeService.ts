import { HttpClient } from "./HttpClient";
import type { ApiResponse } from "@/types/api.types";
import type { ClassTypeEntity } from "@/types/entities";

const http = new HttpClient({});

export interface ClassTypeCreateDto {
  name: string;
}

export interface ClassTypeUpdateDto extends ClassTypeEntity {}

class ClassTypeService {
  async getAll(skip = 0, limit = 10): Promise<ApiResponse<ClassTypeEntity>> {
    return http.get<ApiResponse<ClassTypeEntity>>(
      `/classtypes/get-all?skip=${skip}&limit=${limit}`
    );
  }
  async getById(id: number): Promise<ClassTypeEntity> {
    return http.get<ClassTypeEntity>(`/classtypes/get?id=${id}`);
  }
  async create(classTypeData: ClassTypeCreateDto): Promise<ClassTypeEntity> {
    return http.post<ClassTypeEntity>("/classtypes/create", classTypeData);
  }
  async update(classTypeData: ClassTypeUpdateDto): Promise<ClassTypeEntity> {
    return http.put<ClassTypeEntity>("/classtypes/update", classTypeData);
  }
  async delete(id: number): Promise<void> {
    return http.delete<void>(`/classtypes/delete?id=${id}`);
  }
}

export default new ClassTypeService();
