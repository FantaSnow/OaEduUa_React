import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "@/types/api.types";

function getUserIdFromToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.userid ?? null;
  } catch {
    return null;
  }
}

export class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(configs: AxiosRequestConfig) {
    this.axiosInstance = axios.create({
      baseURL:
        configs.baseURL ||
        process.env.NEXT_PUBLIC_API_URL ||
        "/api",
      timeout: configs.timeout || 30000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...configs.headers,
      },
    });
    this.initInterceptors();
  }

  private initInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("token");
          if (token) {
            config.headers = config.headers ?? {};
            config.headers["Authorization"] = `Bearer ${token}`;
          }

          const userId = getUserIdFromToken();
          if (userId) {
            config.headers = config.headers ?? {};
            config.headers["X-User-Id"] = userId;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          typeof window !== "undefined" &&
          error instanceof AxiosError &&
          error.response?.status === 401
        ) {
          localStorage.removeItem("token");
          window.location.href = "/Login";
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance
      .get(url, config)
      .then((response) => response.data as T);
  }

  public async post<T, D = unknown>(
    url: string,
    data: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.axiosInstance
      .post(url, data, config)
      .then((response) => response.data as T);
  }

  public async put<T, D = unknown>(
    url: string,
    data: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.axiosInstance
      .put(url, data, config)
      .then((response) => response.data as T);
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance
      .delete(url, config)
      .then((response) => response.data as T);
  }
}

