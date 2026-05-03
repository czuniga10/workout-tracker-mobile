import { useState, useEffect, type ReactNode } from "react";
import { UserContext } from "../hooks/useUser";

const STORAGE_KEY = "workoutTracker.userId";

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUserIdState(localStorage.getItem(STORAGE_KEY));
    setIsLoading(false);
  }, []);

  function setUser(id: string) {
    localStorage.setItem(STORAGE_KEY, id);
    setUserIdState(id);
  }

  function clearUser() {
    localStorage.removeItem(STORAGE_KEY);
    setUserIdState(null);
  }

  return (
    <UserContext.Provider value={{ userId, setUser, clearUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}
