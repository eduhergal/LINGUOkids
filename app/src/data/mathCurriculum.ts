import type { World, ActivityDef } from '@/types';

const COUNTING_EMOJIS = ['🍎', '🌟', '⚽', '🎈', '🐱', '🦋', '🚀', '🎨', '🍌', '🐶', '🐸', '🌺', '🍪', '🧸'];

function countAct(id: string, target: number, emoji: string, diff: 1 | 2 | 3): ActivityDef {
  return {
    id,
    type: 'counting',
    name: { en: `Count ${target}`, es: `Cuenta ${target}` },
    instructions: { en: `Tap each ${emoji} to count to ${target}!`, es: `¡Toca cada ${emoji} para contar hasta ${target}!` },
    instructionAudioPath: `/audio/instructions/${id}.mp3`,
    difficulty: diff,
    estimatedTimeSeconds: 30 + target * 3,
    config: { targetCount: target, emoji },
  };
}

function compAct(id: string, l: number, r: number, diff: 1 | 2 | 3): ActivityDef {
  const le = COUNTING_EMOJIS[Math.floor(Math.random() * COUNTING_EMOJIS.length)];
  const re = COUNTING_EMOJIS[Math.floor(Math.random() * COUNTING_EMOJIS.length)];
  return {
    id,
    type: 'comparison',
    name: { en: `Compare ${l} vs ${r}`, es: `Compara ${l} y ${r}` },
    instructions: { en: 'Which group has more or less?', es: '¿Cuál grupo tiene más o menos?' },
    instructionAudioPath: `/audio/instructions/${id}.mp3`,
    difficulty: diff,
    estimatedTimeSeconds: 60,
    config: { leftCount: l, rightCount: r, leftEmoji: le, rightEmoji: re },
  };
}

function mathAct(
  id: string,
  op: 'add' | 'subtract' | 'multiply' | 'divide',
  a: number,
  b: number,
  diff: 1 | 2 | 3,
): ActivityDef {
  const answer = op === 'add' ? a + b : op === 'subtract' ? a - b : op === 'multiply' ? a * b : Math.floor(a / b);
  const opts = new Set<number>([answer]);
  while (opts.size < 3) {
    const off = Math.floor(Math.random() * 5) + 1;
    const w = answer + (Math.random() > 0.5 ? off : -off);
    if (w >= 0 && w !== answer) opts.add(w);
  }
  const opNames: Record<string, { en: string; es: string }> = {
    add: { en: 'Addition', es: 'Suma' },
    subtract: { en: 'Subtraction', es: 'Resta' },
    multiply: { en: 'Multiplication', es: 'Multiplicación' },
    divide: { en: 'Division', es: 'División' },
  };
  const sym: Record<string, string> = { add: '+', subtract: '−', multiply: '×', divide: '÷' };
  return {
    id,
    type: 'math_ops',
    name: { en: `${a} ${sym[op]} ${b}`, es: `${a} ${sym[op]} ${b}` },
    instructions: {
      en: `${opNames[op].en}: ${a} ${sym[op]} ${b} = ?`,
      es: `${opNames[op].es}: ${a} ${sym[op]} ${b} = ?`,
    },
    instructionAudioPath: `/audio/instructions/${id}.mp3`,
    difficulty: diff,
    estimatedTimeSeconds: 90,
    config: {
      operation: op,
      num1: a,
      num2: b,
      options: [...opts].sort(() => Math.random() - 0.5),
    },
  };
}

const allMathActivities: ActivityDef[] = [];

// Topic 1: Counting 1-5
const c1acts = [
  countAct('math-count-1', 1, '🍎', 1),
  countAct('math-count-2', 2, '🌟', 1),
  countAct('math-count-3', 3, '🎈', 1),
  countAct('math-count-4', 4, '🐱', 1),
  countAct('math-count-5', 5, '🦋', 1),
];
allMathActivities.push(...c1acts);

// Topic 2: Counting 6-10
const c2acts = [
  countAct('math-count-6', 6, '⚽', 1),
  countAct('math-count-7', 7, '🚀', 1),
  countAct('math-count-8', 8, '🎨', 1),
  countAct('math-count-9', 9, '🍌', 2),
  countAct('math-count-10', 10, '🐶', 2),
];
allMathActivities.push(...c2acts);

