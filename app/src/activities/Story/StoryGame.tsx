import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { localized } from '@/services/i18n';
import { useTheme } from '@/themes/ThemeContext';
import { hapticFeedback, playTone } from '@/services/feedback';
import type { I18nString } from '@/types';
import './StoryGame.css';

interface StoryPage {
  text: I18nString;
  emoji: string;
  bg: string;
}

interface StoryQuestion {
  question: I18nString;
  options: Array<{ text: I18nString; correct: boolean }>;
}

interface Props {
  story: {
    title: I18nString;
    pages: StoryPage[];
    questions: StoryQuestion[];
  };
  onComplete: (stars: number) => void;
}

type CaseMode = 'mixed' | 'upper';

export function StoryGame({ story, onComplete }: Props) {
  const { theme } = useTheme();
  const [pageIndex, setPageIndex] = useState(0);
  const [phase, setPhase] = useState<'reading' | 'questions'>('reading');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answered, setAnswered] = useState<null | boolean>(null);
  const [caseMode, setCaseMode] = useState<CaseMode>(() => {
    try { return (localStorage.getItem('lk-story-case') as CaseMode) || 'mixed'; } catch { return 'mixed'; }
  });
  const [direction, setDirection] = useState(1);
  const speakingRef = useRef(false);

  const totalPages = story.pages.length;
  const page = story.pages[pageIndex];
  const question = story.questions[questionIndex];

  const applyCase = (text: string) => caseMode === 'upper' ? text.toUpperCase() : text;

  const toggleCase = () => {
    const next: CaseMode = caseMode === 'mixed' ? 'upper' : 'mixed';
    setCaseMode(next);
    try { localStorage.setItem('lk-story-case', next); } catch {}
  };

  const speak = useCallback(() => {
    if (speakingRef.current || typeof speechSynthesis === 'undefined') return;
    speechSynthesis.cancel();
    const text = localized(page.text);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    const lang = (document.documentElement.lang || 'es').startsWith('en') ? 'en-US' : 'es-ES';
    utterance.lang = lang;
    speakingRef.current = true;
    utterance.onend = () => { speakingRef.current = false; };
    utterance.onerror = () => { speakingRef.current = false; };
    speechSynthesis.speak(utterance);
  }, [page]);

  const goNext = () => {
    if (pageIndex < totalPages - 1) {
      setDirection(1);
      setPageIndex(pageIndex + 1);
    } else {
      setPhase('questions');
    }
  };

  const goPrev = () => {
    if (pageIndex > 0) {
      setDirection(-1);
      setPageIndex(pageIndex - 1);
    }
  };

  const handleAnswer = (correct: boolean) => {
    if (answered !== null) return;
    setAnswered(correct);
    if (correct) {
      setCorrectCount((c) => c + 1);
      hapticFeedback('success');
      playTone('correct');
    } else {
      hapticFeedback('error');
      playTone('wrong');
    }
    setTimeout(() => {
      setAnswered(null);
      if (questionIndex < story.questions.length - 1) {
        setQuestionIndex(questionIndex + 1);
      } else {
        const total = story.questions.length;
        const score = correct ? correctCount + 1 : correctCount;
        const ratio = score / total;
        const stars = ratio >= 0.9 ? 3 : ratio >= 0.5 ? 2 : 1;
        onComplete(stars);
      }
    }, 1200);
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  if (phase === 'questions' && question) {
    return (
      <div className="story-game" style={{ background: story.pages[totalPages - 1].bg }}>
        <div className="story-game__toolbar">
          <span className="story-game__title">{applyCase(localized(story.title))}</span>
        </div>
        <div className="story-game__questions">
          <span className="story-game__question-count">
            {questionIndex + 1} / {story.questions.length}
          </span>
          <AnimatePresence mode="wait">
            <motion.div
              key={questionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: '100%' }}
            >
              <p className="story-game__question-text">
                {applyCase(localized(question.question))}
              </p>
              {answered !== null && (
                <motion.span
                  className="story-game__feedback"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                >
                  {answered ? '✅' : '❌'}
                </motion.span>
              )}
              <div className="story-game__options">
                {question.options.map((opt, i) => {
                  let className = 'story-game__option';
                  if (answered !== null) {
                    if (opt.correct) className += ' story-game__option--correct';
                    else if (answered === false && i === question.options.findIndex((o) => !o.correct && answered !== null))
                      className += ' story-game__option--wrong';
                  }
                  return (
                    <motion.button
                      key={i}
                      className={className}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAnswer(opt.correct)}
                      disabled={answered !== null}
                    >
                      {applyCase(localized(opt.text))}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="story-game" style={{ background: page.bg }}>
      <div className="story-game__toolbar">
        <div className="story-game__toolbar-left">
          <button
            className={`story-game__tool-btn ${caseMode === 'upper' ? 'story-game__tool-btn--active' : ''}`}
            onClick={toggleCase}
            aria-label="Toggle case"
          >
            {caseMode === 'upper' ? 'AA' : 'Aa'}
          </button>
          <button
            className="story-game__tool-btn"
            onClick={speak}
            aria-label="Read aloud"
          >
            🔊
          </button>
        </div>
        <span className="story-game__title">{applyCase(localized(story.title))}</span>
        <div className="story-game__toolbar-right">
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
            {pageIndex + 1}/{totalPages}
          </span>
        </div>
      </div>

      <div className="story-game__page-area">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={pageIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <motion.div
              className="story-game__emoji"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              {page.emoji}
            </motion.div>
            <p className="story-game__text">
              {applyCase(localized(page.text))}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <nav className="story-game__nav">
        <button
          className="story-game__nav-btn"
          onClick={goPrev}
          disabled={pageIndex === 0}
          style={{ background: pageIndex > 0 ? `${theme.colors.primary}88` : undefined }}
        >
          ←
        </button>
        <div className="story-game__dots">
          {story.pages.map((_, i) => (
            <div
              key={i}
              className={`story-game__dot ${i === pageIndex ? 'story-game__dot--active' : i < pageIndex ? 'story-game__dot--done' : ''}`}
            />
          ))}
        </div>
        <button
          className="story-game__nav-btn"
          onClick={goNext}
          style={{ background: `${theme.colors.primary}cc` }}
        >
          {pageIndex === totalPages - 1 ? '✓' : '→'}
        </button>
      </nav>
    </div>
  );
}
