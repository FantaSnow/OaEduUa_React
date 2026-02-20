import HomePage from "@/features/HomePage/HomePage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function RootPage() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}
