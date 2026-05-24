import type { Schedule } from "../../types";

export const chelseaSchedule: Schedule = {
  id: "chelsea",
  userId: "chelsea",
  days: {
    monday:    { workoutId: "chelsea-lower-body", label: "Lower Body" },
    tuesday:   { workoutId: "chelsea-upper-core", label: "Upper + Core" },
    wednesday: { workoutId: "chelsea-pilates",    label: "Pilates" },
    thursday:  { workoutId: "chelsea-full-body",  label: "Full Body" },
    friday:    { workoutId: "chelsea-booty-abs",  label: "Booty + Abs" },
    saturday:  { workoutId: null,             label: "Rest" },
    sunday:    { workoutId: null,             label: "Rest" },
  },
};
