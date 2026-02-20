import { HttpClient } from "./HttpClient";
import type { ApiResponse } from "@/types/api.types";
import type { Department } from "@/types/entities";

const http = new HttpClient({});

export interface DepartmentCreateDto {
  name: string;
}

export interface DepartmentUpdateDto extends DepartmentCreateDto {
  id: number;
}

class DepartmentService {
  async getAll(skip = 0, limit = 10): Promise<ApiResponse<Department>> {
    return http.get<ApiResponse<Department>>(
      `/departments/get-all?skip=${skip}&limit=${limit}`
    );
  }
  async getById(id: number): Promise<Department> {
    return http.get<Department>(`/departments/get?id=${id}`);
  }
  async create(departmentData: DepartmentCreateDto): Promise<Department> {
    return http.post<Department>("/departments/create", departmentData);
  }
  async update(departmentData: DepartmentUpdateDto): Promise<Department> {
    return http.put<Department>("/departments/update", departmentData);
  }
  async delete(id: number): Promise<void> {
    return http.delete<void>(`/departments/delete?id=${id}`);
  }
}

export default new DepartmentService();
