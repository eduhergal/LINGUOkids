import type { World, ActivityDef } from '@/types';

// --- SVG paths for letter tracing ---
const LETTER_PATHS: Record<string, string> = {
  A: 'M 20 80 L 50 20 L 80 80 M 32 55 L 68 55',
  B: 'M 25 20 L 25 80 M 25 20 Q 70 20 70 50 Q 70 80 25 80 M 25 50 Q 65 50 65 50',
  C: 'M 75 30 Q 20 10 20 50 Q 20 90 75 70',
  D: 'M 25 20 L 25 80 M 25 20 Q 80 20 80 50 Q 80 80 25 80',
  E: 'M 70 20 L 25 20 L 25 80 L 70 80 M 25 50 L 60 50',
  F: 'M 70 20 L 25 20 L 25 80 M 25 50 L 55 50',
  G: 'M 75 30 Q 20 10 20 50 Q 20 90 75 70 L 75 50 L 55 50',
  H: 'M 25 20 L 25 80 M 75 20 L 75 80 M 25 50 L 75 50',
  I: 'M 35 20 L 65 20 M 50 20 L 50 80 M 35 80 L 65 80',
  J: 'M 35 20 L 75 20 M 60 20 L 60 65 Q 60 80 45 80 Q 30 80 25 65',
  K: 'M 25 20 L 25 80 M 70 20 L 25 50 L 70 80',
  L: 'M 25 20 L 25 80 L 70 80',
  M: 'M 15 80 L 15 20 L 50 55 L 85 20 L 85 80',
  N: 'M 20 80 L 20 20 L 80 80 L 80 20',
  O: 'M 50 20 Q 80 20 80 50 Q 80 80 50 80 Q 20 80 20 50 Q 20 20 50 20',
  P: 'M 25 80 L 25 20 Q 75 20 75 40 Q 75 55 25 55',
  Q: 'M 50 20 Q 80 20 80 50 Q 80 80 50 80 Q 20 80 20 50 Q 20 20 50 20 M 60 65 L 80 85',
  R: 'M 25 80 L 25 20 Q 75 20 75 40 Q 75 55 25 55 M 50 55 L 75 80',
  S: 'M 70 28 Q 50 15 30 28 Q 15 40 50 50 Q 85 60 70 75 Q 50 88 30 75',
  T: 'M 20 20 L 80 20 M 50 20 L 50 80',
  U: 'M 20 20 L 20 60 Q 20 80 50 80 Q 80 80 80 60 L 80 20',
  V: 'M 20 20 L 50 80 L 80 20',
  W: 'M 10 20 L 30 80 L 50 40 L 70 80 L 90 20',
  X: 'M 20 20 L 80 80 M 80 20 L 20 80',
  Y: 'M 20 20 L 50 50 L 80 20 M 50 50 L 50 80',
  Z: 'M 20 20 L 80 20 L 20 80 L 80 80',
};

const NUM_PATHS: Record<string, string> = {
  '1': 'M 40 30 L 50 20 L 50 80 M 35 80 L 65 80',
  '2': 'M 25 30 Q 25 15 50 15 Q 75 15 75 35 Q 75 50 25 80 L 75 80',
  '3': 'M 25 25 Q 50 10 70 30 Q 50 50 50 50 Q 75 55 70 75 Q 50 90 25 75',
  '4': 'M 60 80 L 60 20 L 20 60 L 80 60',
  '5': 'M 70 20 L 25 20 L 25 45 Q 50 35 70 50 Q 80 65 50 80 Q 30 85 20 70',
  '6': 'M 65 20 Q 30 20 25 50 Q 20 80 50 80 Q 75 80 75 60 Q 75 45 50 45 Q 25 45 25 60',
  '7': 'M 20 20 L 80 20 L 45 80',
  '8': 'M 50 15 Q 25 15 25 35 Q 25 50 50 50 Q 75 50 75 35 Q 75 15 50 15 M 50 50 Q 20 50 20 65 Q 20 85 50 85 Q 80 85 80 65 Q 80 50 50 50',
  '9': 'M 75 50 Q 75 20 50 20 Q 25 20 25 40 Q 25 55 50 55 Q 75 55 75 40 M 75 55 L 40 85',
  '10': 'M 25 25 L 30 20 L 30 80 M 55 20 Q 75 20 75 50 Q 75 80 55 80 Q 35 80 35 50 Q 35 20 55 20',
  '11': 'M 20 25 L 28 20 L 28 80 M 50 25 L 58 20 L 58 80',
  '12': 'M 15 25 L 22 20 L 22 80 M 40 30 Q 40 15 55 15 Q 70 15 70 35 Q 70 50 40 80 L 70 80',
  '13': 'M 15 25 L 22 20 L 22 80 M 40 25 Q 55 10 70 30 Q 55 45 55 45 Q 70 55 65 75 Q 55 85 40 75',
  '14': 'M 15 25 L 22 20 L 22 80 M 60 80 L 60 20 L 38 60 L 75 60',
  '15': 'M 15 25 L 22 20 L 22 80 M 65 20 L 40 20 L 40 45 Q 55 35 70 50 Q 75 65 55 80 Q 40 85 35 70',
  '16': 'M 15 25 L 22 20 L 22 80 M 65 20 Q 40 20 38 50 Q 35 75 55 75 Q 72 75 72 60 Q 72 48 55 48 Q 38 48 38 60',
  '17': 'M 15 25 L 22 20 L 22 80 M 38 20 L 72 20 L 52 80',
  '18': 'M 15 25 L 22 20 L 22 80 M 55 15 Q 40 15 40 30 Q 40 45 55 45 Q 70 45 70 30 Q 70 15 55 15 M 55 45 Q 38 45 38 62 Q 38 80 55 80 Q 72 80 72 62 Q 72 45 55 45',
  '19': 'M 15 25 L 22 20 L 22 80 M 70 48 Q 70 20 55 20 Q 40 20 40 38 Q 40 52 55 52 Q 70 52 70 40 M 70 52 L 48 82',
  '20': 'M 15 30 Q 15 15 35 15 Q 55 15 55 35 Q 55 50 15 80 L 55 80 M 65 20 Q 85 20 85 50 Q 85 80 65 80 Q 45 80 45 50 Q 45 20 65 20',
};

