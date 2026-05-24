import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import { useUser } from "./useUser";

export function useUpdateNotes(date: string) {
  const qc = useQueryClient();
  const { userId } = useUser();

  return useMutation({
    mutationFn: (notes: string) =>
      api(`/sessions/${date}/notes`, {
        method: "PUT",
        body: JSON.stringify({ notes }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["session", userId, date] });
    },
  });
}
