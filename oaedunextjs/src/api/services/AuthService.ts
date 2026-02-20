import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "@/types/api.types";
import { HttpClient } from "@/api/services/HttpClient";

class AuthService {
  private static tokenKey = "token";
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
    });
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await this.httpClient.post<{ access_token: string }>(
        "/users/login-via-email",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const token = response.access_token;
      if (typeof window !== "undefined") {
        localStorage.setItem(AuthService.tokenKey, token);
      }
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AuthService.tokenKey);
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(AuthService.tokenKey);
  }

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AuthService.tokenKey);
  }

  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken = jwtDecode<JwtPayload>(token);
    return decodedToken.userid ?? null;
  }
}

export default new AuthService();

