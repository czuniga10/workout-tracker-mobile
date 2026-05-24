export interface ApiUser {
  id: string;
  name: string;
  initial: string;
}

export type ExerciseType = "weighted" | "bodyweight" | "timed";

export interface ApiExercise {
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

export interface RoundData {
  roundNumber: number;
  logged: {
    weight: string | null;
    reps: number | null;
    durationSec: number | null;
  } | null;
  prefill: {
    weight: string | null;
    reps: number | null;
    durationSec: number | null;
  };
}

export interface HydratedExercise {
  exercise: ApiExercise;
  target: ExerciseTarget;
  notes?: string;
  rounds: RoundData[];
}

export type BlockType = "superset" | "straight_set" | "conditioning_circuit" | "warmup";

export interface HydratedBlock {
  id: string;
  type: BlockType;
  rounds: number;
  restSeconds: number;
  priority?: string;
  exercises: HydratedExercise[];
}

export interface HydratedWorkout {
  id: string;
  name: string;
  focus: string;
  notes: string;
  blocks: HydratedBlock[];
  burnout?: { name: string; description: string };
}

export interface ApiSession {
  id: string;
  userId: string;
  date: string;
  workoutId: string;
  status: "scheduled" | "in_progress" | "complete";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type SessionResponse =
  | { kind: "rest"; date: string }
  | { kind: "workout"; session: ApiSession; workout: HydratedWorkout };

export interface CalendarDay {
  date: string;
  kind: "workout" | "rest";
  workoutId?: string;
  label?: string;
  status?: "scheduled" | "in_progress" | "complete";
}

export interface CalendarResponse {
  month: string;
  days: CalendarDay[];
}

export interface ScheduleDay {
  workoutId: string | null;
  label: string;
}

export interface ScheduleResponse {
  userId: string;
  days: Record<string, ScheduleDay>;
}
