import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SortingGame.css';

interface Props {
  items: string[];
  correctOrder: string[];
  onComplete: (score: number) => void;
}

export function SortingGame({ items, correctOrder, onComplete }: Props) {
  const shuffled = useMemo(
    () => [...items].sort(() => Math.random() - 0.5),
    [items],
  );

  const [placed, setPlaced] = useState<string[]>([]);
  const [errors, setErrors] = useState(0);
  const [wrong, setWrong] = useState<string | null>(null);

  const available = shuffled.filter((it) => !placed.includes(it));

  const handleTap = (item: string) => {
    const nextExpected = correctOrder[placed.length];
    if (item === nextExpected) {
      const next = [...placed, item];
      setPlaced(next);
      if (next.length === correctOrder.length) {
        const score = errors === 0 ? 3 : errors <= 2 ? 2 : 1;
        setTimeout(() => onComplete(score), 500);
      }
    } else {
      setErrors((e) => e + 1);
      setWrong(item);
      setTimeout(() => setWrong(null), 400);
    }
  };

  return (
    <div className="sorting">
      <div className="sorting__placed">
        <AnimatePresence>
          {placed.map((item, i) => (
            <motion.div
              key={item}
              className="sorting__placed-item"
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              {item}
            </motion.div>
          ))}
        </AnimatePresence>
        {correctOrder.slice(placed.length).map((_, i) => (
          <div key={`empty-${i}`} className="sorting__empty-slot">?</div>
        ))}
      </div>

      <div className="sorting__available">
        {available.map((item) => (
          <motion.button
            key={item}
            className={`sorting__option ${wrong === item ? 'sorting__option--wrong' : ''}`}
            onClick={() => handleTap(item)}
            whileTap={{ scale: 0.9 }}
            layout
          >
            {item}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
