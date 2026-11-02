import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '@/db/database';
import { getOrCreateWeeklyGoal, incrementWeeklyGoal, getStreak } from './gamification';

describe('gamification', () => {
  beforeEach(async () => {
    await db.weeklyGoals.clear();
  });

  it('creates a weekly goal if none exists', async () => {
    const goal = await getOrCreateWeeklyGoal('child-1');
    expect(goal.childId).toBe('child-1');
    expect(goal.targetActivities).toBe(15);
    expect(goal.completedActivities).toBe(0);
    expect(goal.achieved).toBe(false);
  });

  it('returns existing goal on second call', async () => {
    const first = await getOrCreateWeeklyGoal('child-1');
    const second = await getOrCreateWeeklyGoal('child-1');
    expect(first.id).toBe(second.id);
  });

  it('increments completed activities', async () => {
    await getOrCreateWeeklyGoal('child-1', 3);
    const updated = await incrementWeeklyGoal('child-1');
    expect(updated.completedActivities).toBe(1);
    expect(updated.achieved).toBe(false);
  });

  it('marks goal as achieved when target is reached', async () => {
    await getOrCreateWeeklyGoal('child-1', 2);
    await incrementWeeklyGoal('child-1');
    const final = await incrementWeeklyGoal('child-1');
    expect(final.achieved).toBe(true);
    expect(final.streakWeeks).toBe(1);
  });

  it('returns 0 streak for new child', async () => {
    const streak = await getStreak('new-child');
    expect(streak).toBe(0);
  });
});