// Topic 3: More or Less
const compacts = [
  compAct('math-comp-1', 2, 5, 1),
  compAct('math-comp-2', 7, 3, 1),
  compAct('math-comp-3', 4, 4, 1),
  compAct('math-comp-4', 8, 6, 2),
  compAct('math-comp-5', 1, 9, 2),
];
allMathActivities.push(...compacts);

// Topic 4: Addition
const addacts = [
  mathAct('math-add-1', 'add', 1, 1, 1),
  mathAct('math-add-2', 'add', 2, 1, 1),
  mathAct('math-add-3', 'add', 2, 3, 1),
  mathAct('math-add-4', 'add', 3, 4, 2),
  mathAct('math-add-5', 'add', 5, 3, 2),
  mathAct('math-add-6', 'add', 4, 6, 2),
];
allMathActivities.push(...addacts);

// Topic 5: Subtraction
const subacts = [
  mathAct('math-sub-1', 'subtract', 3, 1, 1),
  mathAct('math-sub-2', 'subtract', 5, 2, 1),
  mathAct('math-sub-3', 'subtract', 7, 3, 2),
  mathAct('math-sub-4', 'subtract', 8, 5, 2),
  mathAct('math-sub-5', 'subtract', 10, 4, 2),
];
allMathActivities.push(...subacts);

// Topic 6: Counting 11-20
const c3acts = [
  countAct('math-count-12', 12, '🌺', 2),
  countAct('math-count-15', 15, '🍪', 2),
  countAct('math-count-18', 18, '🧸', 3),
  countAct('math-count-20', 20, '🐸', 3),
];
allMathActivities.push(...c3acts);

// Topic 7: Multiplication
const mulacts = [
  mathAct('math-mul-1', 'multiply', 2, 2, 2),
  mathAct('math-mul-2', 'multiply', 3, 2, 2),
  mathAct('math-mul-3', 'multiply', 2, 5, 2),
  mathAct('math-mul-4', 'multiply', 3, 3, 3),
  mathAct('math-mul-5', 'multiply', 4, 3, 3),
  mathAct('math-mul-6', 'multiply', 5, 5, 3),
];
allMathActivities.push(...mulacts);

// Topic 8: Division
const divacts = [
  mathAct('math-div-1', 'divide', 4, 2, 2),
  mathAct('math-div-2', 'divide', 6, 2, 2),
  mathAct('math-div-3', 'divide', 9, 3, 2),
  mathAct('math-div-4', 'divide', 10, 5, 3),
  mathAct('math-div-5', 'divide', 15, 3, 3),
  mathAct('math-div-6', 'divide', 20, 5, 3),
];
allMathActivities.push(...divacts);

export { allMathActivities };

export function getMathActivity(id: string): ActivityDef | undefined {
  return allMathActivities.find((a) => a.id === id);
}

