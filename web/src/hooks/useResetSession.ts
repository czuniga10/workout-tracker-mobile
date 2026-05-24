import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import { monthOf } from "../lib/dates";
import { useUser } from "./useUser";
import type { CalendarResponse } from "../api/types";

export function useResetSession(date: string) {
  const qc = useQueryClient();
  const { userId } = useUser();

  return useMutation({
    mutationFn: () =>
      api(`/sessions/${date}/reset`, { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["session", userId, date] });

      const month = monthOf(date);
      qc.setQueryData<CalendarResponse>(
        ["calendar", userId, month],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            days: old.days.map((d) =>
              d.date === date ? { ...d, status: "scheduled" as const } : d
            ),
          };
        }
      );
    },
  });
}
