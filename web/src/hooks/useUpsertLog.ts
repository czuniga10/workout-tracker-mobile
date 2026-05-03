import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import { monthOf } from "../lib/dates";

interface LogPayload {
  date: string;
  blockId: string;
  exerciseId: string;
  roundNumber: number;
  weight?: string | null;
  reps?: number | null;
  durationSec?: number | null;
}

export function useUpsertLog(date: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: LogPayload) =>
      api("/logs", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["session", date] });
      qc.invalidateQueries({ queryKey: ["calendar", monthOf(date)] });
    },
  });
}
