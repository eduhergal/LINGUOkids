import Dexie from 'dexie';
import type { Table } from 'dexie';
import type {
  Child,
  ActivityProgress,
  LessonProgress,
  WeeklyGoal,
  Settings,
  CustomWord,
  Favorite,
  TutorialSeen,
} from '@/types';

class LinguoDatabase extends Dexie {
  children!: Table<Child, string>;
  activityProgress!: Table<ActivityProgress, string>;
  lessonProgress!: Table<LessonProgress, string>;
  weeklyGoals!: Table<WeeklyGoal, string>;
  settings!: Table<Settings, string>;
  customWords!: Table<CustomWord, string>;
  favorites!: Table<Favorite, string>;
  tutorialSeen!: Table<TutorialSeen, string>;

  constructor() {
    super('linguokids');

    this.version(1).stores({
      children: 'id, name',
      activityProgress: 'id, childId, activityId, completedAt, [childId+activityId]',
      lessonProgress: 'id, childId, lessonId, status, [childId+lessonId]',
      weeklyGoals: 'id, childId, weekStartDate, [childId+weekStartDate]',
      settings: 'id',
      customWords: 'id, childId, topicId',
      favorites: 'id, childId, activityId, [childId+activityId]',
    });

    this.version(2).stores({}).upgrade((tx) => {
      tx.table('children').toCollection().modify((child) => {
        if (!child.themeId) child.themeId = 'forest';
      });
      tx.table('settings').toCollection().modify((s) => {
        if (!s.defaultThemeId) s.defaultThemeId = 'forest';
      });
    });

    this.version(3).stores({
      tutorialSeen: 'id, [childId+activityType]',
    });
  }
}

export const db = new LinguoDatabase();

export async function getSettings(): Promise<Settings> {
  const existing = await db.settings.get('global');
  if (existing) return existing;

  const defaults: Settings = {
    id: 'global',
    parentPin: '',
    screenTimeLimitMinutes: 30,
    locale: 'es',
    darkMode: false,
    audioSpeed: 'normal',
    soundEffects: true,
    backgroundMusic: true,
    defaultThemeId: 'forest',
  };
  await db.settings.put(defaults);
  return defaults;
}

export async function updateSettings(
  partial: Partial<Omit<Settings, 'id'>>,
): Promise<void> {
  await db.settings.update('global', partial);
}
