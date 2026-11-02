import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { t } from '@/services/i18n';
import { getFavorites } from '@/services/favorites';
import { getActivity } from '@/data/curriculum';
import { useApp } from '@/hooks/useAppState';
import { ActivityCard } from '@/components/ActivityCard/ActivityCard';
import type { Favorite, ActivityDef } from '@/types';
import './Favorites.css';

export function Favorites() {
  const { activeChild } = useApp();
  const [favs, setFavs] = useState<Array<{ fav: Favorite; activity: ActivityDef }>>([]);

  useEffect(() => {
    if (!activeChild) return;
    getFavorites(activeChild.id).then((list) => {
      const resolved = list
        .map((f) => ({ fav: f, activity: getActivity(f.activityId) }))
        .filter((x): x is { fav: Favorite; activity: ActivityDef } => !!x.activity);
      setFavs(resolved);
    });
  }, [activeChild]);

  return (
    <div className="screen favorites">
      <h1 className="favorites__title">{t('favorites.title')}</h1>
      {favs.length === 0 ? (
        <div className="favorites__empty">
          <span className="favorites__empty-icon">⭐</span>
          <p>{t('favorites.empty')}</p>
        </div>
      ) : (
        <div className="favorites__grid">
          <AnimatePresence>
            {favs.map(({ activity }, i) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ActivityCard activity={activity} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
