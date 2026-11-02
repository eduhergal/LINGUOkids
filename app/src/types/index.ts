export interface I18nString {
  en: string;
  es: string;
}

export type Locale = 'en' | 'es';

export type ActivityType =
  | 'phonics_trace'
  | 'phonics_identify'
  | 'matching'
  | 'memory_cards'
  | 'coloring'
  | 'drag_and_drop'
  | 'word_builder'
  | 'i_spy'
  | 'show_and_tell'
  | 'sorting'
  | 'piano'
  | 'counting'
  | 'comparison'
  | 'math_ops'
  | 'story'
  | 'free_write';

export type ThemeId = 'forest' | 'space' | 'garden';

export interface Child {
  id: string;
  name: string;
  age: number;
  avatarId: string;
  locale: Locale;
  themeId: ThemeId;
  createdAt: Date;
}

export interface ActivityProgress {
  id: string;
  childId: string;
  activityId: string;
  completedAt: Date;
  score: number;
  timeSpentMs: number;
  attempts: number;
  data?: Record<string, unknown>;
}

export interface LessonProgress {
  id: string;
  childId: string;
  lessonId: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  activitiesCompleted: number;
  activitiesTotal: number;
  unlockedAt?: Date;
  completedAt?: Date;
}

export interface WeeklyGoal {
  id: string;
  childId: string;
  weekStartDate: string;
  targetActivities: number;
  completedActivities: number;
  streakWeeks: number;
  achieved: boolean;
}

export interface Settings {
  id: 'global';
  parentPin: string;
  screenTimeLimitMinutes: number;
  locale: Locale;
  darkMode: boolean;
  audioSpeed: 'slow' | 'normal' | 'fast';
  soundEffects: boolean;
  backgroundMusic: boolean;
  defaultThemeId: ThemeId;
}

export interface CustomWord {
  id: string;
  childId: string;
  word: string;
  translation?: string;
  imageUrl?: string;
  audioUrl?: string;
  topicId: string;
  createdAt: Date;
}

export interface World {
  id: string;
  name: I18nString;
  color: string;
  icon: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  worldId: string;
  name: I18nString;
  description: I18nString;
  thumbnailPath: string;
  units: Unit[];
}

export interface Unit {
  id: string;
  topicId: string;
  name: I18nString;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  unitId: string;
  name: I18nString;
  order: number;
  activities: ActivityRef[];
  prerequisiteLessonId?: string;
}

export interface ActivityRef {
  activityId: string;
  order: number;
  required: boolean;
}

export interface ActivityDef {
  id: string;
  type: ActivityType;
  name: I18nString;
  instructions: I18nString;
  instructionAudioPath: string;
  difficulty: 1 | 2 | 3;
  estimatedTimeSeconds: number;
  config: Record<string, unknown>;
}

export interface Favorite {
  id: string;
  childId: string;
  activityId: string;
  addedAt: Date;
}

export interface TutorialSeen {
  id: string;
  childId: string;
  activityType: ActivityType;
  seenAt: Date;
}
