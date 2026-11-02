import { v4 as uuid } from 'uuid';
import { db } from '@/db/database';
import type { Favorite } from '@/types';

export async function getFavorites(childId: string): Promise<Favorite[]> {
  return db.favorites.where('childId').equals(childId).toArray();
}

export async function isFavorite(childId: string, activityId: string): Promise<boolean> {
  const count = await db.favorites
    .where('[childId+activityId]')
    .equals([childId, activityId])
    .count();
  return count > 0;
}

export async function toggleFavorite(childId: string, activityId: string): Promise<boolean> {
  const existing = await db.favorites
    .where('[childId+activityId]')
    .equals([childId, activityId])
    .first();

  if (existing) {
    await db.favorites.delete(existing.id);
    return false;
  }

  await db.favorites.add({
    id: uuid(),
    childId,
    activityId,
    addedAt: new Date(),
  });
  return true;
}
