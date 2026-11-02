import { v4 as uuid } from 'uuid';
import { db } from '@/db/database';
import type { ActivityProgress } from '@/types';

export async function recordActivity(
  childId: string,
  activityId: string,
  score: number,
  timeSpentMs: number,
  attempts: number,
  data?: Record<string, unknown>,
): Promise<ActivityProgress> {
  const record: ActivityProgress = {
    id: uuid(),
    childId,
    activityId,
    completedAt: new Date(),
    score,
    timeSpentMs,
    attempts,
    data,
  };
  await db.activityProgress.add(record);
  return record;
}

export async function getChildProgress(childId: string): Promise<ActivityProgress[]> {
  return db.activityProgress.where('childId').equals(childId).toArray();
}

export async function getActivityBest(
  childId: string,
  activityId: string,
): Promise<ActivityProgress | undefined> {
  const records = await db.activityProgress
    .where('[childId+activityId]')
    .equals([childId, activityId])
    .toArray();
  return records.sort((a, b) => b.score - a.score)[0];
}

export async function getWeekActivities(childId: string): Promise<ActivityProgress[]> {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  return db.activityProgress
    .where('childId')
    .equals(childId)
    .filter((p) => p.completedAt >= monday)
    .toArray();
}

export async function getTotalTimeThisWeek(childId: string): Promise<number> {
  const activities = await getWeekActivities(childId);
  return activities.reduce((sum, a) => sum + a.timeSpentMs, 0);
}
