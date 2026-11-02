import type { I18nString } from '@/types';

export type ThemeId = 'forest' | 'space' | 'garden';

export interface ThemeDef {
  id: ThemeId;
  name: I18nString;
  mascot: {
    emoji: string;
    name: I18nString;
  };
  progressLabel: I18nString;
  encouragements: I18nString[];
  navLabels: {
    home: I18nString;
    lessons: I18nString;
    favorites: I18nString;
    parents: I18nString;
  };
  navIcons: {
    home: string;
    lessons: string;
    favorites: string;
    parents: string;
  };
  colors: {
    gradientStart: string;
    gradientMid: string;
    gradientEnd: string;
    primary: string;
    accent: string;
    navBg: string;
    navActive: string;
    cardBg: string;
    textOnGradient: string;
    progressFillStart: string;
    progressFillEnd: string;
    letterColor: string;
  };
}

export const themes: Record<ThemeId, ThemeDef> = {
  forest: {
    id: 'forest',
    name: { en: 'Magic Forest', es: 'Bosque Mágico' },
    mascot: {
      emoji: '🦉',
      name: { en: 'Sabi the Owl', es: 'Búho Sabi' },
    },
    progressLabel: { en: 'fruits', es: 'frutos' },
    encouragements: [
      { en: 'Great job! Keep going!', es: '¡Muy bien! ¡Sigue así!' },
      { en: 'You can do it!', es: '¡Tú puedes!' },
      { en: "That's amazing!", es: '¡Increíble!' },
      { en: 'Wonderful!', es: '¡Maravilloso!' },
      { en: "Sabi is proud of you!", es: '¡Sabi está orgulloso de ti!' },
    ],
    navLabels: {
      home: { en: 'Home', es: 'Inicio' },
      lessons: { en: 'Learn', es: 'Aprender' },
      favorites: { en: 'Favorites', es: 'Favoritos' },
      parents: { en: 'Parents', es: 'Padres' },
    },
    navIcons: { home: '🏠', lessons: '📚', favorites: '⭐', parents: '👤' },
    colors: {
      gradientStart: '#1a4a2e',
      gradientMid: '#2d7a4f',
      gradientEnd: '#8bc34a',
      primary: '#4caf50',
      accent: '#ffeb3b',
      navBg: 'rgba(26,74,46,0.95)',
      navActive: '#8bc34a',
      cardBg: 'rgba(255,255,255,0.2)',
      textOnGradient: '#ffffff',
      progressFillStart: '#4caf50',
      progressFillEnd: '#8bc34a',
      letterColor: '#2d7a4f',
    },
  },
  space: {
    id: 'space',
    name: { en: 'Cosmic Adventure', es: 'Aventura Cósmica' },
    mascot: {
      emoji: '👾',
      name: { en: 'Zip the Alien', es: 'Alien Zip' },
    },
    progressLabel: { en: 'XP', es: 'XP' },
    encouragements: [
      { en: 'Mission progress!', es: '¡Avance de misión!' },
      { en: 'Energy charged!', es: '¡Energía cargada!' },
      { en: 'To the stars!', es: '¡Hacia las estrellas!' },
      { en: 'Cosmic power!', es: '¡Poder cósmico!' },
      { en: 'Zip is impressed!', es: '¡Zip está impresionado!' },
    ],
    navLabels: {
      home: { en: 'Base', es: 'Base' },
      lessons: { en: 'Missions', es: 'Misiones' },
      favorites: { en: 'Achievements', es: 'Logros' },
      parents: { en: 'Parents', es: 'Padres' },
    },
    navIcons: { home: '🚀', lessons: '🗺️', favorites: '⭐', parents: '👤' },
    colors: {
      gradientStart: '#0d0b2e',
      gradientMid: '#1a1654',
      gradientEnd: '#2a2080',
      primary: '#7c4dff',
      accent: '#ff6d00',
      navBg: 'rgba(13,11,46,0.95)',
      navActive: '#b388ff',
      cardBg: 'rgba(255,255,255,0.08)',
      textOnGradient: '#ffffff',
      progressFillStart: '#7c4dff',
      progressFillEnd: '#536dfe',
      letterColor: '#b388ff',
    },
  },
  garden: {
    id: 'garden',
    name: { en: 'Enchanted Garden', es: 'Jardín Encantado' },
    mascot: {
      emoji: '🦋',
      name: { en: 'Lila the Butterfly', es: 'Mariposa Lila' },
    },
    progressLabel: { en: 'petals', es: 'pétalos' },
    encouragements: [
      { en: 'Beautiful!', es: '¡Precioso!' },
      { en: 'You are blooming!', es: '¡Estás floreciendo!' },
      { en: "That's lovely!", es: '¡Qué bonito!' },
      { en: 'Keep growing!', es: '¡Sigue creciendo!' },
      { en: 'Lila loves it!', es: '¡A Lila le encanta!' },
    ],
    navLabels: {
      home: { en: 'Garden', es: 'Jardín' },
      lessons: { en: 'Grow', es: 'Crecer' },
      favorites: { en: 'Favorites', es: 'Favoritos' },
      parents: { en: 'Parents', es: 'Padres' },
    },
    navIcons: { home: '🏡', lessons: '🌱', favorites: '💖', parents: '👤' },
    colors: {
      gradientStart: '#fce4ec',
      gradientMid: '#f8bbd0',
      gradientEnd: '#f48fb1',
      primary: '#e91e63',
      accent: '#ffeb3b',
      navBg: 'rgba(74,25,66,0.92)',
      navActive: '#f48fb1',
      cardBg: 'rgba(255,255,255,0.35)',
      textOnGradient: '#4a1942',
      progressFillStart: '#e91e63',
      progressFillEnd: '#f06292',
      letterColor: '#e91e63',
    },
  },
};

export function getTheme(id: ThemeId): ThemeDef {
  return themes[id];
}

export const themeIds: ThemeId[] = ['forest', 'space', 'garden'];
