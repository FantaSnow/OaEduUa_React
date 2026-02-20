import type { AxiosRequestConfig } from "axios";
import { HttpClient } from "./HttpClient";
import type { ApiResponse } from "@/types/api.types";
import type { TeacherEntity } from "@/types/entities";

const http = new HttpClient({});

export interface TeacherCreateDto {
  name: string;
  email?: string;
  department_id?: number;
}

export interface TeacherUpdateDto extends TeacherEntity {}

class TeacherService {
  async getAll(skip = 0, limit = 10): Promise<ApiResponse<TeacherEntity>> {
    return http.get<ApiResponse<TeacherEntity>>(
      `/teachers/get-all?skip=${skip}&limit=${limit}`
    );
  }
  async getByName(name: string): Promise<TeacherEntity> {
    return http.get<TeacherEntity>(
      `/teachers/get-by-name?name=${encodeURIComponent(name)}`
    );
  }
  async getById(id: number): Promise<TeacherEntity> {
    return http.get<TeacherEntity>(`/teachers/get?id=${id}`);
  }
  async create(teacherData: TeacherCreateDto): Promise<TeacherEntity> {
    return http.post<TeacherEntity>("/teachers/create", teacherData);
  }
  async update(teacherData: TeacherUpdateDto): Promise<TeacherEntity> {
    return http.put<TeacherEntity>("/teachers/update", teacherData);
  }
  async delete(id: number): Promise<void> {
    return http.delete<void>(`/teachers/delete?id=${id}`);
  }
  async loadTeachers(file: File): Promise<unknown> {
    const formData = new FormData();
    formData.append("file", file);
    const config: AxiosRequestConfig = {
      headers: { "Content-Type": "multipart/form-data" },
    };
    return http.post("/teachers/load-teacher", formData, config);
  }
}

export default new TeacherService();
