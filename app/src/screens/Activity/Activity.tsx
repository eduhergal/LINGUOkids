import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getActivity } from '@/data/curriculum';
import { recordActivity } from '@/services/progress';
import { incrementWeeklyGoal } from '@/services/gamification';
import { isFavorite, toggleFavorite } from '@/services/favorites';
import { localized, t } from '@/services/i18n';
import { useApp } from '@/hooks/useAppState';
import { useTheme } from '@/themes/ThemeContext';
import { Mascot } from '@/components/Mascot/Mascot';
import { Confetti } from '@/components/Confetti/Confetti';
import { SandTimer } from '@/components/SandTimer/SandTimer';
import { TutorialOverlay } from '@/components/TutorialOverlay/TutorialOverlay';
import { hapticFeedback, playTone } from '@/services/feedback';
import { hasSeen, markSeen, getSteps } from '@/services/tutorial';
import { PhonicsIdentify } from '@/activities/PhonicsIdentify/PhonicsIdentify';
import { PhonicsTrace } from '@/activities/PhonicsTrace/PhonicsTrace';
import { MatchingGame } from '@/activities/Matching/MatchingGame';
import { MemoryCardsGame } from '@/activities/MemoryCards/MemoryCardsGame';
import { ShowAndTellGame } from '@/activities/ShowAndTell/ShowAndTellGame';
import { ISpyGame } from '@/activities/ISpy/ISpyGame';
import { ColoringGame } from '@/activities/Coloring/ColoringGame';
import { DragAndDropGame } from '@/activities/DragAndDrop/DragAndDropGame';
import { WordBuilderGame } from '@/activities/WordBuilder/WordBuilderGame';
import { SortingGame } from '@/activities/Sorting/SortingGame';
import type { ActivityType } from '@/types';
import type { TutorialStep } from '@/services/tutorial';
import './Activity.css';

