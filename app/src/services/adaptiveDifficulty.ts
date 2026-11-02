import { db } from '@/db/database';

export type DifficultyLevel = 1 | 2 | 3;

export async function getAdaptiveDifficulty(
  childId: string,
  activityType: string,
): Promise<DifficultyLevel> {
  const recent = await db.activityProgress
    .where('childId')
    .equals(childId)
    .reverse()
    .sortBy('completedAt');

  const typeActivities = recent.slice(0, 10);

  if (typeActivities.length < 3) return 1;

  const avgScore =
    typeActivities.reduce((sum, a) => sum + a.score, 0) / typeActivities.length;

  if (avgScore >= 2.5) return 3;
  if (avgScore >= 1.5) return 2;
  return 1;
}

export function getConstructiveMessage(
  isCorrect: boolean,
  locale: 'en' | 'es',
): string {
  if (isCorrect) {
    const msgs = locale === 'es'
      ? ['¡Perfecto!', '¡Genial!', '¡Así se hace!', '¡Correcto!']
      : ['Perfect!', 'Great!', 'Way to go!', 'Correct!'];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }

  const msgs = locale === 'es'
    ? ['¡Casi! Prueba otra vez', '¡Muy cerca! Inténtalo de nuevo', '¡No pasa nada! Vuelve a intentar']
    : ['Almost! Try again', 'So close! Try once more', "That's OK! Give it another try"];
  return msgs[Math.floor(Math.random() * msgs.length)];
}
