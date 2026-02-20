import { useEffect, useState } from "react";
import UserService from "@/api/services/UserService";
import type { User } from "@/types/entities";

export function useCurrentUser(): {
  user: User | null;
  loading: boolean;
} {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    UserService.getMe()
      .then((data) => {
        if (mounted) setUser(data);
      })
      .catch(() => {
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { user, loading };
}

