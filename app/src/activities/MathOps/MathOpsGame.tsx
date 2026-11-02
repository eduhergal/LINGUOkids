import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/themes/ThemeContext';
import { useApp } from '@/hooks/useAppState';
import { hapticFeedback, playTone } from '@/services/feedback';
import { getConstructiveMessage } from '@/services/adaptiveDifficulty';
import './MathOpsGame.css';

interface Props {
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  num1: number;
  num2: number;
  options: number[];
  onComplete: (stars: number) => void;
}

interface Problem {
  op: 'add' | 'subtract' | 'multiply' | 'divide';
  a: number;
  b: number;
  answer: number;
  options: number[];
  emoji: string;
}

const OP_EMOJIS = ['🍎', '🌟', '⚽', '🎈', '🐱', '🦋', '🍌', '🎨'];

function solve(op: string, a: number, b: number): number {
  if (op === 'add') return a + b;
  if (op === 'subtract') return a - b;
  if (op === 'multiply') return a * b;
  return Math.floor(a / b);
}

function makeOptions(answer: number): number[] {
  const opts = new Set<number>([answer]);
  while (opts.size < 3) {
    const offset = Math.floor(Math.random() * 5) + 1;
    const wrong = answer + (Math.random() > 0.5 ? offset : -offset);
    if (wrong >= 0 && wrong !== answer) opts.add(wrong);
  }
  return [...opts].sort(() => Math.random() - 0.5);
}

function makeProblems(p: Props): Problem[] {
  const problems: Problem[] = [];
  problems.push({
    op: p.operation,
    a: p.num1,
    b: p.num2,
    answer: solve(p.operation, p.num1, p.num2),
    options: p.options.length >= 3 ? p.options : makeOptions(solve(p.operation, p.num1, p.num2)),
    emoji: OP_EMOJIS[Math.floor(Math.random() * OP_EMOJIS.length)],
  });
  for (let i = 1; i < 5; i++) {
    let a: number, b: number;
    if (p.operation === 'add') {
      a = 1 + Math.floor(Math.random() * 8);
      b = 1 + Math.floor(Math.random() * (10 - a));
    } else if (p.operation === 'subtract') {
      a = 2 + Math.floor(Math.random() * 8);
      b = 1 + Math.floor(Math.random() * (a - 1));
    } else if (p.operation === 'multiply') {
      a = 2 + Math.floor(Math.random() * 4);
      b = 2 + Math.floor(Math.random() * 4);
    } else {
      b = [2, 3, 5][Math.floor(Math.random() * 3)];
      a = b * (1 + Math.floor(Math.random() * 4));
    }
    const ans = solve(p.operation, a, b);
    problems.push({
      op: p.operation,
      a,
      b,
      answer: ans,
      options: makeOptions(ans),
      emoji: OP_EMOJIS[Math.floor(Math.random() * OP_EMOJIS.length)],
    });
  }
  return problems;
}

const OP_SYMBOL: Record<string, string> = { add: '+', subtract: '−', multiply: '×', divide: '÷' };

function EmojiGroup({ count, emoji, crossed }: { count: number; emoji: string; crossed?: boolean }) {
  return (
    <span className={`mathops-game__emoji-group ${crossed ? 'mathops-game__emoji-group--crossed' : ''}`}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="mathops-game__emoji">{emoji}</span>
      ))}
    </span>
  );
}

function VisualProblem({ problem }: { problem: Problem }) {
  const { a, b, emoji, op } = problem;

  if (op === 'add') {
    return (
      <div className="mathops-game__visual">
        <EmojiGroup count={a} emoji={emoji} />
        <span className="mathops-game__op">+</span>
        <EmojiGroup count={b} emoji={emoji} />
        <span className="mathops-game__op">=</span>
        <span className="mathops-game__question-mark">?</span>
      </div>
    );
  }

  if (op === 'subtract') {
    return (
      <div className="mathops-game__visual">
        <span className="mathops-game__sub-group">
          <EmojiGroup count={a - b} emoji={emoji} />
          <EmojiGroup count={b} emoji={emoji} crossed />
        </span>
        <span className="mathops-game__op">=</span>
        <span className="mathops-game__question-mark">?</span>
      </div>
    );
  }

  if (op === 'multiply') {
    return (
      <div className="mathops-game__visual mathops-game__visual--grid">
        {Array.from({ length: a }).map((_, gi) => (
          <div key={gi} className="mathops-game__mul-row">
            <EmojiGroup count={b} emoji={emoji} />
          </div>
        ))}
        <span className="mathops-game__op">=</span>
        <span className="mathops-game__question-mark">?</span>
      </div>
    );
  }

  // divide
  return (
    <div className="mathops-game__visual mathops-game__visual--grid">
      <EmojiGroup count={a} emoji={emoji} />
      <span className="mathops-game__op">÷ {b} =</span>
      <span className="mathops-game__question-mark">?</span>
    </div>
  );
}

export function MathOpsGame({ operation, num1, num2, options, onComplete }: Props) {
  const { theme } = useTheme();
  const { settings } = useApp();
  const locale = settings?.locale ?? 'es';
  const [problems] = useState<Problem[]>(() => makeProblems({ operation, num1, num2, options, onComplete }));
  const [current, setCurrent] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const problem = problems[current];

  const handleAnswer = useCallback(
    (val: number) => {
      if (feedback) return;
      setSelectedOption(val);
      const isCorrect = val === problem.answer;
      setFeedback(isCorrect ? 'correct' : 'wrong');

      if (isCorrect) {
        hapticFeedback('success');
        playTone('correct');
        setCorrectCount((c) => c + 1);
      } else {
        hapticFeedback('error');
        playTone('wrong');
      }

      setTimeout(() => {
        setFeedback(null);
        setSelectedOption(null);
        if (current + 1 >= 5) {
          const c = correctCount + (isCorrect ? 1 : 0);
          const stars = c >= 5 ? 3 : c >= 3 ? 2 : 1;
          onComplete(stars);
        } else {
          setCurrent((c) => c + 1);
        }
      }, 1200);
    },
    [feedback, problem, current, correctCount, onComplete],
  );

  return (
    <div className="mathops-game">
      <div className="mathops-game__progress">
        {problems.map((_, i) => (
          <div
            key={i}
            className="mathops-game__dot"
            style={{
              background: i < current ? theme.colors.primary : i === current ? theme.colors.accent : 'rgba(255,255,255,0.2)',
            }}
          />
        ))}
      </div>

      <div className="mathops-game__formula" style={{ color: theme.colors.primary }}>
        {problem.a} {OP_SYMBOL[problem.op]} {problem.b} = ?
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="mathops-game__body"
        >
          <VisualProblem problem={problem} />

          <div className="mathops-game__options">
            {problem.options.map((opt) => {
              let cls = 'mathops-game__option';
              if (feedback && selectedOption === opt) {
                cls += feedback === 'correct' ? ' mathops-game__option--correct' : ' mathops-game__option--wrong';
              }
              if (feedback && opt === problem.answer && feedback === 'wrong') {
                cls += ' mathops-game__option--reveal';
              }
              return (
                <motion.button
                  key={opt}
                  className={cls}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!feedback}
                  style={{ borderColor: feedback === null ? theme.colors.primary : undefined }}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>

          {feedback === 'wrong' && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mathops-game__msg"
            >
              {getConstructiveMessage(false, locale)}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
