export interface PianoSong {
  name: string;
  emoji: string;
  cat: 'infantil' | 'kpop';
  artist?: string;
  notes: string[];
  rhythm?: number[];
}

export const NOTE_FREQ: Record<string, number> = {
  Do: 261.63, 'Do#': 277.18, Re: 293.66, 'Re#': 311.13, Mi: 329.63,
  Fa: 349.23, 'Fa#': 369.99, Sol: 392, 'Sol#': 415.30, La: 440,
  'La#': 466.16, Si: 493.88,
  Do2: 523.25, 'Do2#': 554.37, Re2: 587.33, 'Re2#': 622.25, Mi2: 659.25,
  Fa2: 698.46, 'Fa2#': 739.99, Sol2: 783.99, 'Sol2#': 830.61, La2: 880,
  'La2#': 932.33, Si2: 987.77,
  Do3: 1046.50,
};

export const NOTE_COLORS: Record<string, string> = {
  Do: '#FF6B6B', Re: '#FFA94D', Mi: '#FFD43B', Fa: '#69DB7C',
  Sol: '#4DABF7', La: '#9775FA', Si: '#F06595',
  Do2: '#FF8787', Re2: '#FFB86B', Mi2: '#FFE066', Fa2: '#8CE99A',
  Sol2: '#74C0FC', La2: '#B197FC', Si2: '#F783AC', Do3: '#FFA0A0',
};

export const NOTES_ORDER = [
  'Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si',
  'Do2', 'Re2', 'Mi2', 'Fa2', 'Sol2', 'La2', 'Si2', 'Do3',
];

export function autoRhythm(len: number): number[] {
  const r: number[] = [];
  for (let i = 0; i < len; i++) r.push(1);
  const pl = len <= 16 ? 4 : len <= 24 ? 6 : 7;
  for (let i = pl - 1; i < len - 1; i += pl) r[i] = 2;
  r[len - 1] = 3;
  return r;
}

export function getSongRhythm(s: PianoSong): number[] {
  return s.rhythm ?? autoRhythm(s.notes.length);
}

export function blockHeight(r: number): number {
  return 26 + r * 16;
}

export function noteDuration(r: number): number {
  return 0.35 + (r - 1) * 0.4;
}

