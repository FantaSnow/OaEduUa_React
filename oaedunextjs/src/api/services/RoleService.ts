import { HttpClient } from "./HttpClient";
import type { ApiResponse } from "@/types/api.types";
import type { Role } from "@/types/entities";

const http = new HttpClient({});

export interface RoleCreateDto {
  name: string;
}

export interface RoleUpdateDto extends Role {}

class RoleService {
  async getAll(skip = 0, limit = 10): Promise<ApiResponse<Role>> {
    return http.get<ApiResponse<Role>>(
      `/roles/get-all?skip=${skip}&limit=${limit}`
    );
  }
  async getById(id: number): Promise<Role> {
    return http.get<Role>(`/roles/get?id=${id}`);
  }
  async getByName(name: string): Promise<Role> {
    return http.get<Role>(
      `/roles/get-by-name?name=${encodeURIComponent(name)}`
    );
  }
  async create(roleData: RoleCreateDto): Promise<Role> {
    return http.post<Role>("/roles/create", roleData);
  }
  async update(roleData: RoleUpdateDto): Promise<Role> {
    return http.put<Role>("/roles/update", roleData);
  }
  async delete(id: number): Promise<void> {
    return http.delete<void>(`/roles/delete?id=${id}`);
  }
}

export default new RoleService();
