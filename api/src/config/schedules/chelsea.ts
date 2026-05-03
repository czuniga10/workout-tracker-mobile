import type { Schedule } from "../../types";

export const chelseaSchedule: Schedule = {
  id: "chelsea",
  userId: "chelsea",
  days: {
    monday:    { workoutId: "chelsea-upper-1",   label: "Upper 1" },
    tuesday:   { workoutId: "chelsea-lower",     label: "Lower" },
    wednesday: { workoutId: null,                label: "Rest" },
    thursday:  { workoutId: "chelsea-upper-2",   label: "Upper 2" },
    friday:    { workoutId: "chelsea-hiit-plus", label: "HIIT +" },
    saturday:  { workoutId: null,             label: "Rest" },
    sunday:    { workoutId: null,             label: "Rest" },
  },
};
