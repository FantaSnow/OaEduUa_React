import { HttpClient } from "./HttpClient";
import type { ApiResponse } from "@/types/api.types";
import type { GroupEntity } from "@/types/entities";

const http = new HttpClient({});

export interface GroupCreateDto {
  name: string;
  specialty_id?: number;
}

export interface GroupUpdateDto extends GroupEntity {}

class GroupService {
  async getAll(skip = 0, limit = 10): Promise<ApiResponse<GroupEntity>> {
    return http.get<ApiResponse<GroupEntity>>(
      `/groups/get-all?skip=${skip}&limit=${limit}`
    );
  }
  async getByName(name: string): Promise<GroupEntity> {
    return http.get<GroupEntity>(
      `/groups/get-by-name?name=${encodeURIComponent(name)}`
    );
  }
  async getBySpecialty(
    specialty_id: number
  ): Promise<ApiResponse<GroupEntity>> {
    return http.get<ApiResponse<GroupEntity>>(
      `/groups/get-by-specialty?specialty_id=${specialty_id}`
    );
  }
  async getById(id: number): Promise<GroupEntity> {
    return http.get<GroupEntity>(`/groups/get?id=${id}`);
  }
  async create(groupData: GroupCreateDto): Promise<GroupEntity> {
    return http.post<GroupEntity>("/groups/create", groupData);
  }
  async update(groupData: GroupUpdateDto): Promise<GroupEntity> {
    return http.put<GroupEntity>("/groups/update", groupData);
  }
  async delete(id: number): Promise<void> {
    return http.delete<void>(`/groups/delete?id=${id}`);
  }
}

export default new GroupService();
