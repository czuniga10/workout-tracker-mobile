import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";

export function useUpdateNotes(date: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (notes: string) =>
      api(`/sessions/${date}/notes`, {
        method: "PUT",
        body: JSON.stringify({ notes }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["session", date] });
    },
  });
}
