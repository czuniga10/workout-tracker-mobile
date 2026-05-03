import type { Workout } from "../../types";
import { upperA } from "./upper-a";
import { upperB } from "./upper-b";
import { lowerA } from "./lower-a";
import { conditioningA } from "./conditioning-a";
import { chelseaUpper1 } from "./chelsea-upper-1";
import { chelseaUpper2 } from "./chelsea-upper-2";
import { chelseaLower } from "./chelsea-lower";
import { chelseaConditioning } from "./chelsea-conditioning";

export const workouts: Record<string, Workout> = {
  "upper-1":          upperB,
  "upper-2":          upperA,
  "lower":            lowerA,
  "hiit-plus":        conditioningA,
  "chelsea-upper-1":  chelseaUpper1,
  "chelsea-upper-2":  chelseaUpper2,
  "chelsea-lower":    chelseaLower,
  "chelsea-hiit-plus": chelseaConditioning,
};

export function getWorkout(id: string) {
  const w = workouts[id];
  if (!w) throw new Error(`Unknown workout: ${id}`);
  return w;
}