// --- Letter distractors ---
function getDistractors(letter: string): string[] {
  const all = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const similar: Record<string, string[]> = {
    A: ['H', 'V', 'R'], B: ['D', 'P', 'R'], C: ['G', 'O', 'S'], D: ['B', 'O', 'P'],
    E: ['F', 'B', 'L'], F: ['E', 'T', 'P'], G: ['C', 'Q', 'O'], H: ['N', 'M', 'K'],
    I: ['L', 'T', 'J'], J: ['I', 'U', 'L'], K: ['X', 'R', 'H'], L: ['I', 'T', 'J'],
    M: ['N', 'W', 'H'], N: ['M', 'H', 'Z'], O: ['Q', 'C', 'D'], P: ['R', 'B', 'D'],
    Q: ['O', 'G', 'C'], R: ['P', 'B', 'K'], S: ['Z', 'C', '5'], T: ['I', 'L', 'F'],
    U: ['V', 'J', 'C'], V: ['U', 'W', 'A'], W: ['M', 'V', 'N'], X: ['K', 'Y', 'Z'],
    Y: ['V', 'X', 'T'], Z: ['N', 'S', 'X'],
  };
  return similar[letter] ?? all.replace(letter, '').split('').slice(0, 3);
}

// --- Helpers to generate activities ---
function traceLetter(letter: string, order: number): ActivityDef {
  const isNum = /\d/.test(letter);
  const path = isNum ? NUM_PATHS[letter] : LETTER_PATHS[letter];
  return {
    id: `trace-${letter.toLowerCase()}`,
    type: 'phonics_trace',
    name: { en: `Trace ${letter}`, es: `Traza la ${letter}` },
    instructions: { en: `Trace the ${isNum ? 'number' : 'letter'} ${letter}`, es: `Traza ${isNum ? 'el número' : 'la letra'} ${letter} con tu dedo` },
    instructionAudioPath: `/audio/instructions/trace-${letter.toLowerCase()}.mp3`,
    difficulty: 1, estimatedTimeSeconds: 30,
    config: { letter, svgPath: path ?? LETTER_PATHS.A },
  };
}

function identifyLetter(letter: string): ActivityDef {
  return {
    id: `identify-${letter.toLowerCase()}`,
    type: 'phonics_identify',
    name: { en: `Find ${letter}`, es: `Encuentra la ${letter}` },
    instructions: { en: `Tap the letter ${letter}`, es: `Toca la letra ${letter}` },
    instructionAudioPath: `/audio/instructions/find-${letter.toLowerCase()}.mp3`,
    difficulty: 1, estimatedTimeSeconds: 20,
    config: { target: letter, distractors: getDistractors(letter) },
  };
}

// --- Build letter units A-Z ---
function buildLetterUnits(letters: string[], topicId: string, startOrder: number) {
  return letters.map((letter, i) => ({
    id: `unit-${letter.toLowerCase()}`, topicId,
    name: { en: `Letter ${letter}`, es: `Letra ${letter}` }, order: startOrder + i,
    lessons: [{
      id: `lesson-${letter.toLowerCase()}-1`, unitId: `unit-${letter.toLowerCase()}`,
      name: { en: `Meet letter ${letter}`, es: `Conoce la letra ${letter}` }, order: 1,
      ...(i > 0 ? { prerequisiteLessonId: `lesson-${letters[i - 1].toLowerCase()}-1` } : {}),
      activities: [
        { activityId: `trace-${letter.toLowerCase()}`, order: 1, required: true },
        { activityId: `identify-${letter.toLowerCase()}`, order: 2, required: true },
      ],
    }],
  }));
}

