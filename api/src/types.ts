export type ExerciseType = "weighted" | "bodyweight" | "timed";

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  type: ExerciseType;
  equipment: string;
  gifId: string | null;
  gifUrl?: string;
  instructions?: string[];
  description?: string;
}

export type ExerciseTarget =
  | { type: "reps"; value: number; perSide?: boolean }
  | { type: "reps"; min: number; max: number; perSide?: boolean }
  | { type: "time"; seconds: number }
  | { type: "time"; minSeconds: number; maxSeconds: number };

export interface BlockExercise {
  exerciseId: string;
  target: ExerciseTarget;
  notes?: string;
}

export type BlockType = "superset" | "straight_set" | "conditioning_circuit" | "warmup";

export interface Block {
  id: string;
  type: BlockType;
  rounds: number;
  restSeconds: number;
  priority?: string;
  exercises: BlockExercise[];
}

export interface Burnout {
  name: string;
  description: string;
}

export interface Workout {
  id: string;
  name: string;
  focus: string;
  notes: string;
  blocks: Block[];
  burnout?: Burnout;
}

export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface ScheduleDay {
  workoutId: string | null;
  label: string;
}

export interface Schedule {
  id: string;
  userId: string;
  days: Record<DayOfWeek, ScheduleDay>;
}

export interface User {
  id: string;
  name: string;
  initial: string;
  scheduleId: string;
}
