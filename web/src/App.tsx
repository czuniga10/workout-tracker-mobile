import { Routes, Route, Navigate } from "react-router-dom";
import { CalendarRoute } from "./routes/CalendarRoute";
import { WorkoutDayRoute } from "./routes/WorkoutDayRoute";
import { useUser } from "./hooks/useUser";
import { UserDropdown } from "./components/UserDropdown";
import { format } from "date-fns";

export function App() {
  const { userId, isLoading } = useUser();
  if (isLoading) return null;
  if (!userId) return <UserDropdown />;

  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <Routes>
      <Route path="/" element={<CalendarRoute />} />
      <Route path="/workout/:date" element={<WorkoutDayRoute />} />
      <Route path="*" element={<Navigate to={`/workout/${today}`} replace />} />
    </Routes>
  );
}
