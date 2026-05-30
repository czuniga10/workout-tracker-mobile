-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('scheduled', 'in_progress', 'complete');

-- CreateTable
CREATE TABLE "WorkoutSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'scheduled',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkoutSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseLog" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "weight" DECIMAL(6,2),
    "reps" INTEGER,
    "durationSec" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExerciseLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkoutSession_userId_workoutId_idx" ON "WorkoutSession"("userId", "workoutId");

-- CreateIndex
CREATE INDEX "WorkoutSession_userId_status_idx" ON "WorkoutSession"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutSession_userId_date_key" ON "WorkoutSession"("userId", "date");

-- CreateIndex
CREATE INDEX "ExerciseLog_sessionId_idx" ON "ExerciseLog"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseLog_sessionId_blockId_exerciseId_roundNumber_key" ON "ExerciseLog"("sessionId", "blockId", "exerciseId", "roundNumber");

-- AddForeignKey
ALTER TABLE "ExerciseLog" ADD CONSTRAINT "ExerciseLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WorkoutSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
