import SchedulePage from "@/features/SchedulePage/SchedulePage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ScheduleRoute() {
  return (
    <ProtectedRoute>
      <SchedulePage />
    </ProtectedRoute>
  );
}

