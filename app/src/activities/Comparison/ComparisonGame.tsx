import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/themes/ThemeContext';
import { useApp } from '@/hooks/useAppState';
import { hapticFeedback, playTone } from '@/services/feedback';
import { getConstructiveMessage } from '@/services/adaptiveDifficulty';
import './ComparisonGame.css';

interface Props {
  leftCount: number;
  rightCount: number;
  leftEmoji: string;
  rightEmoji: string;
  onComplete: (stars: number) => void;
}

interface Round {
  left: number;
  right: number;
  leftEmoji: string;
  rightEmoji: string;
  mode: 'more' | 'less';
}

const EMOJIS = ['🍎', '🌟', '⚽', '🎈', '🐱', '🦋', '🚀', '🎨', '🍌', '🐶'];

function makeRounds(p: Props): Round[] {
  const rounds: Round[] = [
    { left: p.leftCount, right: p.rightCount, leftEmoji: p.leftEmoji, rightEmoji: p.rightEmoji, mode: Math.random() > 0.5 ? 'more' : 'less' },
  ];
  for (let i = 1; i < 5; i++) {
    const a = 1 + Math.floor(Math.random() * 9);
    let b = 1 + Math.floor(Math.random() * 9);
    while (b === a) b = 1 + Math.floor(Math.random() * 9);
    rounds.push({
      left: a,
      right: b,
      leftEmoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      rightEmoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      mode: Math.random() > 0.5 ? 'more' : 'less',
    });
  }
  return rounds;
}

export function ComparisonGame({ leftCount, rightCount, leftEmoji, rightEmoji, onComplete }: Props) {
  const { theme } = useTheme();
  const { settings } = useApp();
  const locale = settings?.locale ?? 'es';
  const [rounds] = useState<Round[]>(() => makeRounds({ leftCount, rightCount, leftEmoji, rightEmoji, onComplete }));
  const [current, setCurrent] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const round = rounds[current];

  const correctSide: 'left' | 'right' = useMemo(() => {
    if (round.mode === 'more') return round.left > round.right ? 'left' : 'right';
    return round.left < round.right ? 'left' : 'right';
  }, [round]);

  const handlePick = useCallback(
    (side: 'left' | 'right') => {
      if (feedback) return;
      const isCorrect = side === correctSide;
      setFeedback(isCorrect ? 'correct' : 'wrong');

      if (isCorrect) {
        hapticFeedback('success');
        playTone('correct');
        setCorrect((c) => c + 1);
      } else {
        hapticFeedback('error');
        playTone('wrong');
      }

      setTimeout(() => {
        setFeedback(null);
        if (current + 1 >= 5) {
          const c = correct + (isCorrect ? 1 : 0);
          const stars = c >= 5 ? 3 : c >= 3 ? 2 : 1;
          onComplete(stars);
        } else {
          setCurrent((c) => c + 1);
        }
      }, 1000);
    },
    [feedback, correctSide, current, correct, onComplete],
  );

  const questionText =
    round.mode === 'more'
      ? locale === 'es'
        ? '¿Cuál tiene MÁS?'
        : 'Which has MORE?'
      : locale === 'es'
        ? '¿Cuál tiene MENOS?'
        : 'Which has LESS?';

  return (
    <div className="comparison-game">
      <div className="comparison-game__progress">
        {rounds.map((_, i) => (
          <div
            key={i}
            className="comparison-game__dot"
            style={{
              background: i < current ? theme.colors.primary : i === current ? theme.colors.accent : 'rgba(255,255,255,0.2)',
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          className="comparison-game__round"
        >
          <h2 className="comparison-game__question" style={{ color: theme.colors.primary }}>
            {questionText}
          </h2>

          <div className="comparison-game__groups">
            <button
              className={`comparison-game__group ${feedback === 'correct' && correctSide === 'left' ? 'comparison-game__group--correct' : ''} ${feedback === 'wrong' && correctSide !== 'left' ? 'comparison-game__group--wrong' : ''}`}
              onClick={() => handlePick('left')}
              disabled={!!feedback}
            >
              <div className="comparison-game__items">
                {Array.from({ length: round.left }).map((_, i) => (
                  <span key={i} className="comparison-game__item">
                    {round.leftEmoji}
                  </span>
                ))}
              </div>
              <span className="comparison-game__count">{round.left}</span>
            </button>

            <span className="comparison-game__vs">VS</span>

            <button
              className={`comparison-game__group ${feedback === 'correct' && correctSide === 'right' ? 'comparison-game__group--correct' : ''} ${feedback === 'wrong' && correctSide !== 'right' ? 'comparison-game__group--wrong' : ''}`}
              onClick={() => handlePick('right')}
              disabled={!!feedback}
            >
              <div className="comparison-game__items">
                {Array.from({ length: round.right }).map((_, i) => (
                  <span key={i} className="comparison-game__item">
                    {round.rightEmoji}
                  </span>
                ))}
              </div>
              <span className="comparison-game__count">{round.right}</span>
            </button>
          </div>

          {feedback === 'wrong' && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="comparison-game__feedback"
            >
              {getConstructiveMessage(false, locale)}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
