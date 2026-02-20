import { HttpClient } from "./HttpClient";
import type { User } from "@/types/entities";

const http = new HttpClient({});

class UserService {
  async getMe(): Promise<User> {
    return http.get<User>("/users/me");
  }
}

export default new UserService();

