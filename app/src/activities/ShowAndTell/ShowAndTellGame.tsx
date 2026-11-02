import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { localized } from '@/services/i18n';
import type { I18nString } from '@/types';
import './ShowAndTellGame.css';

interface Item {
  emoji: string;
  name: I18nString;
}

interface Props {
  items: Item[];
  onComplete: (score: number) => void;
}

export function ShowAndTellGame({ items, onComplete }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [wrong, setWrong] = useState<string | null>(null);
  const [errors, setErrors] = useState(0);

  const target = items[currentIdx];
  const shuffled = useMemo(
    () => [...items].sort(() => Math.random() - 0.5),
    [items],
  );

  const handleTap = (item: Item) => {
    if (item.emoji === target.emoji) {
      if (currentIdx + 1 >= items.length) {
        const score = errors === 0 ? 3 : errors <= 2 ? 2 : 1;
        onComplete(score);
      } else {
        setCurrentIdx((i) => i + 1);
      }
    } else {
      setWrong(item.emoji);
      setErrors((e) => e + 1);
      setTimeout(() => setWrong(null), 400);
    }
  };

  return (
    <div className="show-tell">
      <div className="show-tell__prompt">
        <span className="show-tell__word">{localized(target.name)}</span>
      </div>
      <div className="show-tell__options">
        {shuffled.map((item) => (
          <motion.button
            key={item.emoji}
            className={`show-tell__option ${wrong === item.emoji ? 'show-tell__option--wrong' : ''}`}
            onClick={() => handleTap(item)}
            whileTap={{ scale: 0.9 }}
          >
            <span style={{ fontSize: 48 }}>{item.emoji}</span>
          </motion.button>
        ))}
      </div>
      <div className="show-tell__progress">
        {currentIdx + 1} / {items.length}
      </div>
    </div>
  );
}
