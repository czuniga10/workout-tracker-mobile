import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import type { ApiUser } from "../api/types";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => api<ApiUser[]>("/users"),
  });
}
