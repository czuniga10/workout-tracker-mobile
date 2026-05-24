import type { Workout } from "../../types";
import { upperA } from "./upper-a";
import { upperB } from "./upper-b";
import { lowerA } from "./lower-a";
import { conditioningA } from "./conditioning-a";
import { chelseaUpper1 } from "./chelsea-upper-1";
import { chelseaUpper2 } from "./chelsea-upper-2";
import { chelseaLower } from "./chelsea-lower";
import { chelseaConditioning } from "./chelsea-conditioning";
import { chelseaLowerBody } from "./chelsea-lower-body";
import { chelseaUpperCore } from "./chelsea-upper-core";
import { chelseaPilates } from "./chelsea-pilates";
import { chelseaFullBody } from "./chelsea-full-body";
import { chelseaBootyAbs } from "./chelsea-booty-abs";
import { abCircuit } from "./ab-circuit";

export const workouts: Record<string, Workout> = {
  "upper-1":          upperB,
  "upper-2":          upperA,
  "lower":            lowerA,
  "hiit-plus":        conditioningA,
  "ab-circuit":       abCircuit,
  "chelsea-upper-1":    chelseaUpper1,
  "chelsea-upper-2":    chelseaUpper2,
  "chelsea-lower":      chelseaLower,
  "chelsea-hiit-plus":  chelseaConditioning,
  "chelsea-lower-body": chelseaLowerBody,
  "chelsea-upper-core": chelseaUpperCore,
  "chelsea-pilates":    chelseaPilates,
  "chelsea-full-body":  chelseaFullBody,
  "chelsea-booty-abs":  chelseaBootyAbs,
};

export function getWorkout(id: string) {
  const w = workouts[id];
  if (!w) throw new Error(`Unknown workout: ${id}`);
  return w;
}
