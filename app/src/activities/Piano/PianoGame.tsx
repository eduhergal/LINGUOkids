import { useState, useRef, useCallback, useEffect } from 'react';
import { useTheme } from '@/themes/ThemeContext';
import {
  SONGS, NOTE_FREQ, NOTE_COLORS, NOTES_ORDER, CARD_COLORS,
  getSongRhythm, blockHeight, noteDuration,
  type PianoSong,
} from './songs';
import './PianoGame.css';

interface Props {
  onComplete: (stars: number) => void;
  mode?: 'song' | 'free';
}

interface NoteBlock {
  idx: number;
  note: string;
  laneIdx: number;
  startY: number;
  height: number;
  rhythm: number;
}

const CHEERS = ['¡Bien! 🌟', '¡Genial! ✨', '¡Sigue! 💪', '¡Bravo! 👏', '¡Wow! 🎉'];

let audioCtx: AudioContext | null = null;
let reverbDry: GainNode | null = null;
let reverbWet: ConvolverNode | null = null;

function ensureAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    try {
      const rate = audioCtx.sampleRate;
      const len = Math.floor(rate * 1.8);
      const buf = audioCtx.createBuffer(2, len, rate);
      for (let c = 0; c < 2; c++) {
        const d = buf.getChannelData(c);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      }
      const conv = audioCtx.createConvolver();
      conv.buffer = buf;
      const wet = audioCtx.createGain();
      wet.gain.setValueAtTime(0.12, 0);
      const dry = audioCtx.createGain();
      dry.gain.setValueAtTime(0.88, 0);
      conv.connect(wet);
      wet.connect(audioCtx.destination);
      dry.connect(audioCtx.destination);
      reverbDry = dry;
      reverbWet = conv;
    } catch { /* no reverb */ }
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playNote(noteName: string, dur = 0.5) {
  const freq = NOTE_FREQ[noteName];
  if (!freq) return;
  const ctx = ensureAudioCtx();
  const now = ctx.currentTime;
  const dryOut = reverbDry ?? ctx.destination;
  const wetOut = reverbWet;

  const o1 = ctx.createOscillator();
  const o2 = ctx.createOscillator();
  const o3 = ctx.createOscillator();
  const g1 = ctx.createGain();
  const g2 = ctx.createGain();
  const g3 = ctx.createGain();
  const flt = ctx.createBiquadFilter();
  const master = ctx.createGain();

  o1.type = 'triangle';
  o1.frequency.setValueAtTime(freq, now);
  o1.detune.setValueAtTime(-3, now);
  o2.type = 'sine';
  o2.frequency.setValueAtTime(freq * 2, now);
  o3.type = 'sine';
  o3.frequency.setValueAtTime(freq * 3, now);

  flt.type = 'lowpass';
  flt.frequency.setValueAtTime(Math.min(freq * 8, 10000), now);
  flt.frequency.exponentialRampToValueAtTime(Math.max(freq * 2, 300), now + dur * 0.6);
  flt.Q.setValueAtTime(0.7, now);

  g1.gain.setValueAtTime(0.001, now);
  g1.gain.linearRampToValueAtTime(0.28, now + 0.004);
  g1.gain.exponentialRampToValueAtTime(0.15, now + 0.08);
  g1.gain.exponentialRampToValueAtTime(0.001, now + dur + 0.3);

  g2.gain.setValueAtTime(0.001, now);
  g2.gain.linearRampToValueAtTime(0.12, now + 0.003);
  g2.gain.exponentialRampToValueAtTime(0.04, now + 0.06);
  g2.gain.exponentialRampToValueAtTime(0.001, now + dur * 0.7);

  g3.gain.setValueAtTime(0.001, now);
  g3.gain.linearRampToValueAtTime(0.06, now + 0.002);
  g3.gain.exponentialRampToValueAtTime(0.015, now + 0.05);
  g3.gain.exponentialRampToValueAtTime(0.001, now + dur * 0.5);

  master.gain.setValueAtTime(0.55, now);

  o1.connect(g1); g1.connect(flt);
  o2.connect(g2); g2.connect(flt);
  o3.connect(g3); g3.connect(flt);
  flt.connect(master);
  master.connect(dryOut);
  if (wetOut) master.connect(wetOut);

  const end = now + dur + 0.4;
  o1.start(now); o1.stop(end);
  o2.start(now); o2.stop(end);
  o3.start(now); o3.stop(end);
}

