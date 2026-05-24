export function resolveGifUrl(exercise: { gifId: string | null; gifUrl?: string }): string | null {
  if (exercise.gifUrl) return exercise.gifUrl;
  if (exercise.gifId) return `/api/gifs/${exercise.gifId}`;
  return null;
}
