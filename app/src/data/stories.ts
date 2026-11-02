import type { I18nString } from '@/types';

export interface StoryPage {
  text: I18nString;
  emoji: string;
  bg: string;
}

export interface StoryQuestion {
  question: I18nString;
  options: Array<{ text: I18nString; correct: boolean }>;
}

export interface StoryDef {
  id: string;
  worldId: string;
  title: I18nString;
  pages: StoryPage[];
  questions: StoryQuestion[];
}

export const stories: StoryDef[] = [
  // ABC World
  {
    id: 'story-abc-adventure-a',
    worldId: 'abc',
    title: { en: 'The Adventure of A', es: 'La aventura de la A' },
    pages: [
      {
        emoji: '🅰️',
        bg: 'linear-gradient(135deg, #ff9a9e, #fad0c4)',
        text: {
          en: 'One day, the letter A went for a walk.',
          es: 'Un día, la letra A salió a pasear.',
        },
      },
      {
        emoji: '🍎',
        bg: 'linear-gradient(135deg, #f093fb, #f5576c)',
        text: {
          en: 'A found an apple! Apple starts with A!',
          es: '¡A encontró una manzana! Manzana empieza con M, pero Apple empieza con A!',
        },
      },
      {
        emoji: '🐜',
        bg: 'linear-gradient(135deg, #a8edea, #fed6e3)',
        text: {
          en: 'Then A met a little ant. Ant starts with A too!',
          es: '¡Luego A conoció a una hormiguita! Ant empieza con A también!',
        },
      },
      {
        emoji: '✈️',
        bg: 'linear-gradient(135deg, #89f7fe, #66a6ff)',
        text: {
          en: 'Finally, A flew in an airplane! A has so many friends!',
          es: '¡Al final, A voló en un avión! ¡A tiene muchos amigos!',
        },
      },
    ],
    questions: [
      {
        question: { en: 'What fruit did A find?', es: '¿Qué fruta encontró la A?' },
        options: [
          { text: { en: 'Apple', es: 'Manzana' }, correct: true },
          { text: { en: 'Banana', es: 'Plátano' }, correct: false },
          { text: { en: 'Orange', es: 'Naranja' }, correct: false },
        ],
      },
      {
        question: { en: 'What small animal did A meet?', es: '¿Qué animalito conoció la A?' },
        options: [
          { text: { en: 'Cat', es: 'Gato' }, correct: false },
          { text: { en: 'Ant', es: 'Hormiga' }, correct: true },
          { text: { en: 'Dog', es: 'Perro' }, correct: false },
        ],
      },
    ],
  },

  // 123 World
  {
    id: 'story-123-three-bears',
    worldId: 'numbers',
    title: { en: 'The Three Bears', es: 'Los tres ositos' },
    pages: [
      {
        emoji: '🐻',
        bg: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
        text: {
          en: 'There were 3 bears: Papa Bear, Mama Bear, and Baby Bear.',
          es: 'Había 3 osos: Papá Oso, Mamá Osa y el Osito.',
        },
      },
      {
        emoji: '🪑',
        bg: 'linear-gradient(135deg, #f6d365, #fda085)',
        text: {
          en: 'They had 3 chairs: 1 big, 1 medium, 1 small.',
          es: 'Tenían 3 sillas: 1 grande, 1 mediana, 1 pequeña.',
        },
      },
      {
        emoji: '🥣',
        bg: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)',
        text: {
          en: 'And 3 bowls of porridge! 1, 2, 3!',
          es: '¡Y 3 platos de sopa! ¡1, 2, 3!',
        },
      },
      {
        emoji: '🛏️',
        bg: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)',
        text: {
          en: 'Baby Bear counted 3 beds. Time to sleep! Good night!',
          es: 'El Osito contó 3 camas. ¡A dormir! ¡Buenas noches!',
        },
      },
    ],
    questions: [
      {
        question: { en: 'How many bears were there?', es: '¿Cuántos osos había?' },
        options: [
          { text: { en: '2', es: '2' }, correct: false },
          { text: { en: '3', es: '3' }, correct: true },
          { text: { en: '5', es: '5' }, correct: false },
        ],
      },
      {
        question: { en: 'What did they eat?', es: '¿Qué comieron?' },
        options: [
          { text: { en: 'Pizza', es: 'Pizza' }, correct: false },
          { text: { en: 'Porridge', es: 'Sopa' }, correct: true },
          { text: { en: 'Cake', es: 'Pastel' }, correct: false },
        ],
      },
    ],
  },

  // Colors World
  {
    id: 'story-colors-rainbow',
    worldId: 'colors',
    title: { en: 'The Magic Rainbow', es: 'El arcoíris mágico' },
    pages: [
      {
        emoji: '🌈',
        bg: 'linear-gradient(135deg, #f093fb, #f5576c)',
        text: {
          en: 'One morning, the rainbow lost all its colors!',
          es: '¡Una mañana, el arcoíris perdió todos sus colores!',
        },
      },
      {
        emoji: '🔴',
        bg: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
        text: {
          en: 'First we found RED hiding in a strawberry!',
          es: '¡Primero encontramos el ROJO escondido en una fresa!',
        },
      },
      {
        emoji: '🟡',
        bg: 'linear-gradient(135deg, #f9ca24, #f0932b)',
        text: {
          en: 'Then YELLOW was sleeping in a sunflower!',
          es: '¡Luego el AMARILLO dormía en un girasol!',
        },
      },
      {
        emoji: '🔵',
        bg: 'linear-gradient(135deg, #54a0ff, #2e86de)',
        text: {
          en: 'And BLUE was swimming in the ocean!',
          es: '¡Y el AZUL nadaba en el océano!',
        },
      },
      {
        emoji: '🌈',
        bg: 'linear-gradient(135deg, #ff9ff3, #feca57, #48dbfb)',
        text: {
          en: 'All colors came back! The rainbow shines again!',
          es: '¡Todos los colores volvieron! ¡El arcoíris brilla otra vez!',
        },
      },
    ],
    questions: [
      {
        question: { en: 'Where was RED hiding?', es: '¿Dónde se escondía el ROJO?' },
        options: [
          { text: { en: 'In a strawberry', es: 'En una fresa' }, correct: true },
          { text: { en: 'In the sky', es: 'En el cielo' }, correct: false },
          { text: { en: 'In a tree', es: 'En un árbol' }, correct: false },
        ],
      },
      {
        question: { en: 'Where was BLUE swimming?', es: '¿Dónde nadaba el AZUL?' },
        options: [
          { text: { en: 'In a pool', es: 'En una piscina' }, correct: false },
          { text: { en: 'In the river', es: 'En el río' }, correct: false },
          { text: { en: 'In the ocean', es: 'En el océano' }, correct: true },
        ],
      },
    ],
  },

  // Animals World
  {
    id: 'story-animals-farm',
    worldId: 'animals',
    title: { en: 'The Fun Farm', es: 'La granja divertida' },
    pages: [
      {
        emoji: '🏡',
        bg: 'linear-gradient(135deg, #b8e994, #78e08f)',
        text: {
          en: 'Welcome to the farm! Let us meet the animals!',
          es: '¡Bienvenidos a la granja! ¡Vamos a conocer a los animales!',
        },
      },
      {
        emoji: '🐄',
        bg: 'linear-gradient(135deg, #dfe6e9, #b2bec3)',
        text: {
          en: 'The cow says MOO! She gives us milk every day.',
          es: '¡La vaca dice MUU! Nos da leche todos los días.',
        },
      },
      {
        emoji: '🐔',
        bg: 'linear-gradient(135deg, #ffeaa7, #fdcb6e)',
        text: {
          en: 'The hen says CLUCK! She lays eggs for breakfast.',
          es: '¡La gallina dice COCO! Pone huevos para el desayuno.',
        },
      },
      {
        emoji: '🐷',
        bg: 'linear-gradient(135deg, #fab1a0, #e17055)',
        text: {
          en: 'The pig says OINK! He loves to play in the mud.',
          es: '¡El cerdo dice OINC! Le encanta jugar en el barro.',
        },
      },
    ],
    questions: [
      {
        question: { en: 'What does the cow give us?', es: '¿Qué nos da la vaca?' },
        options: [
          { text: { en: 'Eggs', es: 'Huevos' }, correct: false },
          { text: { en: 'Milk', es: 'Leche' }, correct: true },
          { text: { en: 'Wool', es: 'Lana' }, correct: false },
        ],
      },
      {
        question: { en: 'Where does the pig play?', es: '¿Dónde juega el cerdo?' },
        options: [
          { text: { en: 'In the water', es: 'En el agua' }, correct: false },
          { text: { en: 'In the mud', es: 'En el barro' }, correct: true },
          { text: { en: 'In the snow', es: 'En la nieve' }, correct: false },
        ],
      },
    ],
  },

  // Food World
  {
    id: 'story-food-salad',
    worldId: 'food',
    title: { en: 'The Giant Salad', es: 'La ensalada gigante' },
    pages: [
      {
        emoji: '👨‍🍳',
        bg: 'linear-gradient(135deg, #55efc4, #00b894)',
        text: {
          en: 'Today we will make a giant salad! Let us get the food!',
          es: '¡Hoy haremos una ensalada gigante! ¡Vamos a buscar la comida!',
        },
      },
      {
        emoji: '🥬',
        bg: 'linear-gradient(135deg, #a3cb38, #009432)',
        text: {
          en: 'First, we need lettuce. It is green and crunchy!',
          es: 'Primero, necesitamos lechuga. ¡Es verde y crujiente!',
        },
      },
      {
        emoji: '🍅',
        bg: 'linear-gradient(135deg, #ff7675, #d63031)',
        text: {
          en: 'Then a red tomato. Round and juicy!',
          es: 'Luego un tomate rojo. ¡Redondo y jugoso!',
        },
      },
      {
        emoji: '🥗',
        bg: 'linear-gradient(135deg, #badc58, #6ab04c)',
        text: {
          en: 'Mix it all together! Our giant salad is ready!',
          es: '¡Mezclamos todo! ¡Nuestra ensalada gigante está lista!',
        },
      },
    ],
    questions: [
      {
        question: { en: 'What color is the tomato?', es: '¿De qué color es el tomate?' },
        options: [
          { text: { en: 'Green', es: 'Verde' }, correct: false },
          { text: { en: 'Red', es: 'Rojo' }, correct: true },
          { text: { en: 'Blue', es: 'Azul' }, correct: false },
        ],
      },
      {
        question: { en: 'What did we make?', es: '¿Qué hicimos?' },
        options: [
          { text: { en: 'A cake', es: 'Un pastel' }, correct: false },
          { text: { en: 'A salad', es: 'Una ensalada' }, correct: true },
          { text: { en: 'A pizza', es: 'Una pizza' }, correct: false },
        ],
      },
    ],
  },

  // Music World
  {
    id: 'story-music-orchestra',
    worldId: 'music',
    title: { en: 'The Forest Orchestra', es: 'La orquesta del bosque' },
    pages: [
      {
        emoji: '🌲',
        bg: 'linear-gradient(135deg, #c3cfe2, #f5f7fa)',
        text: {
          en: 'In the forest, the animals wanted to make music!',
          es: '¡En el bosque, los animales querían hacer música!',
        },
      },
      {
        emoji: '🐻🥁',
        bg: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
        text: {
          en: 'The bear plays the drum! BOM BOM BOM!',
          es: '¡El oso toca el tambor! ¡BOM BOM BOM!',
        },
      },
      {
        emoji: '🐱🎸',
        bg: 'linear-gradient(135deg, #e0c3fc, #8ec5fc)',
        text: {
          en: 'The cat plays the guitar! TRAN TRAN TRAN!',
          es: '¡El gato toca la guitarra! ¡TRAN TRAN TRAN!',
        },
      },
      {
        emoji: '🎶',
        bg: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)',
        text: {
          en: 'Together they make beautiful music! Everyone dances!',
          es: '¡Juntos hacen música bonita! ¡Todos bailan!',
        },
      },
    ],
    questions: [
      {
        question: { en: 'What does the bear play?', es: '¿Qué toca el oso?' },
        options: [
          { text: { en: 'Guitar', es: 'Guitarra' }, correct: false },
          { text: { en: 'Drum', es: 'Tambor' }, correct: true },
          { text: { en: 'Piano', es: 'Piano' }, correct: false },
        ],
      },
      {
        question: { en: 'What does the cat play?', es: '¿Qué toca el gato?' },
        options: [
          { text: { en: 'Flute', es: 'Flauta' }, correct: false },
          { text: { en: 'Drum', es: 'Tambor' }, correct: false },
          { text: { en: 'Guitar', es: 'Guitarra' }, correct: true },
        ],
      },
    ],
  },
];

export function getStoriesByWorld(worldId: string): StoryDef[] {
  return stories.filter((s) => s.worldId === worldId);
}

export function getStory(storyId: string): StoryDef | undefined {
  return stories.find((s) => s.id === storyId);
}
