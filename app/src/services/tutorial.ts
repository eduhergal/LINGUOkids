import { v4 as uuid } from 'uuid';
import { db } from '@/db/database';
import type { ActivityType } from '@/types';

export async function hasSeen(childId: string, activityType: ActivityType): Promise<boolean> {
  const count = await db.tutorialSeen
    .where('[childId+activityType]')
    .equals([childId, activityType])
    .count();
  return count > 0;
}

export async function markSeen(childId: string, activityType: ActivityType): Promise<void> {
  await db.tutorialSeen.add({
    id: uuid(),
    childId,
    activityType,
    seenAt: new Date(),
  });
}

export interface TutorialStep {
  emoji: string;
  text: { en: string; es: string };
}

const tutorialSteps: Record<string, TutorialStep[]> = {
  phonics_trace: [
    { emoji: '👆', text: { en: 'Follow the dotted line with your finger!', es: '¡Sigue la línea punteada con tu dedo!' } },
    { emoji: '✨', text: { en: 'Trace the whole letter to finish!', es: '¡Traza toda la letra para terminar!' } },
  ],
  phonics_identify: [
    { emoji: '👀', text: { en: 'Look at the letter at the top', es: 'Mira la letra de arriba' } },
    { emoji: '👆', text: { en: 'Tap the matching letter below!', es: '¡Toca la letra igual abajo!' } },
  ],
  matching: [
    { emoji: '🔗', text: { en: 'Match each picture with its word!', es: '¡Une cada imagen con su palabra!' } },
    { emoji: '👆', text: { en: 'Tap a picture, then tap its word', es: 'Toca una imagen, luego toca su palabra' } },
  ],
  memory_cards: [
    { emoji: '🃏', text: { en: 'Find the matching pairs!', es: '¡Encuentra las parejas!' } },
    { emoji: '🧠', text: { en: 'Remember where each card is', es: 'Recuerda dónde está cada carta' } },
  ],
  coloring: [
    { emoji: '🎨', text: { en: 'Pick a color from below', es: 'Elige un color de abajo' } },
    { emoji: '👆', text: { en: 'Tap the shape to color it!', es: '¡Toca la forma para colorearla!' } },
  ],
  drag_and_drop: [
    { emoji: '👆', text: { en: 'Hold and drag each item', es: 'Mantén pulsado y arrastra cada item' } },
    { emoji: '🎯', text: { en: 'Drop it in the right box!', es: '¡Suéltalo en la caja correcta!' } },
  ],
  word_builder: [
    { emoji: '🧩', text: { en: 'Look at the picture for a clue', es: 'Mira la imagen para una pista' } },
    { emoji: '🔤', text: { en: 'Tap the letters in order!', es: '¡Toca las letras en orden!' } },
  ],
  i_spy: [
    { emoji: '🔍', text: { en: 'Find the hidden letters!', es: '¡Encuentra las letras escondidas!' } },
    { emoji: '👆', text: { en: 'Tap each one when you spot it', es: 'Toca cada una cuando la veas' } },
  ],
  show_and_tell: [
    { emoji: '🔊', text: { en: 'Look at each picture', es: 'Mira cada imagen' } },
    { emoji: '👆', text: { en: 'Tap to hear the word!', es: '¡Toca para escuchar la palabra!' } },
  ],
  sorting: [
    { emoji: '📊', text: { en: 'Put these in the right order!', es: '¡Ponlos en el orden correcto!' } },
    { emoji: '👆', text: { en: 'Drag items to swap them', es: 'Arrastra los items para moverlos' } },
  ],
};

export function getSteps(activityType: string): TutorialStep[] {
  return tutorialSteps[activityType] ?? [];
}
