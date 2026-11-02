import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import './PhonicsIdentify.css';

interface Props {
  target: string;
  distractors: string[];
  onComplete: (score: number) => void;
}

export function PhonicsIdentify({ target, distractors, onComplete }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const options = useMemo(() => {
    const all = [target, ...distractors];
    return all.sort(() => Math.random() - 0.5);
  }, [target, distractors]);

  const handleTap = (letter: string) => {
    if (selected) return;

    if (letter === target) {
      setSelected(letter);
      const score = attempts === 0 ? 3 : attempts === 1 ? 2 : 1;
      setTimeout(() => onComplete(score), 600);
    } else {
      setWrong(letter);
      setAttempts((a) => a + 1);
      setTimeout(() => setWrong(null), 400);
    }
  };

  return (
    <div className="phonics-id">
      <div className="phonics-id__prompt">
        <span className="phonics-id__target-letter">{target}</span>
      </div>
      <div className="phonics-id__options">
        {options.map((letter) => (
          <motion.button
            key={letter}
            className={`phonics-id__option ${
              selected === letter ? 'phonics-id__option--correct' : ''
            } ${wrong === letter ? 'phonics-id__option--wrong' : ''}`}
            onClick={() => handleTap(letter)}
            whileTap={{ scale: 0.9 }}
          >
            {letter}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
