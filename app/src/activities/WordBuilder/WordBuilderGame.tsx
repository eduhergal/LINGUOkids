import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './WordBuilderGame.css';

interface Props {
  word: string;
  hint: { en: string; es: string };
  emoji: string;
  onComplete: (score: number) => void;
}

export function WordBuilderGame({ word, hint, emoji, onComplete }: Props) {
  const letters = useMemo(
    () =>
      word
        .toUpperCase()
        .split('')
        .map((ch, i) => ({ id: `${ch}-${i}`, letter: ch }))
        .sort(() => Math.random() - 0.5),
    [word],
  );

  const [placed, setPlaced] = useState<Array<{ id: string; letter: string }>>([]);
  const [errors, setErrors] = useState(0);
  const [shakeIdx, setShakeIdx] = useState(-1);

  const target = word.toUpperCase();
  const available = letters.filter((l) => !placed.find((p) => p.id === l.id));

  const handleTap = (tile: { id: string; letter: string }) => {
    const nextIdx = placed.length;
    if (tile.letter === target[nextIdx]) {
      const next = [...placed, tile];
      setPlaced(next);
      if (next.length === target.length) {
        const score = errors === 0 ? 3 : errors <= 2 ? 2 : 1;
        setTimeout(() => onComplete(score), 600);
      }
    } else {
      setErrors((e) => e + 1);
      setShakeIdx(nextIdx);
      setTimeout(() => setShakeIdx(-1), 400);
    }
  };

  const handleRemove = (idx: number) => {
    setPlaced((prev) => prev.slice(0, idx));
  };

  return (
    <div className="word-builder">
      <div className="word-builder__hint">
        <span className="word-builder__emoji">{emoji}</span>
        <span className="word-builder__hint-text">{hint.es || hint.en}</span>
      </div>

      <div className="word-builder__slots">
        {target.split('').map((ch, i) => (
          <motion.div
            key={i}
            className={`word-builder__slot ${placed[i] ? 'word-builder__slot--filled' : ''} ${shakeIdx === i ? 'word-builder__slot--shake' : ''}`}
            onClick={() => placed[i] && handleRemove(i)}
          >
            {placed[i]?.letter ?? ''}
          </motion.div>
        ))}
      </div>

      <div className="word-builder__tiles">
        <AnimatePresence>
          {available.map((tile) => (
            <motion.button
              key={tile.id}
              className="word-builder__tile"
              onClick={() => handleTap(tile)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileTap={{ scale: 0.85 }}
              layout
            >
              {tile.letter}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
