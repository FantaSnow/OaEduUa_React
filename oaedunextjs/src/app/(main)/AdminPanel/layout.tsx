"use client";

import React from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function AdminSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute role="Admin">
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}
