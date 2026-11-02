import { useState } from 'react';
import { motion } from 'framer-motion';
import './ISpyGame.css';

interface Props {
  targets: string[];
  scene: string[];
  onComplete: (score: number) => void;
}

export function ISpyGame({ targets, scene, onComplete }: Props) {
  const [found, setFound] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);
  const [errors, setErrors] = useState(0);

  const handleTap = (emoji: string) => {
    if (found.has(emoji)) return;

    if (targets.includes(emoji)) {
      const next = new Set(found);
      next.add(emoji);
      setFound(next);
      if (next.size === targets.length) {
        const score = errors === 0 ? 3 : errors <= 2 ? 2 : 1;
        setTimeout(() => onComplete(score), 400);
      }
    } else {
      setWrong(emoji);
      setErrors((e) => e + 1);
      setTimeout(() => setWrong(null), 400);
    }
  };

  return (
    <div className="ispy">
      <div className="ispy__targets">
        {targets.map((t) => (
          <span key={t} className={`ispy__target ${found.has(t) ? 'ispy__target--found' : ''}`}>
            {t}
          </span>
        ))}
      </div>
      <div className="ispy__scene">
        {scene.map((emoji, i) => (
          <motion.button
            key={`${emoji}-${i}`}
            className={`ispy__item ${found.has(emoji) ? 'ispy__item--found' : ''} ${wrong === emoji ? 'ispy__item--wrong' : ''}`}
            onClick={() => handleTap(emoji)}
            whileTap={{ scale: 0.85 }}
          >
            {emoji}
          </motion.button>
        ))}
      </div>
      <div className="ispy__count">
        {found.size} / {targets.length}
      </div>
    </div>
  );
}
