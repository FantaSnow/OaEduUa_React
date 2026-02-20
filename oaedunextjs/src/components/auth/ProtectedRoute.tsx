"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Loader from "@/components/common/Loader";

interface ProtectedRouteProps {
  role?: string | string[];
  children?: React.ReactNode;
  redirectTo?: string;
}

const hasRole = (userRole: string, role?: string | string[]) => {
  if (!role) return true;
  if (Array.isArray(role)) return role.includes(userRole);
  return userRole === role;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  role,
  children,
  redirectTo = "/Login",
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { user, loading } = useCurrentUser();

  const shouldRedirect =
    !loading && (!isAuthenticated || !user || !hasRole(user?.role_name ?? "", role));

  useEffect(() => {
    if (shouldRedirect) {
      router.push(redirectTo);
    }
  }, [shouldRedirect, redirectTo, router]);

  if (loading) return <Loader />;
  if (shouldRedirect) return null;

  return <>{children}</>;
};

export default ProtectedRoute;