export const mathWorld: World = {
  id: 'math',
  name: { en: 'Math', es: 'Mates' },
  color: '#FF6B6B',
  icon: '🧮',
  topics: [
    {
      id: 'math-counting-1-5',
      worldId: 'math',
      name: { en: 'Counting 1–5', es: 'Contar 1–5' },
      description: { en: 'Learn to count from 1 to 5', es: 'Aprende a contar del 1 al 5' },
      thumbnailPath: '/images/topics/counting-small.png',
      units: [
        {
          id: 'math-c15-u1',
          topicId: 'math-counting-1-5',
          name: { en: 'First Steps', es: 'Primeros pasos' },
          order: 1,
          lessons: [
            {
              id: 'math-c15-l1',
              unitId: 'math-c15-u1',
              name: { en: 'Count 1 & 2', es: 'Cuenta 1 y 2' },
              order: 1,
              activities: [
                { activityId: 'math-count-1', order: 1, required: true },
                { activityId: 'math-count-2', order: 2, required: true },
              ],
            },
            {
              id: 'math-c15-l2',
              unitId: 'math-c15-u1',
              name: { en: 'Count 3 & 4', es: 'Cuenta 3 y 4' },
              order: 2,
              activities: [
                { activityId: 'math-count-3', order: 1, required: true },
                { activityId: 'math-count-4', order: 2, required: true },
              ],
            },
            {
              id: 'math-c15-l3',
              unitId: 'math-c15-u1',
              name: { en: 'Count to 5!', es: '¡Cuenta hasta 5!' },
              order: 3,
              activities: [
                { activityId: 'math-count-5', order: 1, required: true },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'math-counting-6-10',
      worldId: 'math',
      name: { en: 'Counting 6–10', es: 'Contar 6–10' },
      description: { en: 'Count from 6 to 10', es: 'Cuenta del 6 al 10' },
      thumbnailPath: '/images/topics/counting-big.png',
      units: [
        {
          id: 'math-c610-u1',
          topicId: 'math-counting-6-10',
          name: { en: 'Keep Counting', es: 'Sigue contando' },
          order: 1,
          lessons: [
            {
              id: 'math-c610-l1',
              unitId: 'math-c610-u1',
              name: { en: 'Count 6 & 7', es: 'Cuenta 6 y 7' },
              order: 1,
              activities: [
                { activityId: 'math-count-6', order: 1, required: true },
                { activityId: 'math-count-7', order: 2, required: true },
              ],
            },
            {
              id: 'math-c610-l2',
              unitId: 'math-c610-u1',
              name: { en: 'Count 8 & 9', es: 'Cuenta 8 y 9' },
              order: 2,
              activities: [
                { activityId: 'math-count-8', order: 1, required: true },
                { activityId: 'math-count-9', order: 2, required: true },
              ],
            },
            {
              id: 'math-c610-l3',
              unitId: 'math-c610-u1',
              name: { en: 'Count to 10!', es: '¡Cuenta hasta 10!' },
              order: 3,
              activities: [
                { activityId: 'math-count-10', order: 1, required: true },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'math-more-less',
      worldId: 'math',
      name: { en: 'More or Less', es: 'Más o menos' },
      description: { en: 'Compare groups — which has more?', es: 'Compara grupos — ¿cuál tiene más?' },
      thumbnailPath: '/images/topics/comparison.png',
      units: [
        {
          id: 'math-ml-u1',
          topicId: 'math-more-less',
          name: { en: 'Comparing', es: 'Comparar' },
          order: 1,
          lessons: [
            {
              id: 'math-ml-l1',
              unitId: 'math-ml-u1',
              name: { en: 'Easy Compare', es: 'Comparar fácil' },
              order: 1,
              activities: [
                { activityId: 'math-comp-1', order: 1, required: true },
                { activityId: 'math-comp-2', order: 2, required: true },
              ],
            },
            {
              id: 'math-ml-l2',
              unitId: 'math-ml-u1',
              name: { en: 'Tricky Compare', es: 'Comparar difícil' },
              order: 2,
              activities: [
                { activityId: 'math-comp-3', order: 1, required: true },
                { activityId: 'math-comp-4', order: 2, required: true },
                { activityId: 'math-comp-5', order: 3, required: true },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'math-addition',
      worldId: 'math',
      name: { en: 'Addition', es: 'Sumas' },
      description: { en: 'Learn to add numbers together', es: 'Aprende a sumar números' },
      thumbnailPath: '/images/topics/addition.png',
      units: [
        {
          id: 'math-add-u1',
          topicId: 'math-addition',
          name: { en: 'First Sums', es: 'Primeras sumas' },
          order: 1,
          lessons: [
            {
              id: 'math-add-l1',
              unitId: 'math-add-u1',
              name: { en: 'Tiny Sums', es: 'Sumas pequeñas' },
              order: 1,
              activities: [
                { activityId: 'math-add-1', order: 1, required: true },
                { activityId: 'math-add-2', order: 2, required: true },
                { activityId: 'math-add-3', order: 3, required: true },
              ],
            },
            {
              id: 'math-add-l2',
              unitId: 'math-add-u1',
              name: { en: 'Bigger Sums', es: 'Sumas más grandes' },
              order: 2,
              activities: [
                { activityId: 'math-add-4', order: 1, required: true },
                { activityId: 'math-add-5', order: 2, required: true },
                { activityId: 'math-add-6', order: 3, required: true },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'math-subtraction',
      worldId: 'math',
      name: { en: 'Subtraction', es: 'Restas' },
      description: { en: 'Learn to take away numbers', es: 'Aprende a restar números' },
      thumbnailPath: '/images/topics/subtraction.png',
      units: [
        {
          id: 'math-sub-u1',
          topicId: 'math-subtraction',
          name: { en: 'Taking Away', es: 'Quitando' },
          order: 1,
          lessons: [
            {
              id: 'math-sub-l1',
              unitId: 'math-sub-u1',
              name: { en: 'Easy Subtraction', es: 'Restas fáciles' },
              order: 1,
              activities: [
                { activityId: 'math-sub-1', order: 1, required: true },
                { activityId: 'math-sub-2', order: 2, required: true },
              ],
            },
            {
              id: 'math-sub-l2',
              unitId: 'math-sub-u1',
              name: { en: 'Harder Subtraction', es: 'Restas difíciles' },
              order: 2,
              activities: [
                { activityId: 'math-sub-3', order: 1, required: true },
                { activityId: 'math-sub-4', order: 2, required: true },
                { activityId: 'math-sub-5', order: 3, required: true },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'math-counting-11-20',
      worldId: 'math',
      name: { en: 'Counting 11–20', es: 'Contar 11–20' },
      description: { en: 'Count bigger numbers!', es: '¡Cuenta números más grandes!' },
      thumbnailPath: '/images/topics/counting-teens.png',
      units: [
        {
          id: 'math-c1120-u1',
          topicId: 'math-counting-11-20',
          name: { en: 'Teen Numbers', es: 'Números grandes' },
          order: 1,
          lessons: [
            {
              id: 'math-c1120-l1',
              unitId: 'math-c1120-u1',
              name: { en: 'Count 12 & 15', es: 'Cuenta 12 y 15' },
              order: 1,
              activities: [
                { activityId: 'math-count-12', order: 1, required: true },
                { activityId: 'math-count-15', order: 2, required: true },
              ],
            },
            {
              id: 'math-c1120-l2',
              unitId: 'math-c1120-u1',
              name: { en: 'Count 18 & 20', es: 'Cuenta 18 y 20' },
              order: 2,
              activities: [
                { activityId: 'math-count-18', order: 1, required: true },
                { activityId: 'math-count-20', order: 2, required: true },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'math-multiplication',
      worldId: 'math',
      name: { en: 'Multiplication', es: 'Multiplicación' },
      description: { en: 'Groups of groups!', es: '¡Grupos de grupos!' },
      thumbnailPath: '/images/topics/multiplication.png',
      units: [
        {
          id: 'math-mul-u1',
          topicId: 'math-multiplication',
          name: { en: 'Times Tables', es: 'Tablas de multiplicar' },
          order: 1,
          lessons: [
            {
              id: 'math-mul-l1',
              unitId: 'math-mul-u1',
              name: { en: 'Times 2', es: 'Tabla del 2' },
              order: 1,
              activities: [
                { activityId: 'math-mul-1', order: 1, required: true },
                { activityId: 'math-mul-2', order: 2, required: true },
              ],
            },
            {
              id: 'math-mul-l2',
              unitId: 'math-mul-u1',
              name: { en: 'Times 3 & 5', es: 'Tabla del 3 y 5' },
              order: 2,
              activities: [
                { activityId: 'math-mul-3', order: 1, required: true },
                { activityId: 'math-mul-4', order: 2, required: true },
                { activityId: 'math-mul-5', order: 3, required: true },
                { activityId: 'math-mul-6', order: 4, required: true },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'math-division',
      worldId: 'math',
      name: { en: 'Division', es: 'División' },
      description: { en: 'Share things equally!', es: '¡Reparte las cosas por igual!' },
      thumbnailPath: '/images/topics/division.png',
      units: [
        {
          id: 'math-div-u1',
          topicId: 'math-division',
          name: { en: 'Sharing', es: 'Repartir' },
          order: 1,
          lessons: [
            {
              id: 'math-div-l1',
              unitId: 'math-div-u1',
              name: { en: 'Divide by 2', es: 'Dividir entre 2' },
              order: 1,
              activities: [
                { activityId: 'math-div-1', order: 1, required: true },
                { activityId: 'math-div-2', order: 2, required: true },
              ],
            },
            {
              id: 'math-div-l2',
              unitId: 'math-div-u1',
              name: { en: 'Divide by 3 & 5', es: 'Dividir entre 3 y 5' },
              order: 2,
              activities: [
                { activityId: 'math-div-3', order: 1, required: true },
                { activityId: 'math-div-4', order: 2, required: true },
                { activityId: 'math-div-5', order: 3, required: true },
                { activityId: 'math-div-6', order: 4, required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
};
