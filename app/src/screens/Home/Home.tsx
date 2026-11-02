import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '@/hooks/useAppState';
import { useTheme } from '@/themes/ThemeContext';
import { getOrCreateWeeklyGoal } from '@/services/gamification';
import { getWeekActivities } from '@/services/progress';
import { t, localized } from '@/services/i18n';
import { worlds, activities } from '@/data/curriculum';
import { Mascot } from '@/components/Mascot/Mascot';
import { ProgressVisual } from '@/components/ProgressVisual/ProgressVisual';
import { StreakBadge } from '@/components/StreakBadge/StreakBadge';
import { ActivityCard } from '@/components/ActivityCard/ActivityCard';
import type { WeeklyGoal } from '@/types';
import './Home.css';

const AVATAR_EMOJIS: Record<string, string> = {
  'avatar-1': '🦁', 'avatar-2': '🐸', 'avatar-3': '🐻',
  'avatar-4': '🐰', 'avatar-5': '🦊', 'avatar-6': '🐼',
  'avatar-7': '🐨', 'avatar-8': '🐯',
};

export function Home() {
  const { activeChild } = useApp();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [goal, setGoal] = useState<WeeklyGoal | null>(null);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    if (!activeChild) return;
    getOrCreateWeeklyGoal(activeChild.id).then(setGoal);
    getWeekActivities(activeChild.id).then((acts) => {
      const ids = [...new Set(acts.map((a) => a.activityId))];
      setRecentIds(ids.slice(0, 4));
    });
  }, [activeChild]);

  if (!activeChild) return null;

  const recentActivities = recentIds
    .map((id) => activities.find((a) => a.id === id))
    .filter(Boolean);

  const suggestedActivities = activities
    .filter((a) => !recentIds.includes(a.id))
    .slice(0, 3);

  return (
    <div className="screen home home--themed">
      <header className="home__header">
        <div className="home__user">
          <span className="home__avatar">
            {AVATAR_EMOJIS[activeChild.avatarId] ?? '🧒'}
          </span>
          <div className="home__greeting">
            <span className="home__name">{t('home.greeting', { name: activeChild.name })}</span>
            <span className="home__subtitle">
              {t('home.mascotGuide', { mascot: localized(theme.mascot.name) })}
            </span>
          </div>
        </div>
        <div className="home__badges">
          <StreakBadge />
          <button className="home__switch" onClick={() => navigate('/children')}>🔄</button>
        </div>
      </header>

      <div className="home__mascot-row">
        <Mascot size="lg" />
      </div>

      {goal && (
        <section className="home__goal">
          <ProgressVisual completed={goal.completedActivities} total={goal.targetActivities} />
        </section>
      )}

      {suggestedActivities.length > 0 && (
        <section className="home__section">
          <h2 className="home__section-title">{t('home.dailyPicks')}</h2>
          <div className="home__activity-list">
            {suggestedActivities.map((act) => (
              <ActivityCard key={act!.id} activity={act!} />
            ))}
          </div>
        </section>
      )}

      {recentActivities.length > 0 && (
        <section className="home__section">
          <h2 className="home__section-title">{t('home.continueLearning')}</h2>
          <div className="home__activity-list">
            {recentActivities.map((act) => (
              <ActivityCard key={act!.id} activity={act!} />
            ))}
          </div>
        </section>
      )}

      <section className="home__section">
        <h2 className="home__section-title">{t('home.worlds')}</h2>
        <div className="home__worlds-grid">
          {worlds.map((world) => (
            <motion.button
              key={world.id}
              className="home__world-card"
              style={{ background: world.color }}
              onClick={() => navigate(`/lessons/${world.id}`)}
              whileTap={{ scale: 0.93 }}
            >
              <span className="home__world-icon">{world.icon}</span>
              <span className="home__world-name">{localized(world.name)}</span>
            </motion.button>
          ))}
        </div>
      </section>
    </div>
  );
}
