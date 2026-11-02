import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/themes/ThemeContext';
import { hapticFeedback, playTone } from '@/services/feedback';
import './CountingGame.css';

interface Props {
  targetCount: number;
  emoji: string;
  onComplete: (stars: number) => void;
}

interface Obj {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  counted: boolean;
}

function scatter(count: number): Obj[] {
  const items: Obj[] = [];
  for (let i = 0; i < count; i++) {
    items.push({
      id: i,
      x: 10 + Math.random() * 70,
      y: 10 + Math.random() * 60,
      rotation: Math.random() * 30 - 15,
      scale: 0.9 + Math.random() * 0.3,
      counted: false,
    });
  }
  return items;
}

export function CountingGame({ targetCount, emoji, onComplete }: Props) {
  const { theme } = useTheme();
  const [objects, setObjects] = useState<Obj[]>(() => scatter(targetCount));
  const [count, setCount] = useState(0);
  const [wrongTaps, setWrongTaps] = useState(0);
  const [done, setDone] = useState(false);

  const handleTap = useCallback(
    (id: number) => {
      if (done) return;
      setObjects((prev) => {
        const obj = prev.find((o) => o.id === id);
        if (!obj || obj.counted) {
          setWrongTaps((w) => w + 1);
          hapticFeedback('error');
          return prev;
        }
        hapticFeedback('light');
        playTone('tap');
        const next = prev.map((o) => (o.id === id ? { ...o, counted: true } : o));
        const newCount = count + 1;
        setCount(newCount);
        if (newCount >= targetCount) {
          setDone(true);
          const stars = wrongTaps === 0 ? 3 : wrongTaps <= 2 ? 2 : 1;
          setTimeout(() => onComplete(stars), 600);
        }
        return next;
      });
    },
    [count, done, wrongTaps, targetCount, onComplete],
  );

  return (
    <div className="counting-game">
      <div className="counting-game__counter" style={{ color: theme.colors.primary }}>
        <motion.span
          key={count}
          initial={{ scale: 1.6, y: -10 }}
          animate={{ scale: 1, y: 0 }}
          className="counting-game__number"
        >
          {count}
        </motion.span>
        <span className="counting-game__target">/ {targetCount}</span>
      </div>

      <div className="counting-game__scene">
        {objects.map((obj) => (
          <motion.button
            key={obj.id}
            className={`counting-game__obj ${obj.counted ? 'counting-game__obj--counted' : ''}`}
            style={{
              left: `${obj.x}%`,
              top: `${obj.y}%`,
              transform: `rotate(${obj.rotation}deg) scale(${obj.scale})`,
            }}
            whileTap={{ scale: 1.4 }}
            animate={obj.counted ? { scale: 0.6, opacity: 0.4 } : {}}
            onClick={() => handleTap(obj.id)}
            disabled={obj.counted}
          >
            <span className="counting-game__emoji">{emoji}</span>
            <AnimatePresence>
              {obj.counted && (
                <motion.span
                  className="counting-game__check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  ✓
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
