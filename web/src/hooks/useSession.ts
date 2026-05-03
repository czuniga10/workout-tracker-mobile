import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import { useUser } from "./useUser";
import type { SessionResponse } from "../api/types";

export function useSession(date: string) {
  const { userId } = useUser();
  return useQuery({
    queryKey: ["session", userId, date],
    queryFn: () => api<SessionResponse>(`/sessions/${date}`),
    enabled: !!date && !!userId,
  });
}
