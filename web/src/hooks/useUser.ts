import { createContext, useContext } from "react";

export interface UserContextValue {
  userId: string | null;
  setUser: (id: string) => void;
  clearUser: () => void;
  isLoading: boolean;
}

export const UserContext = createContext<UserContextValue | null>(null);

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
