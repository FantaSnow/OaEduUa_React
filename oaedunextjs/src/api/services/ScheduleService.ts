import type { AxiosRequestConfig } from "axios";
import { HttpClient } from "./HttpClient";
import type { ApiResponse } from "@/types/api.types";
import { unwrapApiResponse } from "@/types/api.types";
import type { ScheduleLesson } from "@/types/entities";

const http = new HttpClient({});

export interface ScheduleCreateDto {
  [key: string]: unknown;
}

export interface ScheduleUpdateDto {
  [key: string]: unknown;
}

class ScheduleService {
  async getAll(
    skip = 0,
    limit = 10
  ): Promise<ApiResponse<ScheduleLesson>> {
    return http.get<ApiResponse<ScheduleLesson>>(
      `/schedule/get-all?skip=${skip}&limit=${limit}`
    );
  }

  async getBySubjectName(
    name: string,
    date_start?: string,
    date_end?: string
  ): Promise<ScheduleLesson[]> {
    let url = `/schedule/get-by-subject-name?name=${encodeURIComponent(name)}`;
    if (date_start) url += `&date_start=${date_start}`;
    if (date_end) url += `&date_end=${date_end}`;
    const res = await http.get<ApiResponse<ScheduleLesson>>(url);
    return unwrapApiResponse(res);
  }

  async getById(id: number): Promise<ScheduleLesson> {
    return http.get<ScheduleLesson>(`/schedule/get?id=${id}`);
  }

  async getByDates(
    date_start?: string,
    date_end?: string
  ): Promise<ScheduleLesson[]> {
    const config: AxiosRequestConfig = {
      params: { date_start, date_end },
    };
    const res = await http.put<ApiResponse<ScheduleLesson>>(
      "/schedule/get-by-date-start-end",
      undefined,
      config
    );
    return unwrapApiResponse(res);
  }

  async getByGroup(
    date_start?: string,
    date_end?: string
  ): Promise<ScheduleLesson[]> {
    const config: AxiosRequestConfig = {
      params: { date_start, date_end },
    };
    const res = await http.put<ApiResponse<ScheduleLesson>>(
      "/schedule/get_by-group",
      undefined,
      config
    );
    return unwrapApiResponse(res);
  }

  async create(scheduleData: ScheduleCreateDto): Promise<ScheduleLesson> {
    return http.post<ScheduleLesson>("/schedule/create", scheduleData);
  }

  async update(scheduleData: ScheduleUpdateDto): Promise<ScheduleLesson> {
    return http.put<ScheduleLesson>("/schedule/update", scheduleData);
  }

  async delete(id: number): Promise<void> {
    return http.delete<void>(`/schedule/delete?id=${id}`);
  }
}

export default new ScheduleService();
