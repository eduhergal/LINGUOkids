import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '@/db/database';
import { recordActivity, getChildProgress, getActivityBest } from './progress';

describe('progress', () => {
  beforeEach(async () => {
    await db.activityProgress.clear();
  });

  it('records an activity completion', async () => {
    const record = await recordActivity('child-1', 'trace-a', 3, 5000, 1);
    expect(record.childId).toBe('child-1');
    expect(record.activityId).toBe('trace-a');
    expect(record.score).toBe(3);
  });

  it('retrieves all progress for a child', async () => {
    await recordActivity('child-1', 'trace-a', 2, 3000, 1);
    await recordActivity('child-1', 'trace-b', 3, 4000, 1);
    await recordActivity('child-2', 'trace-a', 1, 2000, 2);

    const progress = await getChildProgress('child-1');
    expect(progress).toHaveLength(2);
  });

  it('returns best score for activity', async () => {
    await recordActivity('child-1', 'trace-a', 1, 3000, 3);
    await recordActivity('child-1', 'trace-a', 3, 2000, 1);
    await recordActivity('child-1', 'trace-a', 2, 2500, 2);

    const best = await getActivityBest('child-1', 'trace-a');
    expect(best?.score).toBe(3);
  });

  it('returns undefined for no progress', async () => {
    const best = await getActivityBest('child-1', 'nonexistent');
    expect(best).toBeUndefined();
  });
});
