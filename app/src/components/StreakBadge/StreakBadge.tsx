import { useState, useEffect } from 'react';
import { getStreak } from '@/services/gamification';
import { useApp } from '@/hooks/useAppState';
import './StreakBadge.css';

export function StreakBadge() {
  const { activeChild } = useApp();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (activeChild) {
      getStreak(activeChild.id).then(setStreak);
    }
  }, [activeChild]);

  if (streak === 0) return null;

  return (
    <span className="streak-badge">
      🔥{streak}
    </span>
  );
}
