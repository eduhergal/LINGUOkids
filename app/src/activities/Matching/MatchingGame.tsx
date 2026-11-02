import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { localized } from '@/services/i18n';
import type { I18nString } from '@/types';
import './MatchingGame.css';

interface Pair {
  image: string;
  word: I18nString;
}

interface Props {
  pairs: Pair[];
  onComplete: (score: number) => void;
}

export function MatchingGame({ pairs, onComplete }: Props) {
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [wrongPair, setWrongPair] = useState<[number, number] | null>(null);
  const [errors, setErrors] = useState(0);

  const shuffledWords = useMemo(
    () => pairs.map((_, i) => i).sort(() => Math.random() - 0.5),
    [pairs],
  );

  const handleImageTap = (index: number) => {
    if (matched.has(index)) return;
    setSelectedImage(index);
    setWrongPair(null);
  };

  const handleWordTap = (originalIndex: number) => {
    if (matched.has(originalIndex) || selectedImage === null) return;

    if (selectedImage === originalIndex) {
      const next = new Set(matched);
      next.add(originalIndex);
      setMatched(next);
      setSelectedImage(null);
      if (next.size === pairs.length) {
        const score = errors === 0 ? 3 : errors <= 2 ? 2 : 1;
        setTimeout(() => onComplete(score), 400);
      }
    } else {
      setWrongPair([selectedImage, originalIndex]);
      setErrors((e) => e + 1);
      setTimeout(() => {
        setWrongPair(null);
        setSelectedImage(null);
      }, 500);
    }
  };

  return (
    <div className="matching">
      <div className="matching__column">
        {pairs.map((pair, i) => (
          <motion.button
            key={`img-${i}`}
            className={`matching__card ${
              matched.has(i)
                ? 'matching__card--matched'
                : selectedImage === i
                  ? 'matching__card--selected'
                  : wrongPair?.[0] === i
                    ? 'matching__card--wrong'
                    : ''
            }`}
            onClick={() => handleImageTap(i)}
            whileTap={{ scale: 0.95 }}
          >
            <span style={{ fontSize: 36 }}>{pair.image}</span>
          </motion.button>
        ))}
      </div>
      <div className="matching__column">
        {shuffledWords.map((origIdx) => (
          <motion.button
            key={`word-${origIdx}`}
            className={`matching__card matching__card--word ${
              matched.has(origIdx)
                ? 'matching__card--matched'
                : wrongPair?.[1] === origIdx
                  ? 'matching__card--wrong'
                  : ''
            }`}
            onClick={() => handleWordTap(origIdx)}
            whileTap={{ scale: 0.95 }}
          >
            {localized(pairs[origIdx].word)}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