export function Activity() {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const { activeChild } = useApp();
  const { theme } = useTheme();
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [fav, setFav] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [tutorialSteps, setTutorialSteps] = useState<TutorialStep[] | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  const activity = activityId ? getActivity(activityId) : undefined;

  useEffect(() => {
    if (activeChild && activityId) {
      isFavorite(activeChild.id, activityId).then(setFav);
    }
  }, [activeChild, activityId]);

  useEffect(() => {
    if (!activeChild || !activity) return;
    hasSeen(activeChild.id, activity.type as ActivityType).then((seen) => {
      if (!seen) {
        const steps = getSteps(activity.type);
        if (steps.length > 0) {
          setTutorialSteps(steps);
          setShowTutorial(true);
        }
      }
    });
  }, [activeChild, activity]);

  const handleTutorialDone = useCallback(() => {
    setShowTutorial(false);
    if (activeChild && activity) {
      markSeen(activeChild.id, activity.type as ActivityType);
    }
  }, [activeChild, activity]);

  const handleToggleFav = useCallback(async () => {
    if (!activeChild || !activityId) return;
    hapticFeedback('light');
    playTone('tap');
    const nowFav = await toggleFavorite(activeChild.id, activityId);
    setFav(nowFav);
  }, [activeChild, activityId]);

  const handleComplete = useCallback(
    async (stars: number) => {
      setScore(stars);
      setCompleted(true);
      setShowConfetti(true);
      hapticFeedback('success');
      playTone('complete');

      if (activeChild && activity) {
        await recordActivity(
          activeChild.id,
          activity.id,
          stars,
          Date.now() - startTime,
          1,
        );
        await incrementWeeklyGoal(activeChild.id);
      }
    },
    [activeChild, activity, startTime],
  );

  if (!activity) {
    return (
      <div className="screen screen-no-nav activity-screen">
        <p>Activity not found</p>
        <button onClick={() => navigate(-1)}>← Back</button>
      </div>
    );
  }

  const renderGame = () => {
    const cfg = activity.config as Record<string, unknown>;

    switch (activity.type) {
      case 'phonics_identify':
        return (
          <PhonicsIdentify
            target={cfg.target as string}
            distractors={cfg.distractors as string[]}
            onComplete={handleComplete}
          />
        );
      case 'matching':
        return (
          <MatchingGame
            pairs={cfg.pairs as Array<{ image: string; word: { en: string; es: string } }>}
            onComplete={handleComplete}
          />
        );
      case 'memory_cards':
        return (
          <MemoryCardsGame
            cards={cfg.cards as string[]}
            onComplete={handleComplete}
          />
        );
      case 'show_and_tell':
        return (
          <ShowAndTellGame
            items={cfg.items as Array<{ emoji: string; name: { en: string; es: string } }>}
            onComplete={handleComplete}
          />
        );
      case 'i_spy':
        return (
          <ISpyGame
            targets={cfg.targets as string[]}
            scene={cfg.scene as string[]}
            onComplete={handleComplete}
          />
        );
      case 'phonics_trace':
        return (
          <PhonicsTrace
            letter={cfg.letter as string}
            svgPath={cfg.svgPath as string}
            onComplete={handleComplete}
          />
        );
      case 'coloring':
        return (
          <ColoringGame
            shape={cfg.shape as string}
            availableColors={cfg.availableColors as string[]}
            onComplete={handleComplete}
          />
        );
      case 'drag_and_drop':
        return (
          <DragAndDropGame
            items={cfg.items as Array<{ id: string; emoji: string; label: { en: string; es: string } }>}
            zones={cfg.zones as Array<{ id: string; label: { en: string; es: string }; accepts: string[] }>}
            onComplete={handleComplete}
          />
        );
      case 'word_builder':
        return (
          <WordBuilderGame
            word={cfg.word as string}
            hint={cfg.hint as { en: string; es: string }}
            emoji={cfg.emoji as string}
            onComplete={handleComplete}
          />
        );
      case 'sorting':
        return (
          <SortingGame
            items={cfg.items as string[]}
            correctOrder={cfg.correctOrder as string[]}
            onComplete={handleComplete}
          />
        );
      default:
        return (
          <div className="activity-placeholder">
            <span style={{ fontSize: 64 }}>🚧</span>
            <p>{activity.type} — coming soon</p>
            <button className="activity-placeholder__btn" onClick={() => handleComplete(3)}>
              Skip (dev)
            </button>
          </div>
        );
    }
  };

  return (
    <div className="screen screen-no-nav activity-screen">
      <AnimatePresence>
        {showTutorial && tutorialSteps && (
          <TutorialOverlay steps={tutorialSteps} onDone={handleTutorialDone} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {completed ? (
          <motion.div
            key="rewards"
            className="rewards-overlay"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: `linear-gradient(160deg, ${theme.colors.gradientEnd}, ${theme.colors.gradientMid})`,
              color: theme.colors.textOnGradient,
            }}
          >
            <Confetti active={showConfetti} />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              style={{ fontSize: 64, marginBottom: 16 }}
            >
              {theme.mascot.emoji}
            </motion.div>
            <h2 className="rewards-overlay__title">{t('activity.great')}</h2>
            <div className="rewards-overlay__stars">
              {[1, 2, 3].map((s) => (
                <motion.span
                  key={s}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4 + s * 0.2, type: 'spring' }}
                  style={{ fontSize: 48 }}
                >
                  {s <= score ? '⭐' : '☆'}
                </motion.span>
              ))}
            </div>
            <div style={{ marginBottom: 24 }}>
              <Mascot size="sm" />
            </div>
            <button
              className="rewards-overlay__btn"
              onClick={() => navigate(-1)}
              style={{ background: theme.colors.primary }}
            >
              {t('activity.backToLesson')}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="game"
            className="activity-game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <header className="activity-game__header">
              <button className="activity-game__exit" onClick={() => navigate(-1)}>
                ✕
              </button>
              <span className="activity-game__instruction">
                {localized(activity.instructions)}
              </span>
              <SandTimer />
              <button className="activity-game__fav" onClick={handleToggleFav}>
                {fav ? '⭐' : '☆'}
              </button>
            </header>
            <div className="activity-game__area">{renderGame()}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