export const SONGS: PianoSong[] = [
  { name: 'Estrellita', emoji: '⭐', cat: 'infantil',
    notes: ['Do','Do','Sol','Sol','La','La','Sol','Fa','Fa','Mi','Mi','Re','Re','Do','Sol','Sol','Fa','Fa','Mi','Mi','Re','Sol','Sol','Fa','Fa','Mi','Mi','Re','Do','Do','Sol','Sol','La','La','Sol','Fa','Fa','Mi','Mi','Re','Re','Do'],
    rhythm: [1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,3] },
  { name: 'Martinillo', emoji: '🔔', cat: 'infantil',
    notes: ['Do','Re','Mi','Do','Do','Re','Mi','Do','Mi','Fa','Sol','Mi','Fa','Sol','Sol','La','Sol','Fa','Mi','Do','Sol','La','Sol','Fa','Mi','Do','Do','Sol','Do','Do','Sol','Do'],
    rhythm: [1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,3] },
  { name: 'Cumpleaños Feliz', emoji: '🎂', cat: 'infantil',
    notes: ['Do','Do','Re','Do','Fa','Mi','Do','Do','Re','Do','Sol','Fa','Do','Do','Do2','La','Fa','Mi','Re','Si','Si','La','Fa','Sol','Fa'],
    rhythm: [1,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,3] },
  { name: 'Los Pollitos Dicen', emoji: '🐥', cat: 'infantil',
    notes: ['Mi','Sol','Sol','Mi','Sol','Sol','Mi','Re','Re','Fa','Fa','Re','Fa','Fa','Re','Do','Mi','Sol','Sol','Mi','Sol','Mi','Re','Re','Fa','Mi','Re','Do'] },
  { name: 'La Vaca Lola', emoji: '🐄', cat: 'infantil',
    notes: ['Do','Do','Mi','Sol','Sol','Do','Do','Mi','Sol','Sol','Sol','Sol','La','Sol','Fa','Mi','Mi','Re','Do','Do','Do','Mi','Sol','Sol','Sol','La','Sol','Fa','Mi','Re','Do'] },
  { name: 'Pin Pon', emoji: '🧸', cat: 'infantil',
    notes: ['Sol','Mi','Sol','La','Sol','Fa','Mi','Mi','Re','Mi','Fa','Mi','Re','Do','Sol','Mi','Sol','La','Sol','Fa','Mi','Mi','Fa','Mi','Re','Do'] },
  { name: 'Cucú Cantaba la Rana', emoji: '🐸', cat: 'infantil',
    notes: ['Sol','Mi','Sol','Mi','Sol','La','Sol','Fa','Mi','Re','Sol','Mi','Sol','Mi','Sol','La','Sol','Fa','Mi','Do','Sol','Mi','Sol','Mi','Sol','La','Sol','Fa','Mi','Re','Mi','Fa','Mi','Re','Do'] },
  { name: 'Debajo de un Botón', emoji: '🔘', cat: 'infantil',
    notes: ['Sol','Sol','Sol','La','Sol','Fa','Mi','Mi','Re','Re','Re','Mi','Fa','Mi','Re','Sol','Sol','Sol','La','Sol','Fa','Mi','Mi','Re','Re','Mi','Re','Do'] },
  { name: 'El Barquito Chiquitito', emoji: '⛵', cat: 'infantil',
    notes: ['Do','Do','Do','Re','Mi','Mi','Mi','Mi','Mi','Re','Do','Re','Mi','Re','Do','Do','Do','Re','Mi','Mi','Mi','Mi','Re','Do','Re','Do'] },
  { name: 'Un Elefante', emoji: '🐘', cat: 'infantil',
    notes: ['Do','Re','Mi','Fa','Sol','Sol','Sol','Sol','Fa','Mi','Re','Mi','Fa','Sol','La','Sol','Fa','Mi','Re','Do','Sol','Fa','Mi','Re','Do'] },
  { name: 'Tengo una Muñeca', emoji: '👗', cat: 'infantil',
    notes: ['Mi','Sol','Sol','La','Sol','Fa','Mi','Re','Do','Re','Mi','Mi','Sol','Sol','La','Sol','Fa','Mi','Re','Mi','Re','Do'] },
  { name: 'Arroz con Leche', emoji: '🍚', cat: 'infantil',
    notes: ['Sol','La','Sol','Fa','Mi','Re','Mi','Fa','Sol','La','Sol','Sol','La','Sol','Fa','Mi','Re','Mi','Fa','Mi','Re','Do'] },
  { name: 'Que Llueva', emoji: '🌧️', cat: 'infantil',
    notes: ['Sol','Sol','Mi','Sol','Sol','Mi','La','Sol','Fa','Mi','Re','Sol','Sol','Mi','Sol','Sol','Mi','La','Sol','Fa','Mi','Do'] },
  { name: 'Sol Solecito', emoji: '☀️', cat: 'infantil',
    notes: ['Sol','La','Sol','Fa','Mi','Mi','Fa','Sol','La','Sol','Sol','La','Sol','Fa','Mi','Fa','Mi','Re','Do'] },
  { name: 'La Araña Pequeñita', emoji: '🕷️', cat: 'infantil',
    notes: ['Do','Mi','Mi','Mi','Fa','Sol','Sol','La','Sol','Fa','Mi','Do','Do','Mi','Mi','Mi','Fa','Sol','Sol','Fa','Mi','Re','Do'] },
  { name: 'Palmas Palmitas', emoji: '👏', cat: 'infantil',
    notes: ['Do','Mi','Sol','Sol','Mi','Do','Mi','Sol','Sol','Mi','Sol','Fa','Mi','Re','Do','Sol','Fa','Mi','Re','Do'] },
  { name: 'Cinco Lobitos', emoji: '🐺', cat: 'infantil',
    notes: ['Mi','Sol','Sol','La','Sol','Fa','Mi','Mi','Re','Mi','Fa','Mi','Re','Do','Mi','Sol','Sol','La','Sol','Fa','Mi','Fa','Mi','Re','Do'] },
  { name: 'El Cocherito Leré', emoji: '🚗', cat: 'infantil',
    notes: ['Do','Mi','Sol','Sol','La','Sol','Fa','Fa','Mi','Re','Do','Mi','Sol','Sol','La','Sol','Fa','Mi','Re','Do'] },
  { name: 'Don Gato', emoji: '🐱', cat: 'infantil',
    notes: ['Mi','Mi','Fa','Sol','Sol','La','Sol','Fa','Mi','Re','Mi','Fa','Mi','Re','Do','Mi','Mi','Fa','Sol','Sol','La','Sol','Fa','Mi','Re','Do'] },
  { name: 'Aserrín Aserrán', emoji: '🪚', cat: 'infantil',
    notes: ['Sol','Sol','Sol','Mi','Sol','Sol','Sol','Mi','Sol','La','Si','Do2','Si','La','Sol','Sol','Sol','Sol','Mi','Sol','Sol','Sol','Mi','Sol','Fa','Mi','Re','Do'] },
  { name: 'A mi Burro', emoji: '🫏', cat: 'infantil',
    notes: ['Sol','Sol','Mi','Sol','Sol','Mi','Sol','La','Sol','Fa','Mi','Re','Sol','Sol','Mi','Sol','Sol','Mi','Sol','Fa','Mi','Re','Do'] },
  { name: 'Mambrú', emoji: '🎖️', cat: 'infantil',
    notes: ['Do','Mi','Mi','Re','Mi','Fa','Mi','Re','Do','Re','Mi','Re','Do','Sol','Fa','Mi','Re','Mi','Fa','Sol','Fa','Mi','Re','Do'] },
  { name: 'Al Pasar la Barca', emoji: '🚤', cat: 'infantil',
    notes: ['Mi','Sol','Sol','La','Sol','Mi','Sol','Sol','Fa','Mi','Mi','Sol','Sol','La','Sol','Fa','Mi','Re','Do'] },
  { name: 'Soy una Taza', emoji: '☕', cat: 'infantil',
    notes: ['Do','Mi','Sol','Sol','La','Sol','Mi','Sol','La','Sol','Fa','Mi','Do','Mi','Sol','Sol','La','Sol','Fa','Mi','Re','Do'] },
  { name: 'Juan Pequeño Baila', emoji: '🕺', cat: 'infantil',
    notes: ['Do','Mi','Sol','Sol','Sol','Sol','La','Sol','Fa','Mi','Re','Do','Mi','Sol','Sol','Sol','Sol','La','Sol','Fa','Mi','Do'] },
  { name: 'La Tarara', emoji: '💃', cat: 'infantil',
    notes: ['Sol','La','Si','Do2','Si','La','Sol','Sol','La','Si','Do2','Si','La','Sol','La','Sol','Fa','Mi','Fa','Sol','La','Sol','Fa','Mi','Re','Do'] },
  { name: 'En la Granja', emoji: '🐓', cat: 'infantil',
    notes: ['Do','Do','Do','Sol','La','La','Sol','Mi','Mi','Re','Re','Do','Sol','Do','Do','Do','Sol','La','La','Sol','Mi','Mi','Re','Re','Do'] },
  { name: 'Al Corro de la Patata', emoji: '🥔', cat: 'infantil',
    notes: ['Sol','Sol','La','La','Sol','Sol','Mi','Sol','Sol','La','La','Sol','Sol','Mi','Sol','La','Sol','Fa','Mi','Re','Do','Sol','La','Sol','Fa','Mi','Do'] },
  { name: 'Golden', emoji: '🌟', cat: 'kpop', artist: 'Guerreras K-Pop',
    notes: ['Mi','Mi','Mi','Mi','Re','Do','Mi','Mi','Mi','Mi','Mi','Mi','Mi','Mi','Mi','Re','Do','La','La','La','La','Sol','Fa','Mi','Mi','Mi','Fa','Mi','Re','Do'],
    rhythm: [1,1,1,1,1,3,1,1,1,2,3,1,1,1,1,1,3,1,1,1,1,1,3,2,2,1,1,1,1,3] },
  { name: 'Soda Pop', emoji: '🥤', cat: 'kpop', artist: 'Guerreras K-Pop',
    notes: ['Do','Mi','Sol','Sol','La','Sol','Mi','Do','Re','Mi','Re','Do','Do','Mi','Sol','Sol','La','Sol','Mi','Do','Fa','Fa','Mi','Re','Do'],
    rhythm: [1,1,1,1,1,1,2,1,1,1,1,3,1,1,1,1,1,1,2,1,1,1,1,1,3] },
  { name: "How It's Done", emoji: '🎤', cat: 'kpop', artist: 'Guerreras K-Pop',
    notes: ['Sol','La','Sol','Mi','Sol','La','Sol','Mi','Do2','Si','La','Sol','Fa','Mi','Re','Do','Do','Re','Mi','Fa','Sol','La','Sol','Fa','Mi','Re','Do'],
    rhythm: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,3] },
];

export const CARD_COLORS = [
  'linear-gradient(135deg,#FF6B6B,#c0392b)', 'linear-gradient(135deg,#FFA94D,#e67e22)',
  'linear-gradient(135deg,#FFD43B,#f39c12)', 'linear-gradient(135deg,#69DB7C,#27ae60)',
  'linear-gradient(135deg,#4DABF7,#2980b9)', 'linear-gradient(135deg,#9775FA,#8e44ad)',
  'linear-gradient(135deg,#F06595,#e84393)', 'linear-gradient(135deg,#20c997,#0ca678)',
  'linear-gradient(135deg,#fcc419,#e8590c)', 'linear-gradient(135deg,#74c0fc,#4263eb)',
];