// --- Worlds ---
export const worlds: World[] = [
  {
    id: 'abc', name: { en: 'ABC World', es: 'Mundo ABC' },
    color: 'var(--color-world-abc)', icon: '🔤',
    topics: [
      {
        id: 'phonics-a-m', worldId: 'abc',
        name: { en: 'Letters A–M', es: 'Letras A–M' },
        description: { en: 'Learn the first half of the alphabet', es: 'Aprende la primera mitad del abecedario' },
        thumbnailPath: '',
        units: buildLetterUnits('ABCDEFGHIJKLM'.split(''), 'phonics-a-m', 1),
      },
      {
        id: 'phonics-n-z', worldId: 'abc',
        name: { en: 'Letters N–Z', es: 'Letras N–Z' },
        description: { en: 'Complete the alphabet', es: 'Completa el abecedario' },
        thumbnailPath: '',
        units: buildLetterUnits('NOPQRSTUVWXYZ'.split(''), 'phonics-n-z', 1),
      },
      {
        id: 'words-topic', worldId: 'abc',
        name: { en: 'First Words', es: 'Primeras palabras' },
        description: { en: 'Build simple words', es: 'Construye palabras sencillas' },
        thumbnailPath: '',
        units: [
          {
            id: 'unit-words-3', topicId: 'words-topic',
            name: { en: '3-letter words', es: 'Palabras de 3 letras' }, order: 1,
            lessons: [{
              id: 'lesson-words-3', unitId: 'unit-words-3',
              name: { en: 'Build 3-letter words', es: 'Construye palabras de 3 letras' }, order: 1,
              activities: [
                { activityId: 'build-sol', order: 1, required: true },
                { activityId: 'build-oso', order: 2, required: true },
                { activityId: 'build-cat', order: 3, required: false },
                { activityId: 'build-luz', order: 4, required: false },
                { activityId: 'build-pan', order: 5, required: false },
              ],
            }],
          },
          {
            id: 'unit-words-4', topicId: 'words-topic',
            name: { en: '4-letter words', es: 'Palabras de 4 letras' }, order: 2,
            lessons: [{
              id: 'lesson-words-4', unitId: 'unit-words-4',
              name: { en: 'Build 4-letter words', es: 'Construye palabras de 4 letras' }, order: 1,
              prerequisiteLessonId: 'lesson-words-3',
              activities: [
                { activityId: 'build-casa', order: 1, required: true },
                { activityId: 'build-luna', order: 2, required: true },
                { activityId: 'build-pato', order: 3, required: false },
              ],
            }],
          },
        ],
      },
    ],
  },
  {
    id: '123', name: { en: '123 World', es: 'Mundo 123' },
    color: 'var(--color-world-123)', icon: '🔢',
    topics: [
      {
        id: 'numbers-1-5', worldId: '123',
        name: { en: 'Numbers 1–5', es: 'Números 1–5' },
        description: { en: 'Count from 1 to 5', es: 'Cuenta del 1 al 5' },
        thumbnailPath: '',
        units: [
          { id: 'unit-num-1-3', topicId: 'numbers-1-5', name: { en: '1, 2, 3', es: '1, 2, 3' }, order: 1,
            lessons: [{ id: 'lesson-num-123', unitId: 'unit-num-1-3', name: { en: 'Learn 1-2-3', es: 'Aprende 1-2-3' }, order: 1,
              activities: [
                { activityId: 'trace-1', order: 1, required: true },
                { activityId: 'trace-2', order: 2, required: true },
                { activityId: 'trace-3', order: 3, required: true },
                { activityId: 'sort-123', order: 4, required: true },
              ],
            }],
          },
          { id: 'unit-num-4-5', topicId: 'numbers-1-5', name: { en: '4, 5', es: '4, 5' }, order: 2,
            lessons: [{ id: 'lesson-num-45', unitId: 'unit-num-4-5', name: { en: 'Learn 4-5', es: 'Aprende 4-5' }, order: 1,
              prerequisiteLessonId: 'lesson-num-123',
              activities: [
                { activityId: 'trace-4', order: 1, required: true },
                { activityId: 'trace-5', order: 2, required: true },
                { activityId: 'sort-12345', order: 3, required: true },
              ],
            }],
          },
        ],
      },
      {
        id: 'numbers-6-10', worldId: '123',
        name: { en: 'Numbers 6–10', es: 'Números 6–10' },
        description: { en: 'Count from 6 to 10', es: 'Cuenta del 6 al 10' },
        thumbnailPath: '',
        units: [
          { id: 'unit-num-6-8', topicId: 'numbers-6-10', name: { en: '6, 7, 8', es: '6, 7, 8' }, order: 1,
            lessons: [{ id: 'lesson-num-678', unitId: 'unit-num-6-8', name: { en: 'Learn 6-7-8', es: 'Aprende 6-7-8' }, order: 1,
              activities: [
                { activityId: 'trace-6', order: 1, required: true },
                { activityId: 'trace-7', order: 2, required: true },
                { activityId: 'trace-8', order: 3, required: true },
              ],
            }],
          },
          { id: 'unit-num-9-10', topicId: 'numbers-6-10', name: { en: '9, 10', es: '9, 10' }, order: 2,
            lessons: [{ id: 'lesson-num-910', unitId: 'unit-num-9-10', name: { en: 'Learn 9-10', es: 'Aprende 9-10' }, order: 1,
              prerequisiteLessonId: 'lesson-num-678',
              activities: [
                { activityId: 'trace-9', order: 1, required: true },
                { activityId: 'trace-10', order: 2, required: true },
                { activityId: 'sort-678910', order: 3, required: true },
                { activityId: 'match-numbers', order: 4, required: false },
              ],
            }],
          },
        ],
      },
      {
        id: 'numbers-11-20', worldId: '123',
        name: { en: 'Numbers 11–20', es: 'Números 11–20' },
        description: { en: 'Count from 11 to 20', es: 'Cuenta del 11 al 20' },
        thumbnailPath: '',
        units: [
          { id: 'unit-num-11-15', topicId: 'numbers-11-20', name: { en: '11–15', es: '11–15' }, order: 1,
            lessons: [{ id: 'lesson-num-11-13', unitId: 'unit-num-11-15', name: { en: 'Learn 11-12-13', es: 'Aprende 11-12-13' }, order: 1,
              activities: [
                { activityId: 'trace-11', order: 1, required: true },
                { activityId: 'trace-12', order: 2, required: true },
                { activityId: 'trace-13', order: 3, required: true },
              ],
            },
            { id: 'lesson-num-14-15', unitId: 'unit-num-11-15', name: { en: 'Learn 14-15', es: 'Aprende 14-15' }, order: 2,
              prerequisiteLessonId: 'lesson-num-11-13',
              activities: [
                { activityId: 'trace-14', order: 1, required: true },
                { activityId: 'trace-15', order: 2, required: true },
                { activityId: 'sort-11-15', order: 3, required: true },
              ],
            }],
          },
          { id: 'unit-num-16-20', topicId: 'numbers-11-20', name: { en: '16–20', es: '16–20' }, order: 2,
            lessons: [{ id: 'lesson-num-16-18', unitId: 'unit-num-16-20', name: { en: 'Learn 16-17-18', es: 'Aprende 16-17-18' }, order: 1,
              prerequisiteLessonId: 'lesson-num-14-15',
              activities: [
                { activityId: 'trace-16', order: 1, required: true },
                { activityId: 'trace-17', order: 2, required: true },
                { activityId: 'trace-18', order: 3, required: true },
              ],
            },
            { id: 'lesson-num-19-20', unitId: 'unit-num-16-20', name: { en: 'Learn 19-20', es: 'Aprende 19-20' }, order: 2,
              prerequisiteLessonId: 'lesson-num-16-18',
              activities: [
                { activityId: 'trace-19', order: 1, required: true },
                { activityId: 'trace-20', order: 2, required: true },
                { activityId: 'sort-16-20', order: 3, required: true },
                { activityId: 'match-numbers-teens', order: 4, required: false },
              ],
            }],
          },
        ],
      },
    ],
  },
  {
    id: 'colors', name: { en: 'Color World', es: 'Mundo Color' },
    color: 'var(--color-world-colors)', icon: '🎨',
    topics: [
      {
        id: 'primary-colors', worldId: 'colors',
        name: { en: 'Primary Colors', es: 'Colores primarios' },
        description: { en: 'Red, blue, yellow', es: 'Rojo, azul, amarillo' },
        thumbnailPath: '',
        units: [
          { id: 'unit-primary', topicId: 'primary-colors', name: { en: 'Red, Blue, Yellow', es: 'Rojo, Azul, Amarillo' }, order: 1,
            lessons: [{ id: 'lesson-primary', unitId: 'unit-primary', name: { en: 'Learn primary colors', es: 'Aprende los colores primarios' }, order: 1,
              activities: [
                { activityId: 'match-colors-primary', order: 1, required: true },
                { activityId: 'ispy-colors-primary', order: 2, required: true },
                { activityId: 'color-star', order: 3, required: false },
              ],
            }],
          },
        ],
      },
      {
        id: 'secondary-colors', worldId: 'colors',
        name: { en: 'More Colors', es: 'Más colores' },
        description: { en: 'Green, orange, purple and more', es: 'Verde, naranja, morado y más' },
        thumbnailPath: '',
        units: [
          { id: 'unit-secondary', topicId: 'secondary-colors', name: { en: 'Green, Orange, Purple', es: 'Verde, Naranja, Morado' }, order: 1,
            lessons: [{ id: 'lesson-secondary', unitId: 'unit-secondary', name: { en: 'Learn more colors', es: 'Aprende más colores' }, order: 1,
              activities: [
                { activityId: 'match-colors-secondary', order: 1, required: true },
                { activityId: 'color-heart', order: 2, required: true },
                { activityId: 'color-house', order: 3, required: false },
                { activityId: 'dnd-colors', order: 4, required: false },
              ],
            }],
          },
        ],
      },
    ],
  },
  {
    id: 'animals', name: { en: 'Animal World', es: 'Mundo Animal' },
    color: 'var(--color-world-animals)', icon: '🐾',
    topics: [
      {
        id: 'farm-animals', worldId: 'animals',
        name: { en: 'Farm Animals', es: 'Animales de granja' },
        description: { en: 'Cow, pig, chicken, horse', es: 'Vaca, cerdo, gallina, caballo' },
        thumbnailPath: '',
        units: [
          { id: 'unit-farm', topicId: 'farm-animals', name: { en: 'The Farm', es: 'La Granja' }, order: 1,
            lessons: [{ id: 'lesson-farm-1', unitId: 'unit-farm', name: { en: 'Farm friends', es: 'Amigos de la granja' }, order: 1,
              activities: [
                { activityId: 'show-tell-farm', order: 1, required: true },
                { activityId: 'match-farm', order: 2, required: true },
                { activityId: 'memory-farm', order: 3, required: true },
                { activityId: 'dnd-farm', order: 4, required: false },
              ],
            }],
          },
        ],
      },
      {
        id: 'wild-animals', worldId: 'animals',
        name: { en: 'Wild Animals', es: 'Animales salvajes' },
        description: { en: 'Lion, elephant, monkey', es: 'León, elefante, mono' },
        thumbnailPath: '',
        units: [
          { id: 'unit-wild', topicId: 'wild-animals', name: { en: 'The Jungle', es: 'La Selva' }, order: 1,
            lessons: [{ id: 'lesson-wild-1', unitId: 'unit-wild', name: { en: 'Wild friends', es: 'Amigos salvajes' }, order: 1,
              activities: [
                { activityId: 'show-tell-wild', order: 1, required: true },
                { activityId: 'match-wild', order: 2, required: true },
                { activityId: 'memory-wild', order: 3, required: false },
                { activityId: 'ispy-wild', order: 4, required: false },
              ],
            }],
          },
        ],
      },
      {
        id: 'sea-animals', worldId: 'animals',
        name: { en: 'Sea Animals', es: 'Animales marinos' },
        description: { en: 'Fish, whale, octopus', es: 'Pez, ballena, pulpo' },
        thumbnailPath: '',
        units: [
          { id: 'unit-sea', topicId: 'sea-animals', name: { en: 'The Ocean', es: 'El Océano' }, order: 1,
            lessons: [{ id: 'lesson-sea-1', unitId: 'unit-sea', name: { en: 'Ocean friends', es: 'Amigos del mar' }, order: 1,
              activities: [
                { activityId: 'show-tell-sea', order: 1, required: true },
                { activityId: 'match-sea', order: 2, required: true },
                { activityId: 'memory-sea', order: 3, required: false },
              ],
            }],
          },
        ],
      },
    ],
  },
  {
    id: 'food', name: { en: 'Food World', es: 'Mundo Comida' },
    color: 'var(--color-world-food)', icon: '🍎',
    topics: [
      {
        id: 'fruits', worldId: 'food',
        name: { en: 'Fruits', es: 'Frutas' },
        description: { en: 'Apple, banana, orange and more', es: 'Manzana, plátano, naranja y más' },
        thumbnailPath: '',
        units: [
          { id: 'unit-fruits', topicId: 'fruits', name: { en: 'Yummy Fruits', es: 'Frutas ricas' }, order: 1,
            lessons: [{ id: 'lesson-fruits-1', unitId: 'unit-fruits', name: { en: 'Learn fruits', es: 'Aprende frutas' }, order: 1,
              activities: [
                { activityId: 'show-tell-fruits', order: 1, required: true },
                { activityId: 'match-fruits', order: 2, required: true },
                { activityId: 'memory-fruits', order: 3, required: false },
                { activityId: 'ispy-fruits', order: 4, required: false },
              ],
            }],
          },
        ],
      },
      {
        id: 'vegetables', worldId: 'food',
        name: { en: 'Vegetables', es: 'Verduras' },
        description: { en: 'Carrot, tomato, broccoli', es: 'Zanahoria, tomate, brócoli' },
        thumbnailPath: '',
        units: [
          { id: 'unit-vegs', topicId: 'vegetables', name: { en: 'Healthy Veggies', es: 'Verduras saludables' }, order: 1,
            lessons: [{ id: 'lesson-vegs-1', unitId: 'unit-vegs', name: { en: 'Learn vegetables', es: 'Aprende verduras' }, order: 1,
              activities: [
                { activityId: 'show-tell-vegs', order: 1, required: true },
                { activityId: 'match-vegs', order: 2, required: true },
                { activityId: 'dnd-food', order: 3, required: false },
              ],
            }],
          },
        ],
      },
    ],
  },
  {
    id: 'music', name: { en: 'Music World', es: 'Mundo Música' },
    color: 'var(--color-world-music)', icon: '🎵',
    topics: [
      {
        id: 'instruments', worldId: 'music',
        name: { en: 'Instruments', es: 'Instrumentos' },
        description: { en: 'Piano, guitar, drums', es: 'Piano, guitarra, batería' },
        thumbnailPath: '',
        units: [
          { id: 'unit-instruments', topicId: 'instruments', name: { en: 'Meet the instruments', es: 'Conoce los instrumentos' }, order: 1,
            lessons: [{ id: 'lesson-inst-1', unitId: 'unit-instruments', name: { en: 'String & keys', es: 'Cuerdas y teclas' }, order: 1,
              activities: [
                { activityId: 'match-instruments', order: 1, required: true },
                { activityId: 'ispy-instruments', order: 2, required: true },
                { activityId: 'memory-instruments', order: 3, required: false },
              ],
            }],
          },
        ],
      },
    ],
  },
];

