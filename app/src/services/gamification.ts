import { v4 as uuid } from 'uuid';
import { db } from '@/db/database';
import type { WeeklyGoal } from '@/types';

function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}

export async function getOrCreateWeeklyGoal(
  childId: string,
  target = 15,
): Promise<WeeklyGoal> {
  const weekStart = getWeekStart();
  const existing = await db.weeklyGoals
    .where('[childId+weekStartDate]')
    .equals([childId, weekStart])
    .first();

  if (existing) return existing;

  const previousWeeks = await db.weeklyGoals
    .where('childId')
    .equals(childId)
    .sortBy('weekStartDate');

  let streakWeeks = 0;
  for (let i = previousWeeks.length - 1; i >= 0; i--) {
    if (previousWeeks[i].achieved) streakWeeks++;
    else break;
  }

  const goal: WeeklyGoal = {
    id: uuid(),
    childId,
    weekStartDate: weekStart,
    targetActivities: target,
    completedActivities: 0,
    streakWeeks,
    achieved: false,
  };
  await db.weeklyGoals.add(goal);
  return goal;
}

export async function incrementWeeklyGoal(childId: string): Promise<WeeklyGoal> {
  const goal = await getOrCreateWeeklyGoal(childId);
  goal.completedActivities += 1;
  goal.achieved = goal.completedActivities >= goal.targetActivities;

  if (goal.achieved) {
    goal.streakWeeks += 1;
  }

  await db.weeklyGoals.put(goal);
  return goal;
}

export async function getStreak(childId: string): Promise<number> {
  const goal = await getOrCreateWeeklyGoal(childId);
  return goal.streakWeeks;
}
