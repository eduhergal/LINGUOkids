import { useState } from 'react';
import { motion } from 'framer-motion';
import './ColoringGame.css';

interface Props {
  shape: string;
  availableColors: string[];
  onComplete: (score: number) => void;
}

const SHAPES: Record<string, Array<{ id: string; d: string; label: string }>> = {
  star: [
    { id: 'outer', d: 'M50 5 L61 40 L98 40 L68 62 L79 97 L50 75 L21 97 L32 62 L2 40 L39 40 Z', label: 'star' },
    { id: 'center', d: 'M50 30 L55 45 L70 45 L58 55 L62 70 L50 60 L38 70 L42 55 L30 45 L45 45 Z', label: 'inner' },
  ],
  heart: [
    { id: 'heart', d: 'M50 88 Q10 55 10 30 Q10 5 30 5 Q50 5 50 25 Q50 5 70 5 Q90 5 90 30 Q90 55 50 88 Z', label: 'heart' },
  ],
  house: [
    { id: 'roof', d: 'M10 50 L50 15 L90 50 Z', label: 'roof' },
    { id: 'wall', d: 'M20 50 L80 50 L80 90 L20 90 Z', label: 'wall' },
    { id: 'door', d: 'M42 65 L58 65 L58 90 L42 90 Z', label: 'door' },
    { id: 'window', d: 'M28 58 L38 58 L38 72 L28 72 Z', label: 'window' },
  ],
};

export function ColoringGame({ shape, availableColors, onComplete }: Props) {
  const regions = SHAPES[shape] ?? SHAPES.star;
  const [fills, setFills] = useState<Record<string, string>>({});
  const [activeColor, setActiveColor] = useState(availableColors[0]);
  const [completed, setCompleted] = useState(false);

  const handleRegionClick = (id: string) => {
    if (completed) return;
    setFills((prev) => {
      const next = { ...prev, [id]: activeColor };
      if (Object.keys(next).length === regions.length && !completed) {
        setCompleted(true);
        setTimeout(() => onComplete(3), 600);
      }
      return next;
    });
  };

  return (
    <div className="coloring">
      <svg className="coloring__canvas" viewBox="0 0 100 100">
        {regions.map((r) => (
          <motion.path
            key={r.id}
            d={r.d}
            fill={fills[r.id] ?? '#ffffff'}
            stroke="var(--color-neutral-400)"
            strokeWidth="1.5"
            onClick={() => handleRegionClick(r.id)}
            whileTap={{ scale: 0.97 }}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </svg>
      <div className="coloring__palette">
        {availableColors.map((color) => (
          <button
            key={color}
            className={`coloring__swatch ${activeColor === color ? 'coloring__swatch--active' : ''}`}
            style={{ background: color }}
            onClick={() => setActiveColor(color)}
            aria-label={color}
          />
        ))}
      </div>
    </div>
  );
}