// --- Activities ---
export const activities: ActivityDef[] = [
  // ======= LETTERS A-Z (trace + identify) =======
  ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').flatMap((l) => [traceLetter(l, 0), identifyLetter(l)]),

  // ======= MATCHING for letters =======
  { id: 'match-a', type: 'matching', name: { en: 'Match A words', es: 'Empareja con A' }, instructions: { en: 'Match the picture to the word', es: 'Empareja la imagen con la palabra' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 40, config: { pairs: [{ image: '🍎', word: { en: 'Apple', es: 'Abeja' } }, { image: '✈️', word: { en: 'Airplane', es: 'Avión' } }, { image: '🌳', word: { en: 'Tree (Árbol)', es: 'Árbol' } }] } },
  { id: 'match-b', type: 'matching', name: { en: 'Match B words', es: 'Empareja con B' }, instructions: { en: 'Match pictures to words', es: 'Empareja imágenes con palabras' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 40, config: { pairs: [{ image: '🍌', word: { en: 'Banana', es: 'Banana' } }, { image: '🐳', word: { en: 'Whale', es: 'Ballena' } }] } },

  // ======= NUMBERS 1-10 =======
  ...'12345678910'.match(/10|\d/g)!.map((n, i) => traceLetter(n, i)),

  // Sorting 1-10
  { id: 'sort-123', type: 'sorting', name: { en: 'Sort 1-2-3', es: 'Ordena 1-2-3' }, instructions: { en: 'Put the numbers in order', es: 'Pon los números en orden' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 30, config: { items: ['1', '2', '3'], correctOrder: ['1', '2', '3'] } },
  { id: 'sort-12345', type: 'sorting', name: { en: 'Sort 1-5', es: 'Ordena 1-5' }, instructions: { en: 'Put the numbers in order', es: 'Pon los números en orden' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 40, config: { items: ['1', '2', '3', '4', '5'], correctOrder: ['1', '2', '3', '4', '5'] } },
  { id: 'sort-678910', type: 'sorting', name: { en: 'Sort 6-10', es: 'Ordena 6-10' }, instructions: { en: 'Put the numbers in order', es: 'Pon los números en orden' }, instructionAudioPath: '', difficulty: 2, estimatedTimeSeconds: 40, config: { items: ['6', '7', '8', '9', '10'], correctOrder: ['6', '7', '8', '9', '10'] } },
  { id: 'match-numbers', type: 'matching', name: { en: 'Match numbers', es: 'Empareja números' }, instructions: { en: 'Match the number to the quantity', es: 'Empareja el número con la cantidad' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 40, config: { pairs: [{ image: '1️⃣', word: { en: 'One', es: 'Uno' } }, { image: '2️⃣', word: { en: 'Two', es: 'Dos' } }, { image: '3️⃣', word: { en: 'Three', es: 'Tres' } }] } },

  // ======= NUMBERS 11-20 =======
  ...['11','12','13','14','15','16','17','18','19','20'].map((n, i) => traceLetter(n, i)),

  // Sorting 11-20
  { id: 'sort-11-15', type: 'sorting', name: { en: 'Sort 11-15', es: 'Ordena 11-15' }, instructions: { en: 'Put the numbers in order', es: 'Pon los números en orden' }, instructionAudioPath: '', difficulty: 2, estimatedTimeSeconds: 45, config: { items: ['11', '12', '13', '14', '15'], correctOrder: ['11', '12', '13', '14', '15'] } },
  { id: 'sort-16-20', type: 'sorting', name: { en: 'Sort 16-20', es: 'Ordena 16-20' }, instructions: { en: 'Put the numbers in order', es: 'Pon los números en orden' }, instructionAudioPath: '', difficulty: 2, estimatedTimeSeconds: 45, config: { items: ['16', '17', '18', '19', '20'], correctOrder: ['16', '17', '18', '19', '20'] } },
  { id: 'match-numbers-teens', type: 'matching', name: { en: 'Match teen numbers', es: 'Empareja números teens' }, instructions: { en: 'Match the number to its name', es: 'Empareja el número con su nombre' }, instructionAudioPath: '', difficulty: 2, estimatedTimeSeconds: 45, config: { pairs: [{ image: '1️⃣1️⃣', word: { en: 'Eleven', es: 'Once' } }, { image: '1️⃣5️⃣', word: { en: 'Fifteen', es: 'Quince' } }, { image: '2️⃣0️⃣', word: { en: 'Twenty', es: 'Veinte' } }] } },

  // ======= COLORS =======
  { id: 'match-colors-primary', type: 'matching', name: { en: 'Match primary colors', es: 'Empareja colores primarios' }, instructions: { en: 'Match the color to its name', es: 'Empareja el color con su nombre' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 40, config: { pairs: [{ image: '🔴', word: { en: 'Red', es: 'Rojo' } }, { image: '🔵', word: { en: 'Blue', es: 'Azul' } }, { image: '🟡', word: { en: 'Yellow', es: 'Amarillo' } }] } },
  { id: 'ispy-colors-primary', type: 'i_spy', name: { en: 'I Spy colors', es: 'Busca colores' }, instructions: { en: 'Find all the red items', es: 'Encuentra los objetos rojos' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 40, config: { targets: ['🍎', '🌹', '❤️'], scene: ['🍎', '🌻', '🌹', '🍌', '❤️', '🔵', '🌿', '⭐'] } },
  { id: 'color-star', type: 'coloring', name: { en: 'Color the star', es: 'Colorea la estrella' }, instructions: { en: 'Tap to fill with color', es: 'Toca para rellenar con color' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 60, config: { shape: 'star', availableColors: ['#ff0000', '#0000ff', '#ffff00', '#00cc00'] } },
  { id: 'match-colors-secondary', type: 'matching', name: { en: 'Match more colors', es: 'Empareja más colores' }, instructions: { en: 'Match the color to its name', es: 'Empareja el color con su nombre' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 40, config: { pairs: [{ image: '🟢', word: { en: 'Green', es: 'Verde' } }, { image: '🟠', word: { en: 'Orange', es: 'Naranja' } }, { image: '🟣', word: { en: 'Purple', es: 'Morado' } }, { image: '🟤', word: { en: 'Brown', es: 'Marrón' } }] } },
  { id: 'color-heart', type: 'coloring', name: { en: 'Color the heart', es: 'Colorea el corazón' }, instructions: { en: 'Tap to fill with color', es: 'Toca para rellenar con color' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 60, config: { shape: 'heart', availableColors: ['#ff0000', '#ff69b4', '#800080', '#ff4500'] } },
  { id: 'color-house', type: 'coloring', name: { en: 'Color the house', es: 'Colorea la casa' }, instructions: { en: 'Tap to fill with color', es: 'Toca para rellenar con color' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 60, config: { shape: 'house', availableColors: ['#ff0000', '#0000ff', '#ffff00', '#8B4513'] } },
  { id: 'dnd-colors', type: 'drag_and_drop', name: { en: 'Sort by color', es: 'Clasifica por color' }, instructions: { en: 'Drag each item to its color group', es: 'Arrastra cada objeto a su grupo de color' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 45, config: { items: [{ id: 'apple', emoji: '🍎', label: { en: 'Apple', es: 'Manzana' } }, { id: 'sun', emoji: '☀️', label: { en: 'Sun', es: 'Sol' } }, { id: 'tree', emoji: '🌲', label: { en: 'Tree', es: 'Árbol' } }, { id: 'strawberry', emoji: '🍓', label: { en: 'Strawberry', es: 'Fresa' } }], zones: [{ id: 'red', label: { en: 'Red', es: 'Rojo' }, accepts: ['apple', 'strawberry'] }, { id: 'yellow', label: { en: 'Yellow', es: 'Amarillo' }, accepts: ['sun'] }, { id: 'green', label: { en: 'Green', es: 'Verde' }, accepts: ['tree'] }] } },

  // ======= FARM ANIMALS =======
  { id: 'show-tell-farm', type: 'show_and_tell', name: { en: 'Farm animal names', es: 'Nombres de animales' }, instructions: { en: 'Tap the right animal', es: 'Toca el animal correcto' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 30, config: { items: [{ emoji: '🐄', name: { en: 'Cow', es: 'Vaca' } }, { emoji: '🐷', name: { en: 'Pig', es: 'Cerdo' } }, { emoji: '🐔', name: { en: 'Chicken', es: 'Gallina' } }, { emoji: '🐴', name: { en: 'Horse', es: 'Caballo' } }, { emoji: '🐑', name: { en: 'Sheep', es: 'Oveja' } }] } },
  { id: 'match-farm', type: 'matching', name: { en: 'Farm match', es: 'Empareja animales' }, instructions: { en: 'Match the animal to its name', es: 'Empareja el animal con su nombre' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 40, config: { pairs: [{ image: '🐄', word: { en: 'Cow', es: 'Vaca' } }, { image: '🐷', word: { en: 'Pig', es: 'Cerdo' } }, { image: '🐔', word: { en: 'Chicken', es: 'Gallina' } }, { image: '🐴', word: { en: 'Horse', es: 'Caballo' } }] } },
  { id: 'memory-farm', type: 'memory_cards', name: { en: 'Farm memory', es: 'Memoria de granja' }, instructions: { en: 'Find the matching pairs', es: 'Encuentra las parejas' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 60, config: { cards: ['🐄', '🐷', '🐔', '🐴', '🐑'] } },
  { id: 'dnd-farm', type: 'drag_and_drop', name: { en: 'Sort animals', es: 'Clasifica animales' }, instructions: { en: 'Drag each animal to its home', es: 'Arrastra cada animal a su hogar' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 45, config: { items: [{ id: 'cow', emoji: '🐄', label: { en: 'Cow', es: 'Vaca' } }, { id: 'fish', emoji: '🐟', label: { en: 'Fish', es: 'Pez' } }, { id: 'bird', emoji: '🐦', label: { en: 'Bird', es: 'Pájaro' } }, { id: 'pig', emoji: '🐷', label: { en: 'Pig', es: 'Cerdo' } }], zones: [{ id: 'farm', label: { en: 'Farm', es: 'Granja' }, accepts: ['cow', 'pig'] }, { id: 'water', label: { en: 'Water', es: 'Agua' }, accepts: ['fish'] }, { id: 'sky', label: { en: 'Sky', es: 'Cielo' }, accepts: ['bird'] }] } },

  // ======= WILD ANIMALS =======
  { id: 'show-tell-wild', type: 'show_and_tell', name: { en: 'Wild animal names', es: 'Animales salvajes' }, instructions: { en: 'Tap the right animal', es: 'Toca el animal correcto' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 30, config: { items: [{ emoji: '🦁', name: { en: 'Lion', es: 'León' } }, { emoji: '🐘', name: { en: 'Elephant', es: 'Elefante' } }, { emoji: '🐒', name: { en: 'Monkey', es: 'Mono' } }, { emoji: '🦒', name: { en: 'Giraffe', es: 'Jirafa' } }, { emoji: '🐍', name: { en: 'Snake', es: 'Serpiente' } }] } },
  { id: 'match-wild', type: 'matching', name: { en: 'Wild match', es: 'Empareja salvajes' }, instructions: { en: 'Match the animal to its name', es: 'Empareja el animal con su nombre' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 40, config: { pairs: [{ image: '🦁', word: { en: 'Lion', es: 'León' } }, { image: '🐘', word: { en: 'Elephant', es: 'Elefante' } }, { image: '🐒', word: { en: 'Monkey', es: 'Mono' } }, { image: '🦒', word: { en: 'Giraffe', es: 'Jirafa' } }] } },
  { id: 'memory-wild', type: 'memory_cards', name: { en: 'Wild memory', es: 'Memoria salvaje' }, instructions: { en: 'Find the matching pairs', es: 'Encuentra las parejas' }, instructionAudioPath: '', difficulty: 2, estimatedTimeSeconds: 60, config: { cards: ['🦁', '🐘', '🐒', '🦒', '🐍', '🦓'] } },
  { id: 'ispy-wild', type: 'i_spy', name: { en: 'I Spy wild animals', es: 'Busca animales' }, instructions: { en: 'Find all the animals', es: 'Encuentra todos los animales' }, instructionAudioPath: '', difficulty: 2, estimatedTimeSeconds: 45, config: { targets: ['🦁', '🐘', '🐒'], scene: ['🦁', '🌴', '🐘', '🌺', '🐒', '☀️', '🪨', '🌿'] } },

  // ======= SEA ANIMALS =======
  { id: 'show-tell-sea', type: 'show_and_tell', name: { en: 'Sea animal names', es: 'Animales del mar' }, instructions: { en: 'Tap the right animal', es: 'Toca el animal correcto' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 30, config: { items: [{ emoji: '🐟', name: { en: 'Fish', es: 'Pez' } }, { emoji: '🐳', name: { en: 'Whale', es: 'Ballena' } }, { emoji: '🐙', name: { en: 'Octopus', es: 'Pulpo' } }, { emoji: '🦀', name: { en: 'Crab', es: 'Cangrejo' } }, { emoji: '🐢', name: { en: 'Turtle', es: 'Tortuga' } }] } },
  { id: 'match-sea', type: 'matching', name: { en: 'Sea match', es: 'Empareja marinos' }, instructions: { en: 'Match the animal to its name', es: 'Empareja el animal con su nombre' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 40, config: { pairs: [{ image: '🐟', word: { en: 'Fish', es: 'Pez' } }, { image: '🐳', word: { en: 'Whale', es: 'Ballena' } }, { image: '🐙', word: { en: 'Octopus', es: 'Pulpo' } }, { image: '🦀', word: { en: 'Crab', es: 'Cangrejo' } }] } },
  { id: 'memory-sea', type: 'memory_cards', name: { en: 'Sea memory', es: 'Memoria marina' }, instructions: { en: 'Find the matching pairs', es: 'Encuentra las parejas' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 60, config: { cards: ['🐟', '🐳', '🐙', '🦀', '🐢'] } },

  // ======= FRUITS =======
  { id: 'show-tell-fruits', type: 'show_and_tell', name: { en: 'Fruit names', es: 'Nombres de frutas' }, instructions: { en: 'Tap the right fruit', es: 'Toca la fruta correcta' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 30, config: { items: [{ emoji: '🍎', name: { en: 'Apple', es: 'Manzana' } }, { emoji: '🍌', name: { en: 'Banana', es: 'Plátano' } }, { emoji: '🍊', name: { en: 'Orange', es: 'Naranja' } }, { emoji: '🍇', name: { en: 'Grapes', es: 'Uvas' } }, { emoji: '🍓', name: { en: 'Strawberry', es: 'Fresa' } }] } },
  { id: 'match-fruits', type: 'matching', name: { en: 'Match fruits', es: 'Empareja frutas' }, instructions: { en: 'Match fruit to its name', es: 'Empareja la fruta con su nombre' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 40, config: { pairs: [{ image: '🍎', word: { en: 'Apple', es: 'Manzana' } }, { image: '🍌', word: { en: 'Banana', es: 'Plátano' } }, { image: '🍊', word: { en: 'Orange', es: 'Naranja' } }, { image: '🍇', word: { en: 'Grapes', es: 'Uvas' } }] } },
  { id: 'memory-fruits', type: 'memory_cards', name: { en: 'Fruit memory', es: 'Memoria de frutas' }, instructions: { en: 'Find the matching pairs', es: 'Encuentra las parejas' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 60, config: { cards: ['🍎', '🍌', '🍊', '🍇', '🍓'] } },
  { id: 'ispy-fruits', type: 'i_spy', name: { en: 'I Spy fruits', es: 'Busca frutas' }, instructions: { en: 'Find all the fruits', es: 'Encuentra todas las frutas' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 40, config: { targets: ['🍎', '🍌', '🍊'], scene: ['🍎', '🌻', '🍌', '🪴', '🍊', '🌵', '🍄', '🌸'] } },

  // ======= VEGETABLES =======
  { id: 'show-tell-vegs', type: 'show_and_tell', name: { en: 'Vegetable names', es: 'Nombres de verduras' }, instructions: { en: 'Tap the right vegetable', es: 'Toca la verdura correcta' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 30, config: { items: [{ emoji: '🥕', name: { en: 'Carrot', es: 'Zanahoria' } }, { emoji: '🍅', name: { en: 'Tomato', es: 'Tomate' } }, { emoji: '🥦', name: { en: 'Broccoli', es: 'Brócoli' } }, { emoji: '🌽', name: { en: 'Corn', es: 'Maíz' } }] } },
  { id: 'match-vegs', type: 'matching', name: { en: 'Match vegetables', es: 'Empareja verduras' }, instructions: { en: 'Match vegetable to its name', es: 'Empareja la verdura con su nombre' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 40, config: { pairs: [{ image: '🥕', word: { en: 'Carrot', es: 'Zanahoria' } }, { image: '🍅', word: { en: 'Tomato', es: 'Tomate' } }, { image: '🥦', word: { en: 'Broccoli', es: 'Brócoli' } }] } },
  { id: 'dnd-food', type: 'drag_and_drop', name: { en: 'Fruits vs Veggies', es: 'Frutas vs Verduras' }, instructions: { en: 'Drag each food to its group', es: 'Arrastra cada alimento a su grupo' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 45, config: { items: [{ id: 'apple2', emoji: '🍎', label: { en: 'Apple', es: 'Manzana' } }, { id: 'carrot', emoji: '🥕', label: { en: 'Carrot', es: 'Zanahoria' } }, { id: 'banana', emoji: '🍌', label: { en: 'Banana', es: 'Plátano' } }, { id: 'broccoli', emoji: '🥦', label: { en: 'Broccoli', es: 'Brócoli' } }], zones: [{ id: 'fruits', label: { en: 'Fruits', es: 'Frutas' }, accepts: ['apple2', 'banana'] }, { id: 'vegs', label: { en: 'Vegetables', es: 'Verduras' }, accepts: ['carrot', 'broccoli'] }] } },

  // ======= MUSIC =======
  { id: 'match-instruments', type: 'matching', name: { en: 'Match instruments', es: 'Empareja instrumentos' }, instructions: { en: 'Match the instrument to its name', es: 'Empareja el instrumento con su nombre' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 40, config: { pairs: [{ image: '🎸', word: { en: 'Guitar', es: 'Guitarra' } }, { image: '🎹', word: { en: 'Piano', es: 'Piano' } }, { image: '🥁', word: { en: 'Drums', es: 'Batería' } }, { image: '🎺', word: { en: 'Trumpet', es: 'Trompeta' } }] } },
  { id: 'ispy-instruments', type: 'i_spy', name: { en: 'I Spy instruments', es: 'Busca instrumentos' }, instructions: { en: 'Find all the instruments', es: 'Encuentra todos los instrumentos' }, instructionAudioPath: '', difficulty: 2, estimatedTimeSeconds: 45, config: { targets: ['🎸', '🎹', '🥁', '🎺'], scene: ['🎸', '🌳', '🎹', '🏠', '🥁', '☀️', '🎺', '⛅', '🌺'] } },
  { id: 'memory-instruments', type: 'memory_cards', name: { en: 'Instrument memory', es: 'Memoria musical' }, instructions: { en: 'Find the matching pairs', es: 'Encuentra las parejas' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 60, config: { cards: ['🎸', '🎹', '🥁', '🎺', '🎻'] } },

  // ======= WORD BUILDER =======
  { id: 'build-sol', type: 'word_builder', name: { en: 'Build SOL', es: 'Construye SOL' }, instructions: { en: 'Build the word', es: 'Construye la palabra' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 30, config: { word: 'SOL', hint: { en: 'Sun', es: 'El astro que nos da luz' }, emoji: '☀️' } },
  { id: 'build-oso', type: 'word_builder', name: { en: 'Build OSO', es: 'Construye OSO' }, instructions: { en: 'Build the word', es: 'Construye la palabra' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 30, config: { word: 'OSO', hint: { en: 'Bear', es: 'Animal grande del bosque' }, emoji: '🐻' } },
  { id: 'build-cat', type: 'word_builder', name: { en: 'Build CAT', es: 'Construye CAT' }, instructions: { en: 'Build the word', es: 'Construye la palabra' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 30, config: { word: 'CAT', hint: { en: 'A furry pet', es: 'Un animal peludo' }, emoji: '🐱' } },
  { id: 'build-luz', type: 'word_builder', name: { en: 'Build LUZ', es: 'Construye LUZ' }, instructions: { en: 'Build the word', es: 'Construye la palabra' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 30, config: { word: 'LUZ', hint: { en: 'Light', es: 'Lo que ilumina' }, emoji: '💡' } },
  { id: 'build-pan', type: 'word_builder', name: { en: 'Build PAN', es: 'Construye PAN' }, instructions: { en: 'Build the word', es: 'Construye la palabra' }, instructionAudioPath: '', difficulty: 1, estimatedTimeSeconds: 30, config: { word: 'PAN', hint: { en: 'Bread', es: 'Lo comemos cada día' }, emoji: '🍞' } },
  { id: 'build-casa', type: 'word_builder', name: { en: 'Build CASA', es: 'Construye CASA' }, instructions: { en: 'Build the word', es: 'Construye la palabra' }, instructionAudioPath: '', difficulty: 2, estimatedTimeSeconds: 40, config: { word: 'CASA', hint: { en: 'House', es: 'Donde vivimos' }, emoji: '🏠' } },
  { id: 'build-luna', type: 'word_builder', name: { en: 'Build LUNA', es: 'Construye LUNA' }, instructions: { en: 'Build the word', es: 'Construye la palabra' }, instructionAudioPath: '', difficulty: 2, estimatedTimeSeconds: 40, config: { word: 'LUNA', hint: { en: 'Moon', es: 'Brilla en la noche' }, emoji: '🌙' } },
  { id: 'build-pato', type: 'word_builder', name: { en: 'Build PATO', es: 'Construye PATO' }, instructions: { en: 'Build the word', es: 'Construye la palabra' }, instructionAudioPath: '', difficulty: 2, estimatedTimeSeconds: 40, config: { word: 'PATO', hint: { en: 'Duck', es: 'Ave que nada en el lago' }, emoji: '🦆' } },
];

export function getActivity(id: string): ActivityDef | undefined {
  return activities.find((a) => a.id === id);
}

export function getWorldById(id: string): World | undefined {
  return worlds.find((w) => w.id === id);
}
