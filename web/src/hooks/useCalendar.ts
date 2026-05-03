import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import { useUser } from "./useUser";
import type { CalendarResponse } from "../api/types";

export function useCalendar(month: string) {
  const { userId } = useUser();
  return useQuery({
    queryKey: ["calendar", userId, month],
    queryFn: () => api<CalendarResponse>(`/calendar?month=${month}`),
    enabled: !!month && !!userId,
  });
}
