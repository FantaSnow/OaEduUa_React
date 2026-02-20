import HomePage from "@/features/HomePage/HomePage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function HomePageRoute() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}