const BLOCK_GAP = 7;

export function PianoGame({ onComplete, mode = 'song' }: Props) {
  const { theme } = useTheme();
  const [screen, setScreen] = useState<'select' | 'play' | 'complete'>(mode === 'free' ? 'play' : 'select');
  const [songIdx, setSongIdx] = useState(0);
  const [freePlay, setFreePlay] = useState(mode === 'free');
  const [noteIdx, setNoteIdx] = useState(0);
  const [offset, setOffset] = useState(0);
  const [highlightNote, setHighlightNote] = useState('');
  const [shakeNote, setShakeNote] = useState('');
  const [cheer, setCheer] = useState('');
  const [stars, setStars] = useState(0);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [fadingBlocks, setFadingBlocks] = useState<Set<number>>(new Set());

  const playAreaRef = useRef<HTMLDivElement>(null);
  const noteIdxRef = useRef(0);
  const hitTimesRef = useRef<number[]>([]);
  const waitStartRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const touchMapRef = useRef<Map<number, string>>(new Map());

  const song: PianoSong | null = SONGS[songIdx] ?? null;

  const buildBlocks = useCallback((): NoteBlock[] => {
    if (!song || freePlay) return [];
    const rhythm = getSongRhythm(song);
    let cumY = 0;
    return song.notes.map((noteName, idx) => {
      const laneIdx = NOTES_ORDER.indexOf(noteName);
      const r = rhythm[idx] ?? 1;
      const h = blockHeight(r);
      cumY -= (h + BLOCK_GAP);
      return { idx, note: noteName, laneIdx, startY: cumY, height: h, rhythm: r };
    });
  }, [song, freePlay]);

  const blocksRef = useRef<NoteBlock[]>([]);

  const startSong = useCallback((idx: number) => {
    setSongIdx(idx);
    setFreePlay(false);
    setNoteIdx(0);
    noteIdxRef.current = 0;
    hitTimesRef.current = [];
    setOffset(0);
    setHighlightNote('');
    setFadingBlocks(new Set());
    setScreen('play');

    requestAnimationFrame(() => {
      const blocks = buildBlocks();
      blocksRef.current = blocks;
      if (blocks.length > 0) {
        const h = playAreaRef.current?.clientHeight ?? 400;
        const cb = blocks[0];
        const targetY = h - cb.height - 3;
        const off = targetY - cb.startY;
        isAnimatingRef.current = true;
        setOffset(off);
        setTimeout(() => {
          isAnimatingRef.current = false;
          setHighlightNote(cb.note);
          waitStartRef.current = performance.now();
        }, 450);
      }
    });
  }, [buildBlocks]);

  useEffect(() => {
    if (screen === 'play' && !freePlay && song) {
      const blocks = buildBlocks();
      blocksRef.current = blocks;
      if (blocks.length > 0) {
        const h = playAreaRef.current?.clientHeight ?? 400;
        const cb = blocks[0];
        const targetY = h - cb.height - 3;
        const off = targetY - cb.startY;
        isAnimatingRef.current = true;
        setOffset(off);
        setTimeout(() => {
          isAnimatingRef.current = false;
          setHighlightNote(cb.note);
          waitStartRef.current = performance.now();
        }, 450);
      }
    }
  }, [screen, freePlay, song, buildBlocks]);

  const advanceToNote = useCallback((idx: number) => {
    if (!song) return;
    if (idx >= song.notes.length) {
      const hitTimes = hitTimesRef.current;
      let quick = 0;
      for (const t of hitTimes) { if (t < 2000) quick++; }
      const ratio = hitTimes.length > 0 ? quick / hitTimes.length : 0;
      const s = ratio >= 0.8 ? 3 : ratio >= 0.5 ? 2 : 1;
      setStars(s);
      setScreen('complete');
      return;
    }
    const blocks = blocksRef.current;
    const cb = blocks[idx];
    if (!cb) return;
    const h = playAreaRef.current?.clientHeight ?? 400;
    const targetY = h - cb.height - 3;
    const off = targetY - cb.startY;
    isAnimatingRef.current = true;
    setOffset(off);
    setTimeout(() => {
      isAnimatingRef.current = false;
      setHighlightNote(cb.note);
      waitStartRef.current = performance.now();
    }, 450);
  }, [song]);

  const handleKeyPress = useCallback((noteName: string) => {
    ensureAudioCtx();

    if (freePlay) {
      playNote(noteName, 0.6);
      if (Math.random() < 0.15) {
        setCheer(CHEERS[Math.floor(Math.random() * CHEERS.length)]);
        setTimeout(() => setCheer(''), 1000);
      }
      return;
    }

    if (!song || isAnimatingRef.current) {
      playNote(noteName, 0.3);
      return;
    }

    const currentIdx = noteIdxRef.current;
    if (currentIdx >= song.notes.length) {
      playNote(noteName, 0.3);
      return;
    }

    const expected = song.notes[currentIdx];
    if (noteName !== expected) {
      playNote(noteName, 0.2);
      setShakeNote(noteName);
      setTimeout(() => setShakeNote(''), 300);
      return;
    }

    const hitDelay = performance.now() - waitStartRef.current;
    hitTimesRef.current.push(hitDelay);

    const rhythm = getSongRhythm(song);
    const r = rhythm[currentIdx] ?? 1;
    playNote(noteName, noteDuration(r));

    setFadingBlocks(prev => new Set(prev).add(currentIdx));

    if (Math.random() < 0.25 + r * 0.1) {
      setCheer(CHEERS[Math.floor(Math.random() * CHEERS.length)]);
      setTimeout(() => setCheer(''), 1000);
    }

    const nextIdx = currentIdx + 1;
    noteIdxRef.current = nextIdx;
    setNoteIdx(nextIdx);
    setHighlightNote('');
    advanceToNote(nextIdx);
  }, [song, freePlay, advanceToNote]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const newPressed = new Set(pressedKeys);
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      const el = document.elementFromPoint(t.clientX, t.clientY) as HTMLElement | null;
      const key = el?.closest('[data-piano-note]') as HTMLElement | null;
      if (key) {
        const note = key.dataset.pianoNote!;
        newPressed.add(note);
        touchMapRef.current.set(t.identifier, note);
        handleKeyPress(note);
      }
    }
    setPressedKeys(newPressed);
  }, [pressedKeys, handleKeyPress]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const newPressed = new Set(pressedKeys);
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      const note = touchMapRef.current.get(t.identifier);
      if (note) {
        newPressed.delete(note);
        touchMapRef.current.delete(t.identifier);
      }
    }
    setPressedKeys(newPressed);
  }, [pressedKeys]);

  const handleMouseDown = useCallback((noteName: string) => {
    setPressedKeys(new Set([noteName]));
    handleKeyPress(noteName);
  }, [handleKeyPress]);

  const handleMouseUp = useCallback(() => {
    setPressedKeys(new Set());
  }, []);

  // Song selector
  if (screen === 'select') {
    return (
      <div className="piano-select">
        <h2 className="piano-select__title">🎹 Elige una canción</h2>
        <div className="piano-select__grid">
          {SONGS.filter(s => s.cat === 'infantil').map((s, i) => {
            const realIdx = SONGS.indexOf(s);
            return (
              <button
                key={s.name}
                className="piano-select__card"
                style={{ background: CARD_COLORS[i % CARD_COLORS.length] }}
                onClick={() => startSong(realIdx)}
              >
                <span className="piano-select__emoji">{s.emoji}</span>
                <span className="piano-select__name">{s.name}</span>
              </button>
            );
          })}
        </div>
        <h3 className="piano-select__subtitle">💜 K-Pop</h3>
        <div className="piano-select__grid">
          {SONGS.filter(s => s.cat === 'kpop').map((s) => {
            const realIdx = SONGS.indexOf(s);
            return (
              <button
                key={s.name}
                className="piano-select__card piano-select__card--kpop"
                onClick={() => startSong(realIdx)}
              >
                <span className="piano-select__emoji">{s.emoji}</span>
                <span className="piano-select__name">{s.name}</span>
                {s.artist && <span className="piano-select__artist">{s.artist}</span>}
              </button>
            );
          })}
        </div>
        <button
          className="piano-select__free"
          onClick={() => { setFreePlay(true); setScreen('play'); }}
        >
          🎹 Modo Libre — Toca lo que quieras
        </button>
      </div>
    );
  }

  // Completion screen
  if (screen === 'complete') {
    return (
      <div className="piano-complete" style={{ background: `linear-gradient(160deg, ${theme.colors.gradientEnd}, ${theme.colors.gradientMid})` }}>
        <h2 className="piano-complete__title">⭐ ¡Bravo! ⭐</h2>
        <div className="piano-complete__stars">
          {[1, 2, 3].map(s => (
            <span key={s} className={`piano-complete__star ${s <= stars ? 'earned' : ''}`}>⭐</span>
          ))}
        </div>
        <p className="piano-complete__text">¡Has tocado {song?.name}!</p>
        <div className="piano-complete__actions">
          <button
            className="piano-complete__btn"
            style={{ background: theme.colors.primary }}
            onClick={() => { setScreen('select'); }}
          >
            Otra canción 🎶
          </button>
          <button
            className="piano-complete__btn piano-complete__btn--done"
            onClick={() => onComplete(stars)}
          >
            Terminar ✓
          </button>
        </div>
      </div>
    );
  }

  // Play screen
  const blocks = buildBlocks();
  const progress = song && !freePlay ? (noteIdx / song.notes.length) * 100 : 0;

  return (
    <div className="piano-play">
      {/* Header */}
      <div className="piano-play__header">
        <span className="piano-play__song-name">
          {freePlay ? '🎹 Modo Libre' : `${song?.emoji} ${song?.name}`}
        </span>
        {!freePlay && (
          <div className="piano-play__progress">
            <div className="piano-play__progress-fill" style={{ width: `${progress}%`, background: theme.colors.primary }} />
          </div>
        )}
      </div>

      {/* Cheer */}
      {cheer && <div className="piano-play__cheer">{cheer}</div>}

      {/* Play area with falling notes */}
      <div className="piano-play__area" ref={playAreaRef}>
        {freePlay && (
          <div className="piano-play__free-overlay">
            <span className="piano-play__free-icon">🎹</span>
            <span className="piano-play__free-text">Toca lo que quieras</span>
          </div>
        )}
        {!freePlay && blocks.map(b => {
          const col = NOTE_COLORS[b.note] ?? '#fff';
          const isFading = fadingBlocks.has(b.idx);
          const leftPct = (b.laneIdx / NOTES_ORDER.length) * 100;
          const widthPct = (1 / NOTES_ORDER.length) * 100;
          const isWaiting = b.idx === noteIdx && !isAnimatingRef.current && !isFading;
          return (
            <div
              key={b.idx}
              className={`piano-block ${isWaiting ? 'waiting' : ''} ${isFading ? 'fading' : ''}`}
              style={{
                top: b.startY + offset,
                left: `${leftPct + widthPct * 0.1}%`,
                width: `${widthPct * 0.8}%`,
                height: b.height,
                background: `linear-gradient(135deg, ${col}, ${col}cc)`,
                boxShadow: `0 0 8px ${col}66`,
                transition: 'top 450ms cubic-bezier(0.22,0.61,0.36,1)',
              }}
            >
              {b.note.replace(/\d+/, '')}
            </div>
          );
        })}
      </div>

      {/* Keyboard */}
      <div
        className="piano-keyboard"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onMouseUp={handleMouseUp}
      >
        {NOTES_ORDER.map((note, i) => {
          const col = NOTE_COLORS[note] ?? '#ccc';
          const isHighlight = note === highlightNote;
          const isPressed = pressedKeys.has(note);
          const isShake = note === shakeNote;
          const isOct2 = i >= 7;
          return (
            <div
              key={note}
              data-piano-note={note}
              className={`piano-key ${isPressed ? 'pressed' : ''} ${isHighlight ? 'highlight' : ''} ${isShake ? 'shake' : ''} ${isOct2 ? 'oct2' : ''}`}
              onMouseDown={() => handleMouseDown(note)}
            >
              <div className="piano-key__dot" style={{ background: col, boxShadow: `0 0 8px ${col}` }} />
              <span className="piano-key__label">{note.replace(/\d+/, '')}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
