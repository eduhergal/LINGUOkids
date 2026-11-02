import { v4 as uuid } from 'uuid';
import { db } from '@/db/database';
import type { Child, Locale, ThemeId } from '@/types';

export async function createChild(
  name: string,
  age: number,
  locale: Locale,
  avatarId?: string,
  themeId?: ThemeId,
): Promise<Child> {
  const child: Child = {
    id: uuid(),
    name,
    age,
    avatarId: avatarId ?? `avatar-${Math.floor(Math.random() * 8) + 1}`,
    locale,
    themeId: themeId ?? 'forest',
    createdAt: new Date(),
  };
  await db.children.add(child);
  return child;
}

export async function getChildren(): Promise<Child[]> {
  return db.children.toArray();
}

export async function getChild(id: string): Promise<Child | undefined> {
  return db.children.get(id);
}

export async function updateChild(
  id: string,
  partial: Partial<Omit<Child, 'id' | 'createdAt'>>,
): Promise<void> {
  await db.children.update(id, partial);
}

export async function deleteChild(id: string): Promise<void> {
  await db.transaction('rw', [db.children, db.activityProgress, db.lessonProgress, db.weeklyGoals, db.customWords], async () => {
    await db.activityProgress.where('childId').equals(id).delete();
    await db.lessonProgress.where('childId').equals(id).delete();
    await db.weeklyGoals.where('childId').equals(id).delete();
    await db.customWords.where('childId').equals(id).delete();
    await db.children.delete(id);
  });
}
