import type { Schedule } from "../../types";

export const chadSchedule: Schedule = {
  id: "chad",
  userId: "chad",
  days: {
    monday:    { workoutId: "upper-1",  label: "Upper 1" },
    tuesday:   { workoutId: "ab-circuit", label: "Ab Circuit" },
    wednesday: { workoutId: "lower",    label: "Lower" },
    thursday:  { workoutId: "upper-2",  label: "Upper 2" },
    friday:    { workoutId: "hiit-plus", label: "HIIT +" },
    saturday:  { workoutId: null,             label: "Rest" },
    sunday:    { workoutId: null,             label: "Rest" },
  },
};
